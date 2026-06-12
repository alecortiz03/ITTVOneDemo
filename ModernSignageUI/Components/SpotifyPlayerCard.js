// ------------ SPOTIFY PLAYER CARD ------------
// Import necessary libraries and components
import React, { useEffect, useRef, useState } from 'react';
// Import React Native components
import { View, Text, StyleSheet, Image } from 'react-native';
import { useWindowDimensions } from 'react-native';
// Import Tauri invoke for getting the Spotify connect URL
import { invoke } from '@tauri-apps/api/core';
// Import QR code generator
import { QRCode } from 'react-qrcode-logo';
import { Icons } from '@/AppData/Icons';

// ---------------------- SpotifyPlayerCard Component ------------------
// Function: Displays Spotify connection QR code, creates Spotify Web Playback device,
// plays Spotify audio through the app, and displays current track details.
// Props:
// - accessToken: Spotify user access token from your backend.
// - style: Custom styles for the card container.
// - backgroundColor: Background color of the card.
// - borderColor: Border color of the card.
// - textColor: Main text color.
// - subTextColor: Secondary text color.
// - borderRadius: Border radius for rounded corners.
// - borderWidth: Width of the border.
// Example usage:
// <SpotifyPlayerCard
//   accessToken={spotifyAccessToken}
//   backgroundColor="rgba(2, 2, 2, 0.61)"
//   borderColor="#212324bd"
//   textColor="#f8f6f6"
//   subTextColor="#cccccc"
//   borderRadius={60}
//   borderWidth={6}
// />

export default function SpotifyPlayerCard({
	accessToken /* Spotify access token */,
	style /* Custom styles for the card container */,
	backgroundColor = 'rgba(2, 2, 2, 0.61)' /* Background color of the card */,
	borderColor = '#212324bd' /* Border color of the card */,
	textColor = '#f8f6f6' /* Main text color */,
	subTextColor = '#cccccc' /* Secondary text color */,
	borderRadius = 60 /* Border radius */,
	borderWidth = 6 /* Border width */,
}) {
	console.log('HIT:     ', Icons.Spotify.uri);
	// ------------ State ------------
	const [status, setStatus] = useState('Loading Spotify QR...');
	const [deviceId, setDeviceId] = useState(null);
	const [connectUrl, setConnectUrl] = useState('');
	const [track, setTrack] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);

	// ------------ Refs ------------
	const playerRef = useRef(null);

	// ------------ Screen sizing ------------
	const { width: screenWidth, height: screenHeight } = useWindowDimensions();

	const componentWidth =
		screenWidth < 500 ? screenWidth * 0.85
		: screenWidth < 900 ? screenWidth * 0.2
		: screenWidth * 0.1;

	const componentHeight = Math.max(screenHeight * 0.2, 80);

	const albumArtSize =
		screenWidth < 500 ? 120
		: screenWidth < 900 ? 150
		: 100;

	const titleFontSize =
		screenWidth < 500 ? 20
		: screenWidth < 900 ? 24
		: 24;

	const songFontSize =
		screenWidth < 500 ? 16
		: screenWidth < 900 ? 20
		: 12;

	const artistFontSize =
		screenWidth < 500 ? 13
		: screenWidth < 900 ? 16
		: 9;

	const statusFontSize =
		screenWidth < 500 ? 12
		: screenWidth < 900 ? 15
		: 10;

	// ------------ Load QR connect URL ------------
	useEffect(() => {
		async function loadConnectUrl() {
			try {
				const url = await invoke('get_spotify_connect_url');
				setConnectUrl(url);
			} catch (error) {
				console.error('QR failed:', error);
				setStatus(`QR failed: ${String(error)}`);
			}
		}

		loadConnectUrl();
	}, []);

	// ------------ Spotify Web Playback SDK setup ------------
	useEffect(() => {
		if (!accessToken) return;

		function setupPlayer() {
			if (!window.Spotify) {
				setStatus('Spotify SDK not loaded yet...');
				return;
			}

			if (playerRef.current) {
				playerRef.current.disconnect();
				playerRef.current = null;
			}

			const player = new window.Spotify.Player({
				name: 'ITTVOne',
				getOAuthToken: (cb) => cb(accessToken),
				volume: 0.8,
			});

			playerRef.current = player;

			// ------------ Spotify device is ready ------------
			player.addListener('ready', ({ device_id }) => {
				console.log('Spotify device ready:', device_id);
				setDeviceId(device_id);
				setStatus('Ready. Open Spotify on your phone and select ITTVOne.');
			});

			// ------------ Spotify device went offline ------------
			player.addListener('not_ready', ({ device_id }) => {
				console.log('Spotify device offline:', device_id);
				setStatus('Spotify device went offline');
			});

			// ------------ Track state changed ------------
			player.addListener('player_state_changed', (state) => {
				console.log('Spotify state changed:', state);

				if (!state) {
					setStatus('Ready. Select ITTVOne from Spotify on your phone.');
					return;
				}

				const currentTrack = state.track_window.current_track;

				if (!currentTrack) return;

				setIsPlaying(!state.paused);

				setTrack({
					title: currentTrack.name,
					artist: currentTrack.artists.map((artist) => artist.name).join(', '),
					album: currentTrack.album.name,
					image: currentTrack.album.images?.[0]?.url,
					duration: state.duration,
					position: state.position,
				});
			});

			// ------------ Spotify errors ------------
			player.addListener('initialization_error', ({ message }) => {
				console.error('Spotify init error:', message);
				setStatus(`Init error: ${message}`);
			});

			player.addListener('authentication_error', ({ message }) => {
				console.error('Spotify auth error:', message);
				setStatus(`Auth error: ${message}`);
			});

			player.addListener('account_error', ({ message }) => {
				console.error('Spotify account error:', message);
				setStatus(`Account error: ${message}`);
			});

			player.addListener('playback_error', ({ message }) => {
				console.error('Spotify playback error:', message);
				setStatus(`Playback error: ${message}`);
			});

			// ------------ Connect Spotify player ------------
			player.connect().then((success) => {
				console.log('Spotify player connected:', success);

				if (success) {
					setStatus('Ready. Open Spotify on your phone and select ITTVOne.');
				} else {
					setStatus('Spotify player failed to connect.');
				}
			});
		}

		// ------------ Load Spotify SDK script ------------
		if (document.getElementById('spotify-player-script')) {
			setupPlayer();
		} else {
			const script = document.createElement('script');
			script.id = 'spotify-player-script';
			script.src = 'https://sdk.scdn.co/spotify-player.js';
			script.async = true;
			document.body.appendChild(script);

			window.onSpotifyWebPlaybackSDKReady = setupPlayer;
		}

		// ------------ Cleanup player on unmount ------------
		return () => {
			if (playerRef.current) {
				playerRef.current.disconnect();
				playerRef.current = null;
			}
		};
	}, [accessToken]);

	// -------------- Render SpotifyPlayerCard component ------------
	return (
		<View
			style={[
				styles.card,
				{
					width: componentWidth,
					height: componentHeight,
					backgroundColor: backgroundColor,
					borderColor: borderColor,
					borderRadius: borderRadius,
					borderWidth: borderWidth,
				},
				style,
			]}>
			{/* ====== Loading State ====== */}
			{!accessToken && !connectUrl && (
				<Text
					style={[
						styles.status,
						{
							color: textColor,
							fontSize: statusFontSize,
						},
					]}>
					{status}
				</Text>
			)}

			{/* ====== QR Code State ====== */}
			{!accessToken && connectUrl && (
				<>
					<View style={styles.qrBox}>
						<QRCode
							value={connectUrl}
							size={100}
							logoImage={Icons.Spotify.uri}
							logoWidth={30}
							logoHeight={30}
							bgColor='transparent'
							level='H'
							removeQrCodeBehindLogo={false}
							style={{
								borderRadius: 20,
							}}
						/>
					</View>

					<Text
						style={[
							styles.status,
							{
								color: textColor,
								fontSize: statusFontSize,
							},
						]}>
						Scan to connect Spotify
					</Text>

					{/*<Text
						style={[
							styles.url,
							{
								color: subTextColor,
							},
						]}>
						{connectUrl}
					</Text>*/}
				</>
			)}

			{/* ====== Connected but no song selected yet ====== */}
			{accessToken && !track && (
				<>
					<Text
						style={[
							styles.status,
							{
								color: textColor,
								fontSize: statusFontSize,
							},
						]}>
						{status}
					</Text>

					{deviceId && (
						<Text
							style={[
								styles.device,
								{
									color: subTextColor,
								},
							]}>
							Device ready
						</Text>
					)}
				</>
			)}

			{/* ====== Current Track Display ====== */}
			{accessToken && track && (
				<>
					{track.image && (
						<Image
							source={{ uri: track.image }}
							style={[
								styles.albumArt,
								{
									width: albumArtSize,
									height: albumArtSize,
								},
							]}
							resizeMode='cover'
						/>
					)}

					<Text
						numberOfLines={1}
						style={[
							styles.songTitle,
							{
								color: textColor,
								fontSize: songFontSize,
							},
						]}>
						{track.title}
					</Text>

					<Text
						numberOfLines={1}
						style={[
							styles.artist,
							{
								color: subTextColor,
								fontSize: artistFontSize,
							},
						]}>
						{track.artist}
					</Text>

					<Text
						numberOfLines={1}
						style={[
							styles.album,
							{
								color: subTextColor,
								fontSize: artistFontSize,
							},
						]}>
						{track.album}
					</Text>
				</>
			)}
		</View>
	);
	// -------------- End of SpotifyPlayerCard component ------------
}

// ---------------------- Styles for SpotifyPlayerCard ------------------
const styles = StyleSheet.create({
	// Card container styles
	card: {
		justifyContent: 'center',
		alignItems: 'center',

		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 4,
		elevation: 5,
	},
	// Card title styles
	title: {
		fontWeight: 'bold',
		marginBottom: 12,
		textAlign: 'center',
		includeFontPadding: false,

		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 4,
	},
	// QR code wrapper styles
	qrBox: {
		backgroundColor: '#65ac5aaa',
		borderRadius: 20,
		borderWidth: 3,
		borderColor: '#65ac5aaa',
		padding: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 4,
		elevation: 5,
	},
	// Album art styles
	albumArt: {
		borderRadius: 24,
		marginTop: 10,
	},
	// Song title text styles
	songTitle: {
		fontWeight: 'bold',
		textAlign: 'center',
		includeFontPadding: false,

		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 4,
		marginTop: 10,
	},
	// Artist text styles
	artist: {
		marginTop: 6,
		textAlign: 'center',
		includeFontPadding: false,
	},
	// Album text styles
	album: {
		fontSize: 14,
		marginTop: 4,
		textAlign: 'center',
		includeFontPadding: false,
	},
	// Status text styles
	status: {
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 12,
		includeFontPadding: false,
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 4,
	},
	// URL text styles
	url: {
		fontSize: 10,
		marginTop: 10,
		textAlign: 'center',
	},
	// Device text styles
	device: {
		fontSize: 12,
		textAlign: 'center',
	},
});
