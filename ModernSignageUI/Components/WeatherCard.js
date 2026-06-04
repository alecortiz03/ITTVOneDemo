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
	const componentWidth = Math.max(width * 0.3, 250); // Ensure a minimum card width for readability
	const componentHeight = Math.max(height * 0.1, 80); // Ensure a minimum card height for readability

	const scale = Math.min(componentWidth, componentHeight); // Scale factor based on screen size (using iPhone 8 as reference)

	const fontScale = Math.max(scale * 0.1, 12); // Base font size scaled based on the card width
	const imageWidth = Math.max(scale * 0.5, 50); // Image width scaled based on the card width
	const imageHeight = Math.max(scale * 0.5, 50); // Image height scaled based on the card height
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
			style={[
				styles.card,
				style,
				{
					backgroundColor,
					height: componentHeight,
					width: componentWidth,
					borderRadius,
					borderWidth,
					borderColor,
				},
			]}>
			{weather ?
				<>
					<View style={styles.weatherRow}>
						{weatherInfo?.image && (
							<Image
								source={{ uri: weatherInfo.image }}
								style={[
									styles.image,
									{
										width: imageWidth,
										height: imageHeight,
									},
								]}
								resizeMode='contain'
							/>
						)}
						<Text
							style={[
								styles.weatherType,
								{ fontSize: fontScale * 0.9, color: textColor },
							]}>
							{weatherInfo.title}
						</Text>
						<Text
							numberOfLines={1}
							adjustsFontSizeToFit
							style={[
								styles.temperature,
								{
									fontSize:
										width < 400 ? 2
										: width < 500 ? 2
										: width < 550 ? 3
										: width < 900 ? 7
										: width > 1000 ? 10
										: 22,
									color: textColor,
								},
							]}>
							{Math.round(weather.temperature_2m)}°C
						</Text>
					</View>
					<View style={styles.lineRow}>
						<View
							style={{
								backgroundColor: 'rgb(255, 255, 255)',
								height: '60%',
								width: '100%',
							}}></View>
					</View>
					<View style={styles.detailsRow}>
						<Text
							style={[
								styles.feelsLike,
								{ fontSize: fontScale, color: textColor },
							]}>
							Feels like {Math.round(weather.apparent_temperature)}°C
						</Text>

						<Text
							style={[
								styles.windSpeed,
								{ fontSize: fontScale, color: textColor },
							]}>
							Wind {Math.round(weather.wind_speed_10m)} km/h
						</Text>

						<Text
							style={[
								styles.humidity,
								{ fontSize: fontScale, color: textColor },
							]}>
							Humidity {weather.relative_humidity_2m}%
						</Text>
					</View>
				</>
			:	<Text style={[styles.loadingText, { fontSize: fontScale * 0.6 }]}>
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
		flexDirection: 'row',
		overflow: 'hidden',
	},
	weatherRow: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		marginBottom: 10,
	},
	detailsRow: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 30,
		rowGap: 4,
	},
	lineRow: {
		width: '0.6%',
		height: '100%',
		justifyContent: 'center',
	},

	feelsLike: {
		fontWeight: 'bold',
		textAlign: 'center',
		width: '100%',
		flexWrap: 'wrap',
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 4,
		flexShrink: 1,
	},

	temperature: {
		fontWeight: 'bold',
		textAlign: 'center',

		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 4,
		width: '100%',
		flexWrap: 'wrap',
		paddingBottom: 12,
	},

	humidity: {
		fontWeight: 'bold',
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 4,
		textAlign: 'center',
		width: '100%',
		flexShrink: 1,
	},

	image: {},

	loadingText: {
		color: 'white',
		textAlign: 'center',
		fontWeight: 'bold',
	},
	weatherType: {
		fontWeight: 'bold',
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 2,
	},
	windSpeed: {
		fontWeight: 'bold',
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 2,
		flexShrink: 1,
	},
});
