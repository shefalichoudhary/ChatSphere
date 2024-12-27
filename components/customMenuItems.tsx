import { View, Text } from "react-native";
import { MenuOption } from "react-native-popup-menu";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function MenuItem({ text, action, value, icon }: any) {
  return (
    <View>
      <MenuOption onSelect={() => action(value)}>
        <View className=" px-4 py-1 flex-row justify-between items-center">
          <Text
            className="font-semibold text-neutral-600"
            style={{ fontSize: hp(1.7) }}
          >
            {text}
          </Text>
          {icon}
        </View>
      </MenuOption>
    </View>
  );
}
