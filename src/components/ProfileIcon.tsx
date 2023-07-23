import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthContext } from "../context/Auth";
import { imageuri } from "../api";

const ProfileIcon = () => {
  const navigation = useNavigation();
  const { user } = useAuthContext();

  const handlePress = () => {
    // @ts-ignore
    navigation.navigate("Profile");
  };

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        {user?.profile && user.profile.photo ? (
          <Image source={{ uri: `${imageuri}${user?.profile.photo}` }} style={styles.image} resizeMode="cover" />
        ) : (
          <Image
            source={{ uri: `https://avatars.githubusercontent.com/u/95552086?v=4` }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ProfileIcon;

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    overflow: "hidden",
    paddingHorizontal: 10,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
});
