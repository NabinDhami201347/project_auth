import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

import { useAuthContext } from "../context/Auth";
import { protectedInstance, fileuri } from "../api";

// @ts-ignore
const HomeScreen = ({ navigation }) => {
  const { removeTokens } = useAuthContext();
  console.log(`${fileuri}file-1688647182290-710961280.pdf`);

  // const getSubjects = async () => {
  //   try {
  //     const { data } = await protectedInstance.get("/subjects/1");
  //     console.log(data);
  //     return data;
  //   } catch (error: any) {
  //     console.error(error.response.data);
  //   }
  // };
  // getSubjects();

  return (
    <View style={styles.container}>
      <Text>HomeScreen Ok</Text>
      <Button title="Remove Token" onPress={removeTokens} />
      <Button title="Change Password" onPress={() => navigation.navigate("ChangePassword")} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
