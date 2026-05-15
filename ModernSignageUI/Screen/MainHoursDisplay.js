import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Images } from '@/AppData/Images';

import DateTimeCard from '@/Components/DateTimeCard';

import { BlurView } from 'expo-blur';
import HoursCard from '@/Components/HoursCard';
import WeatherCard from '@/Components/WeatherCard';
import NewsCard from '@/Components/NewsCard';
import GuestWiFiCard from '@/Components/GuestWiFiCard';

export default function MainHoursDisplay() {
	return (
		<ImageBackground
			style={styles.container}
			source={Images.Background}>
			<BlurView
				intensity={100}
				style={styles.blurView}>
				<DateTimeCard
					textColor={'white'}
					componentWidth={'70%'}
					componentHeight={'20%'}
					backgroundColor={'rgba(0, 0, 0, 0.46)'}
					borderRadius={60}
					borderWidth={6}
					positionVertical={'5%'}
					positionHorizontal={'2%'}
					borderColor={'#00000065'}
				/>
				<WeatherCard
					textColor={'white'}
					positionVertical={'5.25%'}
					positionHorizontal={'72%'}
					borderRadius={60}
					borderWidth={6}
					backgroundColor={'rgba(0, 0, 0, 0.46)'}
					borderColor={'#00000083'}
				/>
				<HoursCard
					componentWidth={'50%'}
					borderRadius={60}
					borderWidth={6}
					borderColor={'#0000007a'}
					positionHorizontal={'2.5%'}
					positionVertical={'38%'}
					backgroundColor={'rgba(0, 0, 0, 0.46)'}
					textColor={'white'}
					lineColor={'white'}
				/>
				<NewsCard
					positionHorizontal={'50%'}
					positionVertical={'31%'}
				/>
				<GuestWiFiCard
					positionHorizontal={'3.4%'}
					positionVertical={'4.7%'}
				/>
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
	text: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	blurView: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
