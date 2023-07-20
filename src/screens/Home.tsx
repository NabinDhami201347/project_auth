import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

import { useAuthContext } from "../context/Auth";
import { protectedInstance } from "../api";

const HomeScreen = () => {
  const { removeToken } = useAuthContext();

  const getSubjects = async () => {
    try {
      const { data } = await protectedInstance.get("/subjects/1");
      console.log(data);
      return data;
    } catch (error: any) {
      console.error(error.response.data);
    }
  };
  getSubjects();

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
