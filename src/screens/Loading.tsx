import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

const LoadingScreen = () => {
  // Set a state to control whether the loading screen should be shown or not
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Use setTimeout to update the isVisible state after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    // Clean up the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this effect runs only once

  // Render the loading screen if isVisible is true
  return isVisible ? (
    <View style={styles.container}>
      <Text>LoadingScreen</Text>
    </View>
  ) : null;
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
