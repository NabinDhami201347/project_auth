import React from "react";
import { StyleSheet, Text } from "react-native";

type CustomErrorProps = {
  message?: string;
} & React.ComponentProps<typeof Text>;

const CustomError: React.FC<CustomErrorProps> = ({ message }) => {
  return <Text style={styles.danger}>{message}</Text>;
};

const styles = StyleSheet.create({
  danger: {
    color: "red",
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
});

export default CustomError;
