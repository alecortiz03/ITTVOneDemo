import React, { useEffect, useState, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	Animated,
} from 'react-native';
import { invoke } from '@tauri-apps/api/core';
import { Images } from '@/AppData/Images';

import DateTimeCard from '@/Components/DateTimeCard';
import { BlurView } from 'expo-blur';
import HoursCard from '@/Components/HoursCard';
import WeatherCard from '@/Components/WeatherCard';
import NewsCard from '@/Components/NewsCard';
import GuestWiFiCard from '@/Components/GuestWiFiCard';
import SpotifyPlayerCard from '@/Components/SpotifyPlayerCard';

export default function MainHoursDisplay() {
	useEffect(() => {
		console.log('Spotify useEffect started');

		async function checkSpotifyToken() {
			try {
				console.log('Checking Spotify token...');

				const res = await fetch(
					'https://spotifyserver-kzcx.onrender.com/spotify/token',
				);

				console.log('Response status:', res.status);

				const data = await res.json();

				console.log('Spotify token response:', data);

				if (data.access_token) {
					console.log('Token found!');
					setSpotifyAccessToken(data.access_token);
				} else {
					console.log('No token found');
					setSpotifyAccessToken(null);
				}
			} catch (error) {
				console.log('Spotify token check failed:', error);
			}
		}

		checkSpotifyToken();

		const interval = setInterval(checkSpotifyToken, 2000);

		return () => clearInterval(interval);
	}, []);
	const [spotifyAccessToken, setSpotifyAccessToken] = useState(null);
	useEffect(() => {
		console.log(
			'spotifyAccessToken changed:',
			spotifyAccessToken ? 'HAS TOKEN' : 'NULL',
		);
	}, [spotifyAccessToken]);

	const [hundTitle, setHundTitle] = useState('Loading...');
	const [hundServices, setHundServices] = useState([]);
	const [hundResult, setHundResult] = useState('Loading...');

	const [containerWidth, setContainerWidth] = useState(0);
	const [textWidth, setTextWidth] = useState(0);
	const [tickerReady, setTickerReady] = useState(false);
	//const [spotifyAccessToken, setSpotifyAccessToken] = useState(null);
	//useEffect(() => {
	//setSpotifyAccessToken('PASTE_YOUR_ACCESS_TOKEN_HERE');
	//}, []);
	const translateX = useRef(new Animated.Value(9999)).current;

	useEffect(() => {
		async function testHund() {
			try {
				const result = await invoke('fetch_hund_status');

				const lines = result
					.split('\n')
					.map((line) => line.trim())
					.filter((line) => line.length > 0);

				const title = lines[0];
				const services = lines.slice(1);

				setHundTitle(title);
				setHundServices(services);

				setHundResult(
					`🚨${title}🚨 • Affected Services: ${services.join(' | ')}`,
				);
			} catch (error) {
				setHundTitle('Hund Error');
				setHundServices([]);
				setHundResult(`Hund Error: ${error}`);
			}
		}

		// Run immediately
		testHund();

		// Then every minute
		const interval = setInterval(testHund, 60000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (containerWidth === 0 || textWidth === 0) return;

		const startPosition = containerWidth + 50;
		const endPosition = -textWidth - containerWidth;

		translateX.setValue(startPosition);
		setTickerReady(true);

		const animation = Animated.loop(
			Animated.sequence([
				Animated.delay(100),
				Animated.timing(translateX, {
					toValue: endPosition,
					duration: 30000,
					useNativeDriver: true,
				}),
				Animated.delay(1500),
				Animated.timing(translateX, {
					toValue: startPosition,
					duration: 0,
					useNativeDriver: true,
				}),
			]),
		);

		animation.start();

		return () => animation.stop();
	}, [containerWidth, textWidth, hundResult]);

	return (
		<ImageBackground
			style={styles.container}
			source={Images.Background}>
			<BlurView
				intensity={100}
				style={styles.blurView}>
				<View style={[styles.header, {}]}>
					<DateTimeCard
						borderRadius={60}
						borderWidth={6}
						borderColor='#212324bd'
						textColor='#f8f6f6'
						backgroundColor='rgba(2, 2, 2, 0.61)'
					/>
					<WeatherCard
						borderRadius={60}
						borderWidth={6}
						borderColor='#212324bd'
						textColor='#f8f6f6'
						backgroundColor='rgba(2, 2, 2, 0.61)'
					/>
					<SpotifyPlayerCard
						accessToken={spotifyAccessToken}
						borderRadius={60}
						borderWidth={6}
						borderColor='#212324bd'
						textColor='#f8f6f6'
						backgroundColor='rgba(2, 2, 2, 0.61)'
					/>
				</View>
				{hundTitle != 'No Active Alerts' && (
					<View
						style={styles.hundContainer}
						onLayout={(e) =>
							setContainerWidth(e.nativeEvent.layout.width - 20)
						}>
						<Animated.Text
							onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
							style={[
								styles.hundText,
								{
									opacity: tickerReady ? 1 : 0,
									transform: [{ translateX }],
								},
								{ fontSize: containerWidth > 800 ? 24 : 16 },
							]}>
							{hundResult}
						</Animated.Text>
					</View>
				)}
				<View style={styles.body}>
					<View style={styles.leftColumn}>
						<HoursCard
							borderRadius={60}
							borderWidth={6}
							borderColor='#212324bd'
							textColor='#f8f6f6'
							backgroundColor='rgba(2, 2, 2, 0.61)'
						/>
						<GuestWiFiCard />
					</View>

					<View style={styles.rightColumn}>
						<NewsCard />
					</View>
				</View>
			</BlurView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	blurView: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'space-evenly',
		width: '100%',
		height: '100%',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		width: '100%',
	},
	hundContainer: {
		backgroundColor: 'rgba(0, 0, 0, 0.59)',
		borderBottomWidth: 6,
		borderTopWidth: 6,
		borderColor: '#0c0b0b9a',
		padding: 10,
		height: 40,
		overflow: 'hidden',
		justifyContent: 'center',
		height: '10%',
		width: '100%',
	},
	hundText: {
		color: '#ffffff',
		whiteSpace: 'nowrap',
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
	},
	hundDetails: {
		backgroundColor: 'rgba(255,255,255,0.9)',
		marginHorizontal: 10,
		padding: 10,
		borderRadius: 8,
	},
	hundTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000',
	},
	hundLabel: {
		marginTop: 6,
		fontSize: 14,
		fontWeight: 'bold',
		color: '#000',
	},
	hundService: {
		fontSize: 14,
		color: '#000',
	},
	body: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	leftColumn: {
		flex: 1,
		alignItems: 'center',
		gap: 60,
	},
	rightColumn: {
		flex: 1,
		alignItems: 'center',
	},
});
