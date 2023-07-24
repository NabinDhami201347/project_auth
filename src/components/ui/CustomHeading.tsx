import React, { ReactNode } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

type HeadingProps = {
  children: ReactNode;
  style?: TextStyle;
};

export const LargeHeading: React.FC<HeadingProps> = ({ children, style }) => {
  return <Text style={[styles.largeHeading, style]}>{children}</Text>;
};

export const SmallHeading: React.FC<HeadingProps> = ({ children, style }) => {
  return <Text style={[styles.smallHeading, style]}>{children}</Text>;
};

export const Paragraph: React.FC<HeadingProps> = ({ children, style }) => {
  return <Text style={[styles.paragraph, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  largeHeading: {
    fontSize: 20,
    color: "white",
  },
  smallHeading: {
    fontSize: 14,
    color: "white",
  },
  paragraph: {
    fontSize: 12,
    color: "white",
    opacity: 0.5,
    marginBottom: 8,
  },
});
