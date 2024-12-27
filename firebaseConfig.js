import { initializeApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth"; // For React Native
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC29baA5dMCEcDMbOlNpartMizv35CZOZE",
  authDomain: "chat-app-2b7df.firebaseapp.com",
  projectId: "chat-app-2b7df",
  storageBucket: "chat-app-2b7df.firebasestorage.app",
  messagingSenderId: "86089784177",
  appId: "1:86089784177:web:b45265ad3069f6ece034d0",
  measurementId: "G-K0F70VEGNQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Check if running in a React Native environment or in the browser
const isReactNative =
  typeof navigator !== "undefined" && navigator.product === "ReactNative";

// Initialize Auth with appropriate persistence
const auth = initializeAuth(app, {
  persistence: isReactNative
    ? getReactNativePersistence(AsyncStorage) // React Native persistence
    : browserLocalPersistence, // Browser persistence (localStorage)
});

// Firestore
const db = getFirestore(app);

// References
export const userRef = collection(db, "users");
export const roomRef = collection(db, "rooms");

export { auth, db };
