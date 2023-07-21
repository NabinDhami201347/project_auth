import { Button, TextInput, View } from "react-native";
import React, { useState } from "react";

import { useAuthContext } from "../context/Auth";
import { publicInstance } from "../api";

// @ts-ignore
const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setTokens } = useAuthContext();

  const handlePress = async () => {
    try {
      const { data } = await publicInstance.post("/auth/login", { email, password });
      setTokens(data.access_token, data.refresh_token);
    } catch (error: any) {
      console.error(error.response.data);
    }
  };

  return (
    <View style={{ gap: 10, paddingHorizontal: 10 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Sign in" onPress={handlePress} />
      <Button title="Forgot Password" onPress={() => navigation.navigate("ForgotPassword")} />
    </View>
  );
};

export default SignInScreen;
