import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";

import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { blurhash, formData, getRoomId } from "@/utils/common";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function ChatItem({ item, router, noBorder, currentUser }: any) {
  const [lastMessage, setLastMessage] = useState<any>(null);
  useEffect(() => {
    const roomId = getRoomId(currentUser?.uid, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "message");
    const q = query(messageRef, orderBy("createdAt", "asc"));

    // Subscribe to real-time updates
    const unsub = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => doc.data());
      setLastMessage(
        allMessages.length > 0 ? allMessages[allMessages.length - 1] : null
      );
    });

    return unsub; // Cleanup subscription
  }, [currentUser?.uid, item?.userId]);

  const openChatRoom = () => {
    router.push({ pathname: "/chatRoom", params: item });
  };

  const renderTime = () => {
    if (lastMessage && lastMessage.createdAt) {
      const date = new Date(lastMessage.createdAt.seconds * 1000);
      return formData(date); // Assuming `formData` formats the date
    }
    return "";
  };

  const renderLastMessage = () => {
    if (!lastMessage) return "Say hello"; // Default message
    if (currentUser?.uid === lastMessage?.userId) {
      return `You: ${lastMessage.text}`;
    }
    return lastMessage.text;
  };

  return (
    <TouchableOpacity
      onPress={openChatRoom}
      className={`flex-row justify-between mx-4 my-2 pb-2 items-center gap-3 ${
        noBorder ? "" : "border-b border-b-neutral-200"
      }`}
    >
      <Image
        source={item?.profileUrl || require("../assets/images/user-img.png")}
        style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
        placeholder={blurhash}
        transition={500}
        className="rounded-full"
      />
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-semibold text-neutral-800"
          >
            {item?.username || "Unknown"}
          </Text>
          <Text
            style={{ fontSize: hp(1.6) }}
            className="font-medium text-neutral-500"
          >
            {renderTime()}
          </Text>
        </View>
        <Text
          style={{ fontSize: hp(1.6) }}
          className="font-medium text-neutral-500"
        >
          {renderLastMessage()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
