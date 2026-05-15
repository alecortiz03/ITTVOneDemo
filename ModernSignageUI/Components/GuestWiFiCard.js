import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useWindowDimensions } from 'react-native';

import { fetchGuestWiFiInfo } from '@/Services/API/WiFi';
import { Icons } from '@/AppData/Icons';

export default function GuestWiFiCard({
	style,
	positionVertical,
	positionHorizontal,
}) {
	const { width: screenWidth, height: screenHeight } = useWindowDimensions();

	const [wifiSync, setWifiSync] = useState(false);
	const [data, setData] = useState(null);

	const componentWidth = Math.max(screenWidth * 0.43, 250);
	const componentHeight = Math.max(screenHeight * 0.25, 180);

	const scale = Math.min(componentWidth, componentHeight);

	const titleFontSize = Math.max(scale * 0.17, 18);
	const infoFontSize = Math.max(scale * 0.135, 12);

	const iconWidth = Math.max(componentWidth * 0.08, 24);
	const iconHeight = Math.max(componentHeight * 0.08, 24);

	useEffect(() => {
		initialize();

		const interval = setInterval(() => {
			initialize();
		}, 3600000);

		return () => clearInterval(interval);
	}, []);

	const initialize = async () => {
		const wifiData = await loadWiFiInfo();

		await checkWiFiStatus(wifiData);
	};

	const loadWiFiInfo = async () => {
		try {
			const wifiData = await fetchGuestWiFiInfo();

			setData(wifiData);

			return wifiData;
		} catch (error) {
			console.log('Failed to load Wi-Fi info:', error);

			setWifiSync(false);

			return null;
		}
	};

	function getCurrentDate() {
		const today = new Date();

		return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
			2,
			'0',
		)}-${String(today.getDate()).padStart(2, '0')}`;
	}

	function formatPhoneNumber(phoneNumber) {
		if (!phoneNumber) return '';

		const cleaned = phoneNumber.replace(/\D/g, '');

		if (cleaned.length === 11) {
			return `${cleaned[0]} (${cleaned.slice(
				1,
				4,
			)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
		}

		return phoneNumber;
	}

	const checkWiFiStatus = async (wifiData, retryCount = 0) => {
		if (!wifiData) {
			setWifiSync(false);
			return;
		}

		const formattedToday = getCurrentDate();

		const isValidToday = wifiData?.validAt === formattedToday;

		if (!isValidToday) {
			setWifiSync(false);

			if (retryCount >= 3) {
				console.log('Wi-Fi data is still outdated after 3 retries.');
				return;
			}

			console.log('Wi-Fi data is outdated. Re-fetching...');

			const refreshedData = await loadWiFiInfo();

			await checkWiFiStatus(refreshedData, retryCount + 1);

			return;
		}

		setWifiSync(true);
	};

	return (
		<View
			style={[
				styles.container,
				{
					width: componentWidth,
					height: componentHeight,
					bottom: positionVertical,
					left: positionHorizontal,
				},
				style,
			]}>
			<Image
				source={wifiSync ? Icons.CheckMark : Icons.XIcon}
				style={[
					styles.icon,
					{
						width: iconWidth,
						height: iconHeight,
					},
				]}
			/>

			<View style={styles.content}>
				<Text
					numberOfLines={1}
					adjustsFontSizeToFit
					minimumFontScale={0.6}
					style={[
						styles.info,
						{
							fontSize: infoFontSize,
							textShadowColor: 'rgba(0, 0, 0, 0.75)',
							textShadowOffset: { width: 1, height: 1 },
							textShadowRadius: 2,
						},
					]}>
					Need Guest Wi-Fi?
				</Text>

				<Text
					numberOfLines={2}
					adjustsFontSizeToFit
					minimumFontScale={0.6}
					style={[
						styles.info,
						{
							fontSize: infoFontSize,
							textShadowColor: 'rgba(0, 0, 0, 0.75)',
							textShadowOffset: { width: 1, height: 1 },
							textShadowRadius: 2,
						},
					]}>
					Text <Text style={styles.highlight}>{data?.dailyKey}</Text> to{' '}
					<Text style={styles.highlight}>
						{formatPhoneNumber(data?.locales?.en?.phoneNumber)}
					</Text>
				</Text>

				<Text
					numberOfLines={2}
					adjustsFontSizeToFit
					minimumFontScale={0.6}
					style={[
						styles.info,
						{
							fontSize: infoFontSize,
							textShadowColor: 'rgba(0, 0, 0, 0.75)',
							textShadowOffset: { width: 1, height: 1 },
							textShadowRadius: 2,
						},
					]}>
					to get access to <Text style={styles.highlight}>Eduroam</Text> today!
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		padding: 20,
		borderRadius: 60,
		borderWidth: 6,
		borderColor: '#3998bd',
		backgroundColor: 'rgba(2, 2, 2, 0.61)',
		overflow: 'hidden',
		justifyContent: 'center',
	},

	content: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 12,
		minHeight: 0,
	},

	title: {
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white',
		width: '100%',
	},

	info: {
		textAlign: 'center',
		color: 'white',
		width: '100%',
		flexShrink: 1,
		marginBottom: 4,
	},

	highlight: {
		fontWeight: 'bold',
		color: '#3998bd',
	},

	icon: {
		position: 'absolute',
		top: 16,
		right: 16,
		resizeMode: 'contain',
		opacity: 1,
	},
});
