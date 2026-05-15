// ------------ DATE AND TIME CARD ------------
// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
// Import React Native components
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useWindowDimensions } from 'react-native';
// Import images from the AppData
import { Images } from '@/AppData/Images';

// ---------------------- DateTimeCard Component ------------------
// Function: Displays the current date and time, updating every second.
// Props:
// - style: Custom styles for the card container.
// - componentWidth: Width of the card.
// - componentHeight: Height of the card.
// - backgroundColor: Background color of the card.
// - borderColor: Border color of the card.
// - textBackgroundColor: Background color for the text area.
// - textColor: Color of the text.
// - borderRadius: Border radius for rounded corners.
// - borderWidth: Width of the border.
// Example usage:
// <DateTimeCard
//   componentWidth={300}
//   componentHeight={150}
//   backgroundColor="#fff"
//   borderColor="#000"
//   textBackgroundColor="rgba(255, 255, 255, 0.8)"
//   textColor="#000"
//   borderRadius={10}
//   borderWidth={2}
// />

export default function DateTimeCard({
	style /* Custom styles for the card container */,
	positionVertical /* Vertical position of the card */,
	positionHorizontal /* Horizontal position of the card */,
	backgroundColor /* Background color of the card */,
	borderColor /* Border color of the card */,
	textBackgroundColor /* Background color for the text area */,
	textColor /* Color of the text */,
	borderRadius /* Border radius for rounded corners */,
	borderWidth /* Width of the border */,
}) {
	// State to hold the current time string
	const [currentTime, setCurrentTime] = useState('');
	const { width: screenWidth, height: screenHeight } = useWindowDimensions();
	// Font Size
	const componentWidth = Math.max(screenWidth * 0.67, 250); // Card width is 67% of screen width or minimum 300
	const componentHeight = Math.max(screenHeight * 0.2, 80);
	const fontSize = Math.max(componentWidth * 0.06, 16); // Font size is 5.5% of card width
	const textPadding = componentWidth * 0.05; // Text padding is 5% of card width
	useEffect(() => {
		// ------------ updateTime function ------------
		const updateTime = () => {
			// Set now to new Date object
			const now = new Date();
			// Set day to the current weekday in long format
			// Example: "Monday", "Tuesday", etc.
			const day = now.toLocaleDateString([], { weekday: 'long' });
			// Set time to the current time in numeric format (hour and minute)
			// Example: "3:45 PM"
			const time = now.toLocaleTimeString([], {
				hour: 'numeric',
				minute: 'numeric',
			});
			// Set date to the current date in long format (month, day, year)
			// Example: "September 15, 2024"
			const date = now.toLocaleDateString([], {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
			// Format the time string as "Day, Time - Date"
			// Example: "Monday, 3:45 PM - September 15, 2024"
			const formattedTime = `${day}   ${time}    ${date}`;
			// Update the currentTime state with the formatted time string
			setCurrentTime(formattedTime);
		};
		// ------------ End of updateTime function ------------

		// Call updateTime immediately to set the initial time
		updateTime();
		// Set an interval to call updateTime every 1000 milliseconds (1 second)
		const interval = setInterval(updateTime, 1000);
		// Cleanup function to clear the interval when the component unmounts
		return () => clearInterval(interval);
	}, []);

	// -------------- Render the DateTimeCard component ------------
	return (
		/* ====== Main Card Component ====== */
		<View
			/* Card Styles */
			style={[
				styles.card,
				{
					/* Custom styles for the card container */
					width: componentWidth /* Width of the card */,
					height: componentHeight /* Height of the card */,
					backgroundColor: backgroundColor /* Background color of the card */,
					borderColor: borderColor /* Border color of the card */,
					borderRadius: borderRadius /* Border radius for rounded corners */,
					borderWidth: borderWidth /* Width of the border */,
					top: positionVertical /* Vertical position of the card */,
					left: positionHorizontal /* Horizontal position of the card */,
				},
				style,
			]}>
			{/* ====== Card Text Component ====== */}
			<Text
				numberOfLines={1}
				adjustsFontSizeToFit
				minimumFontScale={0.5}
				maxFontSizeMultiplier={1}
				style={[
					styles.text,
					{
						fontSize: fontSize /* Font size relative to card width */,
						backgroundColor:
							textBackgroundColor /* Background color for the text area */,
						color: textColor /* Color of the text */,
					},
				]}>
				{/* Display current time */}
				{currentTime}
			</Text>
			{/* ====== End of Card Text Component ====== */}
		</View>
	);
	// -------------- End of DateTimeCard component ------------
}

// ---------------------- Styles for DateTimeCard ------------------
const styles = StyleSheet.create({
	// Card container styles
	card: {
		position: 'absolute', // Position the card absolutely for custom placement
		alignItems: 'center', // Center content horizontally
		justifyContent: 'center', // Center content vertically
		shadowColor: '#000', // Shadow color
		shadowOffset: { width: 0, height: 2 }, // Shadow offset
		shadowOpacity: 0.8, // Shadow opacity
		shadowRadius: 4, // Shadow radius
		elevation: 5, // Elevation
	},
	// Time text styles
	text: {
		fontWeight: 'bold', // Bold font for better visibility
		width: '100%',
		flexShrink: 1,
		textAlign: 'center', // Center the text horizontally
		includeFontPadding: false, // Remove extra padding around text for better vertical centering

		textShadowColor: 'rgba(0, 0, 0, 0.75)', // Add a shadow to the text for better visibility
		textShadowOffset: { width: 2, height: 2 }, // Set the offset for the text shadow
		textShadowRadius: 4, // Set the radius for the text shadow
	},
});
