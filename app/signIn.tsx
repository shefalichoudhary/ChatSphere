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

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState: any) => !prevState);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Sign In", "Please fill all the fields!");
      return;
    }

    setLoading(true);

    const response = await login(email.trim(), password);
    if (!response.success) {
      Alert.alert("Sign In", response.msg || "An unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <CustomKeyboard>
      <StatusBar style="dark" />
      <View
        style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }}
        className="sm:max-w-sm  md:max-w-md lg:m-auto "
      >
        <View className="items-center">
          <Image
            style={{ height: hp(30) }}
            resizeMode="contain"
            source={require("../assets/images/login-img.png")}
          />
        </View>
        <View className="gap-8">
          <Text
            style={{ fontSize: hp(3.8) }}
            className="font-bold tracking-wider text-center text-neutral-800"
          >
            Sign In
          </Text>

          <View className="gap-4">
            {/* Email Input */}
            <View
              style={{ height: hp(7) }}
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

            {/* Password Input */}
            <View className="gap-3">
              <View
                style={{ height: hp(7) }}
                className="flex-row gap-4 px-2 bg-neutral-100 items-center rounded-xl"
              >
                <Octicons name="lock" size={hp(2.7)} color="gray" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-medium text-neutral-700"
                  placeholder="Password"
                  autoCapitalize="none"
                  placeholderTextColor="gray"
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Feather
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => router.push(`/forgotPassword?email=${email}`)}
              >
                <Text
                  style={{ fontSize: hp(1.8) }}
                  className="font-semibold text-right text-neutral-500"
                >
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(6.5)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleLogin}
                  style={{ height: hp(6.5) }}
                  className="bg-indigo-500 rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ fontSize: hp(2.7) }}
                    className="font-bold text-white tracking-wider"
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center">
              <Text
                style={{ fontSize: hp(1.8) }}
                className="font-semibold text-neutral-500"
              >
                Don't have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/signUp")}>
                <Text
                  style={{ fontSize: hp(1.8) }}
                  className="font-bold text-indigo-500"
                >
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboard>
  );
}
