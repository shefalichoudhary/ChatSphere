import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useAuth } from "@/context/authContext";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

export default function ProfilePage() {
  const { user, logOut } = useAuth();
  const router = useRouter();

  // Handle Log Out
  const handleLogOut = async () => {
    await logOut();
    router.push("/signIn"); // Redirect to sign-in page after logout
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "ios" ? hp(5) : hp(3),
        paddingHorizontal: wp(5),
        backgroundColor: "#f3f4f6",
      }}
    >
      <View className="items-center mb-8">
        {/* Profile Image */}
        <Image
          source={user?.profileUrl}
          style={{
            width: wp(30),
            height: wp(30),
            borderRadius: wp(15),
            marginBottom: hp(2),
          }}
        />
        {/* Username */}
        <Text
          style={{
            fontSize: hp(3),
            fontWeight: "600",
            color: "#333",
            marginBottom: hp(1),
          }}
        >
          {user?.username || "User Name"}
        </Text>
        {/* Email */}
        <Text
          style={{
            fontSize: hp(2),
            color: "#555",
            marginBottom: hp(3),
          }}
        >
          {user?.email || "Email Address"}
        </Text>
      </View>

      {/* Log Out Button */}
      <TouchableOpacity
        onPress={handleLogOut}
        style={{
          backgroundColor: "#f87171", // Red button
          paddingVertical: hp(2),
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: hp(2.5),
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Log Out
        </Text>
        <AntDesign
          name="logout"
          size={hp(2.5)}
          color="#fff"
          style={{ position: "absolute", right: wp(5) }}
        />
      </TouchableOpacity>
    </View>
  );
}
