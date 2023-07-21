import { Button, TextInput, View } from "react-native";
import React, { useState } from "react";

import { useAuthContext } from "../context/Auth";
import { publicInstance } from "../api";

const SignInScreen = () => {
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
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Sign in" onPress={handlePress} />
    </View>
  );
};

export default SignInScreen;
