import { View, Text, Platform } from "react-native";
import { Image } from "expo-image";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { blurhash } from "@/utils/common";
import { useAuth } from "@/context/authContext";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import MenuItem from "./customMenuItems";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ios = Platform.OS == "ios";

export default function HomeHeader() {
  const router = useRouter();
  const { user, logOut } = useAuth();
  const { top } = useSafeAreaInsets();

  const handleProfile = () => {
    router.push("/profilePage");
  };
  const handleLogOut = async () => {
    await logOut();
  };

  return (
    <View
      style={{ paddingTop: ios ? top : top + 11 }}
      className="flex-row justify-between px-5 bg-indigo-500 pb-7 rounded-b-3xl shadow"
    >
      <View>
        <Text style={{ fontSize: hp(3) }} className="font-medium, text-white">
          Chats
        </Text>
      </View>
      <View>
        <Menu>
          <MenuTrigger customStyles={{ triggerWrapper: {} }}>
            <Image
              style={{ height: hp(4.4), aspectRatio: 1, borderRadius: 100 }}
              source={
                user?.profileUrl
                  ? { uri: user?.profileUrl }
                  : require("../assets/images/user-img.png")
              }
              placeholder={blurhash}
              transition={1000}
            />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                borderRadius: 10,
                borderCurve: "continuous",
                marginTop: 40,
                marginLeft: -30,
                backgroundColor: "white",
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 0 },
                width: 160,
              },
            }}
          >
            <MenuItem
              text="Profile"
              action={handleProfile}
              value={null}
              icon={<Feather name="user" size={hp(2.5)} color="#737373" />}
            />
            <Divider></Divider>
            <MenuItem
              text="sign Out"
              action={handleLogOut}
              value={null}
              icon={<AntDesign name="logout" size={hp(2.5)} color="#737373" />}
            />
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
}

const Divider = () => {
  return <View className="p-[1px] w-full bg-neutral-200"></View>;
};
