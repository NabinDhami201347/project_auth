import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { useAuthContext } from "../context/Auth";
import {
  ChangePasswordScreen,
  ForgotPasswordScreen,
  HomeScreen,
  ProfileScreen,
  SignInScreen,
  SignUpScreen,
} from "../screens";

const Stack = createNativeStackNavigator();

const PrivateStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

const PublicStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default function Routes() {
  const { access_token } = useAuthContext();
  return <NavigationContainer>{access_token ? <PrivateStack /> : <PublicStack />}</NavigationContainer>;
}
