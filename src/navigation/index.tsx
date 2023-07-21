import * as React from "react";
import { Button, TextInput, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { useAuthContext } from "../context/Auth";
import HomeScreen from "../screens/Home";
import SignInScreen from "../screens/SignIn";

const Stack = createNativeStackNavigator();

export default function Routes() {
  const { access_token } = useAuthContext();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <>
          {access_token ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          )}
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function ProfileScreen() {
  return <View />;
}

function SignUpScreen() {
  return <View />;
}
