import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

type CustomButtonProps = {
  onPress: () => void;
  title: string;
  backgroundColor?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title, backgroundColor = "#4942E4" }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, { backgroundColor }]}>
      <Text style={styles.button}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 10,
  },
  button: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default CustomButton;
