import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Alert } from "react-native";

interface User {
  userId: string;
  email: string;
  username?: string;
  profileUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean | undefined;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string }>;
  register: (
    email: string,
    password: string,
    username: string,
    profileUrl: string
  ) => Promise<{ success: boolean; msg?: string }>;
  logOut: () => Promise<{ success: boolean; msg?: string }>;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; msg?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setAuthenticated] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        setAuthenticated(true);
        // Fetch the user's additional data from Firestore using user.uid
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            userId: user.uid,
            email: user.email,
            username: userData?.username || "Unknown", // Default to 'Unknown' if not found
            profileUrl: userData?.profileUrl || "", // Default to empty string if not found
          });
        } else {
          // Handle case where user data is not found in Firestore
          setUser({
            userId: user.uid,
            email: user.email,
            username: "Unknown", // Default username
            profileUrl: "", // Default empty profileUrl
          });
        }
      } else {
        setAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, data: response?.user };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-credential)")) msg = "Wrong credential";
      if (msg.includes("(auth/network-request-failed)"))
        msg = "Please check your internet connection and try again";
      return { success: false, msg };
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      return { success: false, msg, error };
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    profileUrl: string
  ) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        profileUrl,
        userId: response?.user?.uid,
      });
      console.log(response?.user, "Effe");

      return { success: true, data: response?.user };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/email-already-in-use)"))
        msg = "This email is already  in use";

      return { success: false, msg };
    }
  };
  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email); // Send the reset email
      Alert.alert(
        "Forgot Password",
        "Password reset email sent! Check your inbox."
      );
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) {
        msg = "Please enter a valid email address.";
      } else if (msg.includes("(auth/user-not-found)")) {
        msg = "No account found with this email address.";
      }
      Alert.alert(
        "Forgot Password",
        msg || "An error occurred while sending the email."
      );
      return { success: false, msg }; // Return failure status with message
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logOut, forgotPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("userAuth must be wrapped inside AuthContextProvider");
  }
  return value;
};
