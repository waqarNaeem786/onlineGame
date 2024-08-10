// ios 1000946314250-h5103ljg56r8e42fmq3fu4vkffu8gc2m.apps.googleusercontent.com
// android 1000946314250-eppdjlv2npq2ks989sgmk72frtq9u5ml.apps.googleusercontent.com

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import ImageSlider from "./ImageSlider";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [did, setDid] = useState(uuid.v4());

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "1000946314250-h5103ljg56r8e42fmq3fu4vkffu8gc2m.apps.googleusercontent.com",
    androidClientId:
      "616965238015-j34u6lrlp74mevipt5ch82kmcvv5nvmr.apps.googleusercontent.com",
  });

  useEffect(() => {
    axios
      .get("http://ip-api.com/json")
      .then((res) => {
        setCountryCode(res.data.countryCode);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleLogin(authentication.accessToken);
    }
  }, [response]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please fill in both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://cashgames.website/api/login",
        {
          email,
          password,
          cc: countryCode,
          did,
        },
      );

      let jsonD = JSON.parse(response.data.data);
      if (jsonD.message !== "Invalid login credentals!") {
        const authkey = jsonD.message;
        const apiKey = jsonD.u;

        await AsyncStorage.setItem("AuthToken", authkey);
        await AsyncStorage.setItem("ApiToken", apiKey);

        setAuthToken(authkey);
        setApiToken(apiKey);

        navigation.navigate("MainTabs");
      } else {
        Alert.alert(
          "Error",
          response.data.message ||
            "Login failed. Please check your credentials.",
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (accessToken) => {
    try {
      console.log("Access token:", accessToken);
      const response = await axios.post(
        "https://cashgames.website/api/glogin",
        {
          t: accessToken,
          cc: countryCode,
          did,
        },
      );

      let jsonD = JSON.parse(response.data.data);

      if ((jsonD.status = 0)) {
        Alert.alert("Error", jsonD.message);
      }

      if (jsonD.status === 1) {
        const authkey = jsonD.message;
        const apiKey = jsonD.u;

        await AsyncStorage.setItem("AuthToken", authkey);
        await AsyncStorage.setItem("ApiToken", apiKey);

        setAuthToken(authkey);
        setApiToken(apiKey);

        navigation.navigate("MainTabs");
      } else {
        Alert.alert("Error", jsonD.message || "Google login failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      console.log(error.response);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 50 }}>
        <ImageSlider />
      </View>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.googleButton}
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      >
        <FontAwesome
          name="google"
          size={24}
          color="#fff"
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("PasswordRecovery")}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Subscription")}>
        <Text style={styles.link}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#131224",
  },
  title: {
    fontSize: 28,
    color: "white",
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#6200ea",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 16,
    borderRadius: 8,
    color: "white",
    backgroundColor: "#3d0066",
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    marginTop: 12,
  },
  button: {
    backgroundColor: "#6A5DA5",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#db4437",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  iconContainer: {
    marginHorizontal: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#6200ea",
    textAlign: "center",
    fontSize: 16,
    marginVertical: 8,
  },
});

export default LoginPage;
