import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; // Correct hook for query parameters
import { useAuth } from "@/context/authContext";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Loading from "@/components/loading";
import { Octicons } from "@expo/vector-icons";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const router = useRouter();
  const { email: queryEmail } = useLocalSearchParams(); // Correctly using useLocalSearchParams to get query params

  // Set email from query params if available
  useEffect(() => {
    if (Array.isArray(queryEmail)) {
      setEmail(queryEmail[0]); // Use the first email if it's an array
    } else if (queryEmail) {
      setEmail(queryEmail); // Use the email directly if it's a single string
    }
  }, [queryEmail]);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Forgot Password", "Please enter your email address.");
      return;
    }

    setLoading(true);
    const response = await forgotPassword(email.trim());
    if (!response.success) {
      Alert.alert("Forgot Password", response.msg || "An error occurred.");
    } else {
      router.push("/signIn");
    }
    setLoading(false);
  };

  return (
    <View
      style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }}
      className="sm:max-w-sm  md:max-w-md lg:mx-auto  "
    >
      <StatusBar style="dark" />
      <View className="items-center">
        <Image
          style={{ height: hp(28) }}
          resizeMode="contain"
          source={require("../assets/images/forgot-password.png")}
        />
      </View>
      <View className="gap-8 mt-4">
        <Text
          style={{ fontSize: hp(3.5) }}
          className="font-medium tracking-wider text-center text-neutral-800"
        >
          Forgot your password?
        </Text>

        <View className="gap-4">
          {/* Email Input */}
          <View
            style={{ height: hp(8) }}
            className="flex-row gap-4 px-2 bg-neutral-100 items-center rounded-xl"
          >
            <Octicons name="mail" size={hp(2.7)} color="gray" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={{ fontSize: hp(2) }}
              className="flex-1 font-medium text-neutral-700"
              placeholder="Email address"
              placeholderTextColor="gray"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          {/* Submit Button */}
          <View>
            {loading ? (
              <View className="flex-row justify-center">
                <Loading size={hp(6.5)} />
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={{ height: hp(6.5) }}
                className="bg-indigo-500 rounded-xl justify-center items-center"
              >
                <Text
                  style={{ fontSize: hp(2.7) }}
                  className="font-bold text-white tracking-wider"
                >
                  Reset Password
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Back to Sign In Link */}
          <View className="flex-row justify-center">
            <Text
              style={{ fontSize: hp(1.8) }}
              className="font-semibold text-neutral-500"
            >
              Remembered your password?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/signIn")}>
              <Text
                style={{ fontSize: hp(1.8) }}
                className="font-bold text-indigo-500"
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
