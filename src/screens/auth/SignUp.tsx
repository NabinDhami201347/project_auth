import { TextInput, View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { FontAwesome as Icon } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { publicInstance } from "../../api";
import { CustomButton } from "../../components/ui";

interface Error {
  field: string;
  message: string;
}

const SignUpScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);

  const emailInputRef = useRef<TextInput | null>(null);
  const passwordInputRef = useRef<TextInput | null>(null);
  const passwordConfirmationInputRef = useRef<TextInput | null>(null);

  const handlePress = async () => {
    try {
      setErrors([]); // Clear any previous errors
      await publicInstance.post("/auth/register", {
        name,
        email,
        password,
        passwordConfirmation,
      });
      navigation.navigate("SignIn");
    } catch (error: any) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          const responseErrors: Error[] = error.response.data.errors;
          setErrors(responseErrors); // Set the errors array with specific field errors
        } else if (error.response.data.error) {
          setErrors([
            {
              field: "general",
              message: error.response.data.error,
            },
          ]); // Set the error message with the key "error"
        } else {
          setErrors([
            {
              field: "general",
              message: "An error occurred. Please try again.",
            },
          ]); // Fallback error message
        }
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          onSubmitEditing={() => emailInputRef.current?.focus()}
          autoCapitalize="words"
        />
      </View>
      {getErrorMessageForField("body.name") !== "" && (
        <Text style={styles.errorText}>{getErrorMessageForField("body.name")}</Text>
      )}

      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="gray" style={styles.icon} />
        <TextInput
          ref={emailInputRef}
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={() => passwordInputRef.current?.focus()}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {getErrorMessageForField("body.email") !== "" && (
        <Text style={styles.errorText}>{getErrorMessageForField("body.email")}</Text>
      )}

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="gray" style={styles.icon} />
        <TextInput
          ref={passwordInputRef}
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={() => passwordConfirmationInputRef.current?.focus()}
        />
      </View>
      {getErrorMessageForField("body.password") !== "" && (
        <Text style={styles.errorText}>{getErrorMessageForField("body.password")}</Text>
      )}

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="gray" style={styles.icon} />
        <TextInput
          ref={passwordConfirmationInputRef}
          style={styles.input}
          placeholder="Password Confirmation"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          secureTextEntry
          onSubmitEditing={handlePress}
        />
      </View>
      {getErrorMessageForField("body.passwordConfirmation") !== "" && (
        <Text style={styles.errorText}>{getErrorMessageForField("body.passwordConfirmation")}</Text>
      )}

      {getErrorMessageForField("general") !== "" && (
        <Text style={styles.errorText}>{getErrorMessageForField("general")}</Text>
      )}

      <CustomButton title="Sign up" onPress={handlePress} />
      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.linkText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
      <Text style={styles.note}>By signing up, you agree to our Terms of Service and Privacy Policy.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Light gray background color
    justifyContent: "center", // Center contents vertically
    paddingVertical: 20,
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
    backgroundColor: "#fff", // White background for input containers
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#000", // Black text color for inputs
  },
  icon: {
    marginHorizontal: 5,
  },
  errorText: {
    color: "red",
    textAlign: "right",
    marginBottom: 10,
  },
  linkText: {
    color: "blue",
    textAlign: "center",
    marginBottom: 10,
  },
  note: {
    textAlign: "center",
    color: "#888", // Gray text color for note
  },
});

export default SignUpScreen;
