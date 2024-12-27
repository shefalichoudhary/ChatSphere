import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, TouchableOpacity, Pressable, Alert } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function MessageItem({
  message,
  currentUser,
  onDeleteMessage,
}: any) {
  const isCurrentUser = currentUser?.userId === message?.userId;

  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  // Handle press on message
  const handlePress = () => {
    setShowDeleteIcon((prev) => !prev);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = () => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          onPress: () => setShowDeleteIcon(false),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDeleteMessage(message.userId), // Pass the message ID to the delete handler
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View>
      <Pressable
        onPress={handlePress}
        className={`flex-row ${
          isCurrentUser ? "justify-end" : "justify-start"
        } mb-3 ${isCurrentUser ? "mr-4" : "ml-3"}`}
      >
        <View style={{ width: wp(80) }}>
          <View
            className={`flex p-3 ${
              showDeleteIcon ? "mr-4" : "mr-1"
            } rounded-2xl ${
              isCurrentUser
                ? "self-end bg-white border border-neutral-200"
                : "self-start bg-indigo-100 border border-indigo-200"
            }`}
          >
            <Text style={{ fontSize: hp(1.9) }}>{message?.text}</Text>
          </View>
        </View>
      </Pressable>
      {isCurrentUser && showDeleteIcon && (
        <TouchableOpacity
          onPress={handleDeleteConfirmation} // Trigger the confirmation pop-up
          style={{
            position: "absolute",
            bottom: hp(3),
            right: hp(0.6),
          }}
        >
          <FontAwesome name="trash" size={hp(2.7)} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
}
