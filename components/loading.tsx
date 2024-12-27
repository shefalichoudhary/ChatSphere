import { View } from "react-native";
import LottieView from "lottie-react-native";

export default function Loading({ size }: any) {
  return (
    <View style={{ height: size, aspectRatio: 1 }}>
      <LottieView
        style={{ flex: 1 }}
        source={require("../assets/images/Animation - 1734787428842.json")}
        autoPlay
        loop
      ></LottieView>
    </View>
  );
}
