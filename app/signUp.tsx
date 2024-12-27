import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "@/components/loading";
import CustomKeyboard from "@/components/customKeyboard";
import { useAuth } from "@/context/authContext";

export default function SignUp() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    profileUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const togglePassword = () => {
    setIsPasswordVisible((prevState: any) => !prevState);
  };

  // Combined validation function
  const validateInput = ({
    email,
    password,
  }: {
    email?: string;
    password?: string;
  }) => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    if (password) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      return passwordRegex.test(password);
    }

    return false; // If neither email nor password is provided
  };

  const handleRegister = async () => {
    // Validation for empty fields
    const { email, password, username, profileUrl } = form;
    if (!email || !password || !username || !profileUrl) {
      Alert.alert("Sign Up", "Please fill all the fields!");
      return;
    }

    // Email validation
    if (!validateInput({ email })) {
      Alert.alert("Sign Up", "Please enter a valid email address!");
      return;
    }

    // Password validation
    if (!validateInput({ password })) {
      Alert.alert(
        "Sign Up",
        "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await register(
        email.trim(),
        password,
        username,
        profileUrl
      );

      setLoading(false);

      if (!response.success) {
        Alert.alert("Sign Up", response.msg || "An error occurred!");
      }
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Sign Up", error.message || "An unexpected error occurred.");
    }
  };

  // Handle form input change
  const handleInputChange = (field: string, value: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  return (
    <CustomKeyboard>
      <StatusBar style="dark" />
      <View
        style={{ paddingTop: hp(4), paddingHorizontal: wp(5) }}
        className="sm:max-w-sm  md:max-w-md lg:m-auto "
      >
        <View className="items-center">
          <Image
            style={{ height: hp(28) }}
            resizeMode="contain"
            source={require("../assets/images/register-img.png")}
          />
        </View>
        <View className="gap-7">
          <Text
            style={{ fontSize: hp(4) }}
            className="font-bold tracking-wider text-center text-neutral-800"
          >
            Sign Up
          </Text>

          <View className="gap-4">
            {/* Username Field */}
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-2 bg-neutral-100 items-center rounded-xl"
            >
              <Feather name="user" size={hp(2.7)} color="gray" />
              <TextInput
                value={form.username}
                onChangeText={(text) => handleInputChange("username", text)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-medium text-neutral-700"
                placeholder="Username"
                placeholderTextColor="gray"
              />
            </View>

            {/* Email Field */}
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-2 bg-neutral-100 items-center rounded-xl"
            >
              <Octicons name="mail" size={hp(2.7)} color="gray" />
              <TextInput
                value={form.email}
                onChangeText={(text) => handleInputChange("email", text)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-medium text-neutral-700"
                placeholder="Email address"
                placeholderTextColor="gray"
                autoCapitalize="none"
              />
            </View>

            {/* Password Field */}
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-2 bg-neutral-100 items-center rounded-xl"
            >
              <Octicons name="lock" size={hp(2.7)} color="gray" />
              <TextInput
                value={form.password}
                onChangeText={(text) => handleInputChange("password", text)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-medium text-neutral-700"
                placeholder="Password"
                autoCapitalize="none"
                placeholderTextColor="gray"
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={togglePassword}>
                <Feather
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {/* Profile URL Field */}
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-2 bg-neutral-100 items-center rounded-xl"
            >
              <Feather name="image" size={hp(2.7)} color="gray" />
              <TextInput
                value={form.profileUrl}
                onChangeText={(text) => handleInputChange("profileUrl", text)}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-medium text-neutral-700"
                placeholder="Profile URL"
                placeholderTextColor="gray"
              />
            </View>

            {/* Submit Button */}
            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(10)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleRegister}
                  style={{ height: hp(6.5) }}
                  className="bg-indigo-500 rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ fontSize: hp(2.7) }}
                    className="font-bold text-white tracking-wider"
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Sign In Redirect */}
            <View className="flex-row justify-center">
              <Text
                style={{ fontSize: hp(1.8) }}
                className="font-semibold text-neutral-500"
              >
                Already have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/signIn")}>
                <Text
                  style={{ fontSize: hp(1.8) }}
                  className="font-bold text-indigo-500"
                >
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboard>
  );
}
