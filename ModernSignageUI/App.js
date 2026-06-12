import { useEffect } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

import { StyleSheet } from 'react-native';
import MainHoursDisplay from '@/Screen/MainHoursDisplay';
import Demo from '@/Screen/Demo';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

async function checkForUpdates() {
	try {
		const update = await check();

		if (update) {
			await update.downloadAndInstall();
			await relaunch();
		}
	} catch (error) {
		console.log('Update check failed:', error);
	}
}

export default function App() {
	useEffect(() => {
		checkForUpdates();
	}, []);

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
