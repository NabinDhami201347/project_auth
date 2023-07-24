import { Button, TextInput, View, StyleSheet, Text } from "react-native";
import React, { useState, useRef } from "react";
import { protectedInstance } from "../../api";

interface Error {
  field: string;
  message: string;
}

const ChangePasswordScreen = ({ navigation }: any) => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);

  const oldPasswordInputRef = useRef<TextInput | null>(null);
  const passwordInputRef = useRef<TextInput | null>(null);
  const passwordConfirmationInputRef = useRef<TextInput | null>(null);

  const handlePress = async () => {
    try {
      setErrors([]); // Clear any previous errors

      if (password.length < 6) {
        setErrors([{ field: "body.password", message: "Password must be at least 6 characters long" }]);
        return;
      }

      if (passwordConfirmation.length < 6) {
        setErrors([
          { field: "body.passwordConfirmation", message: "Password confirmation must be at least 6 characters long" },
        ]);
        return;
      }

      await protectedInstance.put("/auth/change", { oldPassword, password, passwordConfirmation });
      navigation.navigate("Home");
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
          placeholder="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
          ref={oldPasswordInputRef}
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />
      </View>
      {getErrorMessageForField("body.oldPassword") !== "" && (
        <Text style={styles.errorText}>{getErrorMessageForField("body.oldPassword")}</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          ref={passwordInputRef}
          onSubmitEditing={() => passwordConfirmationInputRef.current?.focus()}
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
          ref={passwordConfirmationInputRef}
          onSubmitEditing={handlePress}
        />
      </View>
      {getErrorMessageForField("body.passwordConfirmation") !== "" && (
        <Text style={styles.errorText}>{getErrorMessageForField("body.passwordConfirmation")}</Text>
      )}

      {getErrorMessageForField("general") !== "" && (
        <Text style={styles.errorText}>{getErrorMessageForField("general")}</Text>
      )}

      <Button title="Change Password" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
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
    textAlign: "center",
    marginBottom: 10,
  },
});

export default ChangePasswordScreen;
