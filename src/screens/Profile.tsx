import React from "react";
import { StyleSheet, View } from "react-native";
import { CustomCard } from "../components/ui";
import { useAuthContext } from "../context/Auth";
import { ProfileCard } from "../components/shared";

const ProfileScreen = () => {
  const { user } = useAuthContext();

  return (
    <View style={styles.container}>
      <ProfileCard profile={user?.profile} username={user?.name} />

      <View style={{ flexDirection: "row" }}>
        <CustomCard title="Department" icon="home" content="Computer Engineering" />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <CustomCard title="Semester" icon="calendar" content="Eight" />
        <CustomCard title="Library Books" icon="book" content="6" />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <CustomCard title="Total Subjects" icon="calendar" content="24" />
        <CustomCard title="Subject Passed" icon="book" content="24" />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});
