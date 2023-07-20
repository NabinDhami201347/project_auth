import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

import { useAuthContext } from "../context/Auth";

const HomeScreen = () => {
  const { removeToken } = useAuthContext();
  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <Button title="Remove Token" onPress={removeToken} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
