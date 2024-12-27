import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ChatRoomHeader from "@/components/chatRoomHeader";
import MessageList from "@/components/messageList";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Feather, FontAwesome } from "@expo/vector-icons";
import CustomKeyboard from "@/components/customKeyboard";
import { useAuth } from "@/context/authContext";
import { getRoomId } from "@/utils/common";
import { StatusBar } from "react-native";
import {
  Timestamp,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function ChatRoom() {
  const router = useRouter();
  const { user } = useAuth();
  const item = useLocalSearchParams();
  const [message, setMessage] = useState<any[]>([]);
  const [textInput, setTextInput] = useState<any>("");
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    createRoomIfNotExists();
    const roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "message");
    const q = query(messageRef, orderBy("createdAt", "asc"));
    let unsub = onSnapshot(q, (snapshot) => {
      let allMessages = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setMessage([...allMessages]);
    });
    const KeyboardListener = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );
    return () => {
      unsub();
      KeyboardListener.remove();
    };
  }, []);

  const createRoomIfNotExists = async () => {
    const roomId = getRoomId(user?.userId, item?.userId);
    try {
      const roomRef = doc(db, "rooms", roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        await setDoc(roomRef, {
          roomId,
          createdAt: Timestamp.fromDate(new Date()),
        });
      }
    } catch (error: any) {
      Alert.alert("Error creating room:", error);
    }
  };

  const handleMessage = async () => {
    const trimmedMessage = textInput.trim();
    if (!trimmedMessage) return;

    try {
      const roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messageRef = collection(docRef, "message");

      await addDoc(messageRef, {
        userId: user?.userId,
        text: trimmedMessage,
        profileUrl: user?.profileUrl || "", // Use empty string if undefined
        senderName: user?.username || "Anonymous", // Fallback to "Anonymous"
        createdAt: Timestamp.fromDate(new Date()),
      });

      setTextInput("");
    } catch (error: any) {
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    console.log(messageId, "delete");
    if (!messageId) {
      Alert.alert("Error", "Message ID is missing.");
      return;
    }

    try {
      const roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messageRef = doc(docRef, "message", messageId); // Ensure messageId is valid

      await deleteDoc(messageRef);
    } catch (err: any) {
      Alert.alert("Error deleting message:", err);
    }
  };

  useEffect(() => {
    updateScrollView();
  }, [message]);

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  return (
    <CustomKeyboard inChat={true}>
      <View className="flex-1 bg-white ">
        <StatusBar barStyle="dark-content" />
        <ChatRoomHeader user={item} router={router} />
        <View className="h-3 border-b border-neutral-300" />
        <View className="flex-1 justify-between overflow-visible bg-neutral-100">
          <View className="flex-1">
            <MessageList
              scrollViewRef={scrollViewRef}
              message={message}
              currentUser={user}
              onDeleteMessage={handleDeleteMessage}
            />
          </View>
          <View className="pt-2" style={{ marginBottom: hp(1.7) }}>
            <View className="flex-row justify-between mx-2 bg-white p-2 border-neutral-300 rounded-full ">
              <TextInput
                value={textInput}
                onChangeText={(text) => setTextInput(text)}
                placeholder="Type message...."
                className="flex-1 mr-2"
                style={{ fontSize: hp(2) }}
              />
              <TouchableOpacity
                onPress={handleMessage}
                className="bg-indigo-500 p-3  m-[1px] rounded-full"
              >
                <FontAwesome name="send" size={hp(2.7)} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboard>
  );
}
