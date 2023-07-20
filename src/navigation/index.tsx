import * as React from "react";
import { Button, TextInput, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { useAuthContext } from "../context/Auth";
import HomeScreen from "../screens/Home";

const Stack = createNativeStackNavigator();

export default function Routes() {
  const { token } = useAuthContext();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <>
          {token ? (
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

//

function ProfileScreen() {
  return <View />;
}

function HelpScreen() {
  return <View />;
}

function SignInScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { setToken } = useAuthContext();

  return (
    <View>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Sign in" onPress={() => setToken(username)} />
    </View>
  );
}

function SignUpScreen() {
  return <View />;
}
