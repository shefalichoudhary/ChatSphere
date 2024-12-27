import { KeyboardAvoidingView, ScrollView, Platform } from "react-native";

const ios = Platform.OS == "ios";
export default function CustomKeyboard({ children, inChat }: any) {
  let kavConfig = {};
  let ScrollViewConfig = {};
  if (inChat) {
    kavConfig = { keyboardVerticalOffset: 60 };
    ScrollViewConfig = { contentContainerStyle: { flex: 1 } };
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      {...kavConfig}
      behavior={ios ? "padding" : "height"}
    >
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        {...ScrollViewConfig}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
