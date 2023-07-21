import { StyleSheet, TextInput, View, Button } from "react-native";
import React, { useState } from "react";

import { protectedInstance } from "../api";

// @ts-ignore
const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handlePress = async () => {
    try {
      const { data } = await protectedInstance.put("/auth/change", { oldPassword, password, passwordConfirmation });
      console.log(data.message);
      navigation.navigate("Home");
    } catch (error: any) {
      console.error(error.response.data);
    }
  };
  return (
    <View style={{ gap: 10, paddingHorizontal: 10 }}>
      <TextInput placeholder="Old Password" value={oldPassword} onChangeText={setOldPassword} secureTextEntry />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput
        placeholder="Confirm Password"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />
      <Button title="Chnage Password" onPress={handlePress} />
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({});
