import { Button, TextInput, View } from "react-native";
import React, { useState } from "react";

import { publicInstance } from "../api";

// @ts-ignore
const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handlePress = async () => {
    try {
      await publicInstance.post("/auth/register", { name, email, password, passwordConfirmation });
      navigation.navigate("SignIn");
    } catch (error: any) {
      console.error(error.response.data);
    }
  };

  return (
    <View style={{ gap: 10, paddingHorizontal: 10 }}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput
        placeholder="PasswordConfirmation"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />
      <Button title="Sign in" onPress={handlePress} />
      <Button title="Already have an account" onPress={() => navigation.navigate("SignIn")} />
    </View>
  );
};

export default SignUpScreen;
