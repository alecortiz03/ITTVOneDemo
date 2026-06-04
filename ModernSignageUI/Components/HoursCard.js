// ----------- HoursCard.js -----------
// Function: Displays the business hours in a card format.
// Props:
// - style: Custom styles for the card container.
// - componentWidth: Width of the card.
// - componentHeight: Height of the card.
// - backgroundColor: Background color of the card.
// - borderColor: Border color of the card.
// - titleTextColor: Color of the title text.
// - rowOneTextColor: Color of the first row of text.
// - rowTwoTextColor: Color of the second row of text.
// - rowThreeTextColor: Color of the third row of text.
// - lineColor: Color of the line separating the title and hours.
// - borderRadius: Border radius for rounded corners.
// - borderWidth: Width of the border.
// - positionVertical: Vertical position of the card (e.g., distance from bottom).
// - positionHorizontal: Horizontal position of the card (e.g., distance from left).
// Example usage:
// <HoursCard
//   componentWidth={300}
//   componentHeight={150}
//   backgroundColor="#fff"
//   borderColor="#000"
//   titleTextColor="#000"
//   rowOneTextColor="#000"
//   rowTwoTextColor="#000"
//   rowThreeTextColor="#000"
//   lineColor="#000"
//   borderRadius={10}
//   borderWidth={2}
//   positionVertical={20}
//   positionHorizontal={20}
// />

// ====== IMPORTS ======
import React from 'react'; // Import React for component creation
import { View, Text, StyleSheet, Image } from 'react-native'; // Import necessary components from React Native
import { useWindowDimensions } from 'react-native'; // Import hook to get window dimensions
import { Icons } from '@/AppData/Icons'; // Import icons from the AppData

// ---------------------- HoursCard Component ------------------
export default function HoursCard({
	style, // Style for the card container
	borderRadius, // Border radius for rounded corners
	borderWidth, // Width of the border
	borderColor, // Color of the border
	backgroundColor, // Background color of the card
	textColor, // Color of the text
	lineColor, // Color of the line separating the title and hours
	positionVertical, // Vertical position of the card (e.g., distance from bottom)
	positionHorizontal, // Horizontal position of the card (e.g., distance from left)
}) {
	const { width: screenWidth, height: screenHeight } = useWindowDimensions();
	const componentWidth = Math.max(screenWidth * 0.9, 250); // Ensure a minimum card width for readability
	const componentHeight = Math.max(screenHeight * 0.29, 80); // Ensure a minimum card height for readability
	const fontScaleFactor = Math.min(componentWidth, componentHeight); // Scale factor based on screen size (using iPhone 8 as reference)
	const rowOneFontSize = Math.max(fontScaleFactor * 0.09, 12); // Font size for the first row of text, scaled based on the card size
	const rowTwoFontSize = Math.max(fontScaleFactor * 0.09, 12); // Font size for the second row of text, scaled based on the card size
	const rowThreeFontSize = Math.max(fontScaleFactor * 0.09, 12); // Font size for the third row of text, scaled based on the card size
	const lineHeight = Math.max(componentHeight * 0.009, 4); // Height of the line, scaled based on the card size
	const lineWidth = Math.max(componentWidth * 0.6, 100); // Width of the line, scaled based on the card size
	console.log('HoursCard - screenWidth:', screenWidth);

	// State to hold the calculated font size
	return (
		<View
			style={[
				styles.card,
				{
					width: '90%', // Set the card width
					borderRadius: borderRadius, // Set the border radius
					borderWidth: borderWidth, // Set the border width
					borderColor: borderColor, // Set the border color
					backgroundColor: backgroundColor, // Set the background color
				},
				style,
			]}>
			<View style={styles.header}>
				<Text
					adjustsFontSizeToFit
					minimumFontScale={0.5}
					style={[
						styles.titleText,
						{ fontSize: screenWidth > 400 ? 32 : 16, color: textColor },
					]}>
					IT Support Hours
				</Text>
			</View>
			<View style={styles.textContainer}>
				<Text
					adjustsFontSizeToFit
					minimumFontScale={0.5}
					style={[
						styles.hoursRowOne, // Style for the first row of hours text
						{
							fontSize:
								screenWidth < 400 ? 7.5
								: screenWidth < 500 ? 8.5
								: screenWidth < 550 ? 12
								: screenWidth < 900 ? 20
								: screenWidth > 1000 ? 30
								: 22, // Set the font size based on screen width
							color: textColor, // Set the color for the first row of text
							textShadowColor: 'rgba(0, 0, 0, 0.75)', // Add a shadow to the first row of text for better visibility
							textShadowOffset: { width: 1, height: 1 }, // Set the offset for the text shadow
							textShadowRadius: 2, // Set the radius for the text shadow
						},
					]}
					numberOfLines={1}>
					Monday - Friday: 8:00 AM - 7:00 PM
				</Text>
				<Text
					adjustsFontSizeToFit
					minimumFontScale={0.5}
					style={[
						styles.hoursRowTwo,
						{
							fontSize:
								screenWidth < 400 ? 7.5
								: screenWidth < 500 ? 8.5
								: screenWidth < 550 ? 12
								: screenWidth < 900 ? 20
								: screenWidth > 1000 ? 30
								: 22, // Set the font size based on screen width
							color: textColor, // Set the color for the first row of text
							textShadowColor: 'rgba(0, 0, 0, 0.75)', // Add a shadow to the first row of text for better visibility
							textShadowOffset: { width: 1, height: 1 }, // Set the offset for the text shadow
							textShadowRadius: 2, // Set the radius for the text shadow
						},
					]}
					numberOfLines={1}>
					Saturday: 9:00 AM - 5:00 PM
				</Text>
				<Text
					adjustsFontSizeToFit
					minimumFontScale={0.5}
					numberOfLines={1}
					style={[
						styles.hoursRowThree, // Style for the third row of hours text
						{
							fontSize:
								screenWidth < 400 ? 7.5
								: screenWidth < 500 ? 8.5
								: screenWidth < 550 ? 12
								: screenWidth < 900 ? 20
								: screenWidth > 1000 ? 30
								: 22, // Set the font size based on screen width
							color: textColor, // Set the color for the third row of text
							textShadowColor: 'rgba(0, 0, 0, 0.75)', // Add a shadow to the third row of text for better visibility
							textShadowOffset: { width: 1, height: 1 }, // Set the offset for the text shadow
							textShadowRadius: 2, // Set the radius for the text shadow
						},
					]}>
					Sunday: Closed
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		alignItems: 'center', // Center content horizontally
		shadowColor: '#000', // Shadow color
		shadowOffset: { width: 0, height: 2 }, // Shadow offset
		shadowOpacity: 0.8, // Shadow opacity
		shadowRadius: 4, // Shadow radius
		elevation: 5, // Elevation for Android shadow
	},
	hoursTitle: {
		fontWeight: 'bold', // Bold font for the title
		width: '90%', // Set width to 90% of the card width
		textAlign: 'center', // Center text horizontally
		flexShrink: 1, // Allow text to shrink to fit within the card
	},
	hoursRowOne: {
		fontWeight: 'bold', // Bold font for the first row of hours text
		textAlign: 'center', // Center text horizontally
		flexShrink: 1, // Allow text to shrink to fit within the card
		paddingBottom: 30, // Add padding below the first row for better spacing
	},
	hoursRowTwo: {
		fontWeight: 'bold', // Bold font for the second row of hours text
		textAlign: 'center', // Center text horizontally
		flexShrink: 1, // Allow text to shrink to fit within the card
		paddingBottom: 30, // Add padding below the second row for better spacing
	},
	Line: {
		borderRadius: 100, // Set border radius to create a rounded line
	},
	hoursRowThree: {
		fontWeight: 'bold', // Bold font for the third row of hours text
		textAlign: 'center', // Center text horizontally
		flexShrink: 1, // Allow text to shrink to fit within the card
		paddingBottom: 30, // Add padding below the third row for better spacing
	},
	textContainer: {
		flex: 2,
		width: '100%',
		justifyContent: 'space-evenly', // Evenly space the rows of text
	},
	header: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	titleText: {
		fontWeight: 'bold',
		flexShrink: 1,
		textAlign: 'center',
		width: '100%',
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
		textDecorationLine: 'underline',
	},
});
