import { ScrollView } from "react-native";
import React from "react";
import MessageItem from "./messageItem";

export default function MessageList({
  scrollViewRef,
  message,
  currentUser,
  onDeleteMessage,
}: any) {
  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 10 }}
    >
      {message.map((message: any, index: any) => {
        return (
          <MessageItem
            key={index}
            currentUser={currentUser}
            message={message}
            onDeleteMessage={onDeleteMessage}
          />
        );
      })}
    </ScrollView>
  );
}
