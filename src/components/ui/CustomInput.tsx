import React from "react";
import { TextInput, ViewStyle, TextInputProps } from "react-native";

interface CustomInputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: ViewStyle;
}

const CustomInput: React.FC<CustomInputProps> = ({ placeholder, value, onChangeText, style, ...rest }) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={[{ borderColor: "gray", borderWidth: 1, padding: 10 }, style]}
      {...rest} // Spread the remaining props to TextInput
    />
  );
};

export default CustomInput;
