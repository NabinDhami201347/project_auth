```tsx
<Stack.Navigator>
  {isSignedIn ? (
    <>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </>
  ) : (
    <>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </>
  )}
</Stack.Navigator>
```

When `isSignedIn` is `true`, React Navigation will only see the `Home`, `Profile` and `Settings` screens, and when it's false, React Navigation will see the `SignIn` and `SignUp` screens. This makes it impossible to navigate to the Home, Profile and Settings screens when the user is not signed in, and to SignIn and SignUp screens when the user is signed in.

> **_The magic happens when the value of the isSignedIn variable changes. Let's say, initially isSignedIn is false. This means, either SignIn or SignUp screens are shown. After the user signs in, the value of isSignedIn will change to true. React Navigation will see that the SignIn and SignUp screens are no longer defined and so it will remove them. Then it'll show the Home screen automatically because that's the first screen defined when isSignedIn is true._**
