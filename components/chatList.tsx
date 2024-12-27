import { View, FlatList } from "react-native";
import ChatItem from "./chatItem";
import { useRouter } from "expo-router";

export default function ChatList({ users, currentUser }: any) {
  const router = useRouter();
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{ flex: 1, paddingVertical: 20 }}
        keyExtractor={(item: any) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChatItem
            currentUser={currentUser}
            noBorder={index + 1 == users.length}
            router={router}
            item={item}
            index={index}
          />
        )}
      />
    </View>
  );
}
