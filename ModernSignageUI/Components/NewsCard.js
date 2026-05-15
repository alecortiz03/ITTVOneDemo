import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useWindowDimensions } from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import { invoke } from '@tauri-apps/api/core';
import { Images } from '@/AppData/Images';

export default function NewsCard({
	style,
	positionVertical,
	positionHorizontal,
}) {
	const [articles, setArticles] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [message, setMessage] = useState('Loading...');
	const { width, height } = useWindowDimensions();
	const componentWidth = Math.max(width * 0.45, 250); // Ensure a minimum card width for readability
	const componentHeight = Math.max(height * 0.65, 80); // Ensure a minimum card height for readability
	const imageWidth = Math.max(componentWidth * 0.9, 200); // Ensure a minimum image width for readability
	const imageHeight = Math.max(componentHeight * 0.53, 80); // Ensure a minimum image height for readability
	const fontSize = Math.max(componentWidth * 0.045, 12); // Font size for the article title, scaled based on the card size

	const getYouTubeVideoId = (url) => {
		if (!url) return null;

		const match = url.match(/[?&]v=([^&]+)/);
		return match ? match[1] : null;
	};

	const fetchNews = async () => {
		try {
			const responseData = await invoke('fetch_rss_feed');

			const rss = await rssParser.parse(responseData);

			console.log('Feed title:', rss.title);
			console.log('Number of items:', rss.items.length);

			setArticles(rss.items);
			setMessage('');
		} catch (error) {
			console.log('Error:', error);
			setMessage('Could not load news');
		}
	};

	useEffect(() => {
		fetchNews();
	}, []);

	useEffect(() => {
		if (articles.length === 0) return;

		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) =>
				prevIndex === articles.length - 1 ? 0 : prevIndex + 1,
			);
		}, 20000);

		return () => clearInterval(interval);
	}, [articles]);

	const currentArticle = articles[currentIndex];

	const videoUrl = currentArticle?.links?.[0]?.url;
	const videoId = getYouTubeVideoId(videoUrl);
	const embedUrl =
		videoId ?
			`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&iv_load_policy=3&rel=0&fs=0&disablekb=1&cc_load_policy=1&cc_lang_pref=en`
		:	null;
	return (
		<View
			style={[
				styles.card,
				style,
				{
					width: componentWidth,
					height: componentHeight,
					position: 'absolute',
					top: positionVertical,
					left: positionHorizontal,
				},
			]}>
			{currentArticle ?
				<>
					{embedUrl ?
						<iframe
							src={embedUrl}
							style={{
								position: 'absolute',
								width: imageWidth,
								height: imageHeight,
								bottom: height * 0.23,
								borderRadius: 30,
								borderWidth: 6,
								borderColor: '#0c0b0b9a',
								borderStyle: 'solid',
								boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.8)',
							}}
							allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
							allowFullScreen
							title={currentArticle.title}
						/>
					:	<Image
							source={Images.NoVideoFound}
							style={[
								styles.placeholderImage,
								{
									position: 'absolute',
									width: imageWidth,
									height: imageHeight,
									bottom: height * 0.23,
									borderRadius: 30,
								},
							]}
							resizeMode='cover'
						/>
					}

					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							width: '80%',
							height: componentHeight * 0.2,
							padding: 10,
							top: componentHeight * 0.23,
							paddingTop: componentHeight * 0.15,
						}}>
						<Text style={[styles.firstTitle, { fontSize: fontSize }]}>
							{currentArticle.title}
						</Text>
					</View>
				</>
			:	<Text style={[styles.firstTitle, { fontSize: fontSize }]}>
					{message}
				</Text>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		padding: 20,
		borderRadius: 45,
		borderWidth: 6,
		borderColor: '#1211119d',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 4,
		elevation: 5,
	},
	firstTitle: {
		position: 'absolute',
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 10,
	},
});
