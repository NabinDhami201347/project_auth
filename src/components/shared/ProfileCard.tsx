import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image, StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";

import type { Profile } from "../../types";
import { imageuri, protectedInstance } from "../../api";
import mime from "mime";
import { useAuthContext } from "../../context/Auth";

interface ProfileCardProps {
  profile?: Profile;
  username?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, username }) => {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerResult | null>(null);
  const { updateUser } = useAuthContext();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access the photo library was denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      return;
    }

    // @ts-ignore
    const asset = selectedImage.assets[0];
    const mimeType = mime.getType(asset.uri);
    const formData = new FormData();

    // @ts-ignore
    formData.append("file", {
      uri: asset.uri,
      type: mimeType,
      name: asset.fileName || "image.jpg",
    });

    try {
      const response = await protectedInstance.post("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      updateUser(response.data.user);
      setSelectedImage(null);
    } catch (error: any) {
      console.log("Upload failed:", error.response.data);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.basicBasicInformationContainer}>
          {selectedImage && selectedImage.assets && selectedImage.assets.length > 0 ? (
            <Image source={{ uri: selectedImage.assets[0].uri }} style={styles.image} resizeMode="cover" />
          ) : (
            <>
              {profile && profile?.photo ? (
                <Image source={{ uri: `${imageuri}${profile.photo}` }} style={styles.image} resizeMode="cover" />
              ) : (
                <Image
                  source={{ uri: `https://avatars.githubusercontent.com/u/95552086?v=4` }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
            </>
          )}
          <TouchableOpacity style={styles.editButton} onPress={pickImage}>
            <AntDesign name="edit" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {selectedImage ? (
        <Button title="Save" onPress={uploadImage} />
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{username}</Text>
        </View>
      )}
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  basicBasicInformationContainer: {
    position: "relative",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editButton: {
    position: "absolute",
    bottom: 8,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: 5,
  },
  infoContainer: {
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
});
