import { StyleSheet, TextInput, View, Button } from "react-native";
import React, { useState } from "react";
import { publicInstance } from "../api";

// @ts-ignore
const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handlePress = async () => {
    try {
      await publicInstance.put("/auth/forgot", { email, password, passwordConfirmation });
      navigation.navigate("SignIn");
    } catch (error: any) {
      console.error(error.response.data);
    }
  };

  return (
    <View style={{ gap: 10, paddingHorizontal: 10 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
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

export default ForgotPasswordScreen;

const styles = StyleSheet.create({});
