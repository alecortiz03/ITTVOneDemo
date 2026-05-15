import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Images } from '@/AppData/Images';

import DateTimeCard from '@/Components/DateTimeCard';

import { BlurView } from 'expo-blur';
import HoursCard from '@/Components/HoursCard';
import WeatherCard from '@/Components/WeatherCard';

export default function Demo() {
	return (
		<View style={styles.container}>
			<HoursCard
				componentWidth='90%'
				componentHeight='70%'
				lineColor={'black'}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
});
