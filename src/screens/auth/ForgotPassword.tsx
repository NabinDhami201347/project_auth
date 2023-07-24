import { Button, TextInput, View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { publicInstance } from "../../api";
import { CustomButton } from "../../components/ui";

interface Error {
  field: string;
  message: string;
}

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);

  const handlePress = async () => {
    try {
      setErrors([]); // Clear any previous errors
      await publicInstance.put("/auth/forgot", { email, password, passwordConfirmation });
      navigation.navigate("SignIn");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        const responseErrors: Error[] = error.response.data.errors;
        setErrors(responseErrors); // Set the errors array with specific field errors
      } else {
        setErrors([
          {
            field: "general",
            message: "An error occurred. Please try again.",
          },
        ]); // Fallback error message
      }
    }
  };

  const getErrorMessageForField = (field: string) => {
    const fieldError = errors.find((err) => err.field === field);
    return fieldError ? fieldError.message : "";
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {getErrorMessageForField("body.email") !== "" && (
        <Text style={styles.errorText}>{getErrorMessageForField("body.email")}</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      {getErrorMessageForField("body.password") !== "" && (
        <Text style={styles.errorText}>{getErrorMessageForField("body.password")}</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          secureTextEntry
        />
      </View>
      {getErrorMessageForField("body.passwordConfirmation") !== "" && (
        <Text style={styles.errorText}>{getErrorMessageForField("body.passwordConfirmation")}</Text>
      )}

      {getErrorMessageForField("general") !== "" && (
        <Text style={styles.errorText}>{getErrorMessageForField("general")}</Text>
      )}

      <CustomButton title="Change Password" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center", // Center content vertically
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#000",
  },
  errorText: {
    color: "red",
    textAlign: "right",
    marginBottom: 10,
  },
});

export default ForgotPasswordScreen;
