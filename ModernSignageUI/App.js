import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import DateTimeCard from '@/Components/DateTimeCard';
import HoursCard from '@/Components/HoursCard';
import WeatherCard from '@/Components/WeatherCard';
import MainHoursDisplay from '@/Screen/MainHoursDisplay';
import Demo from '@/Screen/Demo';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName='MainHoursDisplay'
				screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name='MainHoursDisplay'
					component={MainHoursDisplay}
				/>
				<Stack.Screen
					name='Demo'
					component={Demo}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
