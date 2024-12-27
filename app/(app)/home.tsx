import { View, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { StatusBar } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ChatList from "@/components/chatList";
import { userRef } from "@/firebaseConfig";
import { where, query, getDocs } from "firebase/firestore";

export default function home() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    if (user?.userId) {
      getUsers();
    }
  }, [user?.userId]);

  const getUsers = async () => {
    try {
      const q = query(userRef, where("userId", "!=", user?.userId));
      const querySnapShot = await getDocs(q);
      let data: any[] = [];
      querySnapShot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });

      setUsers(data);
    } catch (error: any) {
      Alert.alert("Error", "Unable to fetch users. Please try again.");
    }
  };
  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      {users.length > 0 ? (
        <ChatList currentUser={user} users={users} />
      ) : (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}
