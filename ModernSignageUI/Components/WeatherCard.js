import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useWindowDimensions } from 'react-native';

export default function WeatherCard({
	style,

	backgroundColor,
	borderColor,
	borderRadius,
	borderWidth,
	positionVertical,
	positionHorizontal,
	textColor,
}) {
	const latitude = 53.54707375500362;
	const longitude = -113.50601718049307;

	const { width, height } = useWindowDimensions();
	const componentWidth = Math.max(width * 0.225, 250); // Ensure a minimum card width for readability
	const componentHeight = Math.max(height * 0.2, 80); // Ensure a minimum card height for readability
	const [fontScale, setFontScale] = useState(0);

	const weatherUrl =
		`https://api.open-meteo.com/v1/forecast` +
		`?latitude=${latitude}` +
		`&longitude=${longitude}` +
		`&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
		`&timezone=auto`;

	const [weather, setWeather] = useState(null);
	const [message, setMessage] = useState('Loading weather...');

	const getWeatherInfo = (code) => {
		const weatherMap = {
			0: {
				title: 'Clear sky',
				image: 'https://openweathermap.org/img/wn/01d@4x.png',
			},
			1: {
				title: 'Mostly clear',
				image: 'https://openweathermap.org/img/wn/02d@4x.png',
			},
			2: {
				title: 'Partly cloudy',
				image: 'https://openweathermap.org/img/wn/03d@4x.png',
			},
			3: {
				title: 'Overcast',
				image: 'https://openweathermap.org/img/wn/04d@4x.png',
			},
			45: {
				title: 'Foggy',
				image: 'https://openweathermap.org/img/wn/50d@4x.png',
			},
			61: {
				title: 'Light rain',
				image: 'https://openweathermap.org/img/wn/10d@4x.png',
			},
			71: {
				title: 'Light snow',
				image: 'https://openweathermap.org/img/wn/13d@4x.png',
			},
			95: {
				title: 'Thunderstorm',
				image: 'https://openweathermap.org/img/wn/11d@4x.png',
			},
		};

		return (
			weatherMap[code] || {
				title: 'Unknown weather',
				image: null,
			}
		);
	};

	const fetchWeather = async () => {
		try {
			const response = await fetch(weatherUrl);
			const data = await response.json();

			setWeather(data.current);
			setMessage('');
		} catch (error) {
			console.log('Weather error:', error);
			setMessage('Could not load weather');
		}
	};

	useEffect(() => {
		fetchWeather();

		const interval = setInterval(
			() => {
				fetchWeather();
			},
			30 * 60 * 1000,
		);

		return () => clearInterval(interval);
	}, []);

	const weatherInfo = weather ? getWeatherInfo(weather.weather_code) : null;

	return (
		<View
			onLayout={(event) => {
				const { width, height } = event.nativeEvent.layout;
				console.log('Card dimensions:', width, height);
				const fontSize = Math.min(width, height);
				setFontScale(fontSize);
				console.log('Calculated font size:', fontSize);
			}}
			style={[
				styles.card,
				style,
				{
					position: 'absolute',
					backgroundColor: backgroundColor,
					height: componentHeight,
					width: componentWidth,
					borderRadius: borderRadius,
					borderWidth: borderWidth,
					borderColor: borderColor,
					top: positionVertical,
					left: positionHorizontal,
				},
			]}>
			{weather ?
				<View style={styles.contentContainer}>
					{/* LEFT COLUMN */}
					<View style={styles.leftColumn}>
						{weatherInfo?.image && (
							<Image
								source={{ uri: weatherInfo.image }}
								style={[
									styles.image,
									{
										position: 'absolute',
										bottom: '30%',
										width: '90%',
										height: '90%',
									},
								]}
								resizeMode='contain'
							/>
						)}
						<Text
							numberOfLines={1}
							adjustsFontSizeToFit
							style={[
								styles.weatherType,
								{
									fontSize: fontScale * 0.15,
									color: textColor,
								},
							]}>
							{weatherInfo.title}
						</Text>

						<Text
							numberOfLines={1}
							adjustsFontSizeToFit
							style={[
								styles.temperature,
								{
									fontSize: fontScale * 0.15,
									color: textColor,
								},
							]}>
							{Math.round(weather.temperature_2m)}°C
						</Text>
					</View>

					{/* RIGHT COLUMN */}
					<View style={styles.rightColumn}>
						<Text
							numberOfLines={1}
							adjustsFontSizeToFit
							style={[
								styles.feelsLike,
								{
									fontSize: fontScale * 0.1,
									color: textColor,
								},
							]}>
							Feels like {Math.round(weather.apparent_temperature)}°C
						</Text>

						<Text
							numberOfLines={1}
							adjustsFontSizeToFit
							style={[
								styles.windSpeed,
								{
									fontSize: fontScale * 0.1,
									color: textColor,
								},
							]}>
							Wind {Math.round(weather.wind_speed_10m)} km/h
						</Text>

						<Text
							numberOfLines={1}
							adjustsFontSizeToFit
							style={[
								styles.humidity,
								{
									fontSize: fontScale * 0.1,
									color: textColor,
								},
							]}>
							Humidity {weather.relative_humidity_2m}%
						</Text>
					</View>
				</View>
			:	<Text
					style={[
						styles.loadingText,
						{
							fontSize: fontScale * 0.6,
						},
					]}>
					{message}
				</Text>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 4,
		elevation: 5,
		paddingHorizontal: 25,
		paddingVertical: 20,
	},

	contentContainer: {
		flex: 1,
		flexDirection: 'row',
	},

	leftColumn: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	rightColumn: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingLeft: 15,
		gap: 10,
	},

	feelsLike: {
		position: 'absolute',
		top: '20%',
		fontWeight: 'bold',
		textAlign: 'center',

		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 4,
	},

	temperature: {
		position: 'absolute',
		top: '70%',
		fontWeight: 'bold',
		textAlign: 'center',
		fontWeight: 'bold',
		textAlign: 'center',

		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 4,
	},

	humidity: {
		position: 'absolute',
		top: '50%',
		fontWeight: 'bold',
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 4,
	},

	image: {},

	loadingText: {
		color: 'white',
		textAlign: 'center',
		fontWeight: 'bold',
	},
	weatherType: {
		position: 'absolute',
		top: '50%',
		fontWeight: 'bold',
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 2,
	},
	windSpeed: {
		position: 'absolute',
		top: '35%',
		fontWeight: 'bold',
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 2,
	},
});
