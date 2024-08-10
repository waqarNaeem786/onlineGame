import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";

const GoogleRewards = ({ items, image, handleRedeem }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Google Rewards</Text>
      <View style={styles.sideBySideContainer}>
        {items.map((item) => (
          <View
            key={item.id}
            style={styles.sideCard}
            onPress={() => handleRedeem(item)}
          >
            <TouchableOpacity
              onPress={() => handleRedeem(item)}
              style={{ alignItems: "center" }}
            >
              <Image source={{ uri: image }} style={styles.cardImage} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text style={styles.content}>Points: {item.points}</Text>
                <Text style={styles.content}>{item.amount}</Text>
              </View>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => handleRedeem(item)}
              >
                <Ionicons name="play-circle" size={30} color="#6200ea" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const AmazonRewards = ({ items, image, handleRedeem }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Amazon Rewards</Text>
      <View style={styles.sideBySideContainer}>
        {items.map((item) => (
          <View
            key={item.id}
            style={styles.sideCard}
            onPress={() => handleRedeem(item)}
          >
            <TouchableOpacity
              onPress={() => handleRedeem(item)}
              style={{ alignItems: "center" }}
            >
              <Image source={{ uri: image }} style={styles.cardImage} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text style={styles.content}>Points: {item.points}</Text>
                <Text style={styles.content}>{item.amount}</Text>
              </View>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => handleRedeem(item)}
              >
                <Ionicons name="play-circle" size={30} color="#6200ea" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const GiftPaymentPage = () => {
  const [change, setChange] = useState(false);
  const [googleRewards, setGoogleRewards] = useState({
    items: [],
    image: null,
  });
  const [amazonRewards, setAmazonRewards] = useState({
    items: [],
    image: null,
  });
  const [userPoints, setUserPoints] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const token = await AsyncStorage.getItem("AuthToken");
        const response = await axios.post(
          "https://cashgames.website/api/gift/get",
          {},
          {
            headers: { Authorization: token },
          },
        );
        if (response.data.status === 1) {
          const googleRewards = response.data.cat.find((cat) =>
            cat.name.includes("Google Play"),
          );
          const amazonRewards = response.data.cat.find((cat) =>
            cat.name.includes("Amazon"),
          );
          setGoogleRewards({
            items: googleRewards.items,
            image: googleRewards.image,
          });
          setAmazonRewards({
            items: amazonRewards.items,
            image: amazonRewards.image,
          });
          setUserPoints(response.data.balance);
        }
      } catch (error) {
        console.error("Failed to fetch rewards:", error);
      }
    };

    const fetchCountryCode = async () => {
      try {
        const res = await axios.get(
          "https://ipinfo.io/json?token=285fe0806df8ea",
        );
        setCountryCode(res.data.country);
      } catch (error) {
        console.error("Error fetching country code:", error);
      }
    };

    fetchRewards();
    fetchCountryCode();
  }, []);

  const handleRedeem = (item) => {
    setSelectedItem(item);
    if (userPoints >= item.points) {
      setModalMessage("The card has been sent to your email.");
    } else {
      setModalMessage("You do not have enough points.");
    }
    setModalVisible(true);
  };

  const handleSendEmail = async () => {
    try {
      const token = await AsyncStorage.getItem("AuthToken");
      const response = await axios.post(
        "https://cashgames.website/api/gift/post",
        {
          wid: selectedItem.id,
          acc: email,
          cc: countryCode,
        },
        {
          headers: { Authorization: token },
        },
      );
      if (response.data.status === 1) {
        Alert.alert("Success", "The card has been sent to your email.");
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to send email. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error sending email:", error);
      Alert.alert("Error", "Failed to send email. Please try again.");
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <TouchableOpacity
          style={
            !change
              ? styles.buttonTouch2
              : {
                  backgroundColor: "#282844",
                  color: "#fff",
                  borderRadius: 20,
                  width: 150,
                }
          }
          onPress={() => setChange(true)}
        >
          <Text
            style={
              !change
                ? styles.buttonText
                : {
                    textAlign: "center",
                    marginTop: 10,
                    color: "#fff",
                    fontSize: 16,
                  }
            }
          >
            Google Rewards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            change
              ? styles.buttonTouch2
              : {
                  backgroundColor: "#282844",
                  color: "#fff",
                  borderRadius: 20,
                  marginLeft: 10,
                  width: 150,
                }
          }
          onPress={() => setChange(false)}
        >
          <Text
            style={
              change
                ? styles.buttonText
                : {
                    textAlign: "center",
                    marginTop: 10,
                    color: "#fff",
                    fontSize: 16,
                  }
            }
          >
            Amazon Rewards
          </Text>
        </TouchableOpacity>
      </View>
      {change ? (
        <GoogleRewards
          items={googleRewards.items}
          image={googleRewards.image}
          handleRedeem={handleRedeem}
        />
      ) : (
        <AmazonRewards
          items={amazonRewards.items}
          image={amazonRewards.image}
          handleRedeem={handleRedeem}
        />
      )}
      <Modal
        isVisible={modalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          {userPoints >= (selectedItem ? selectedItem.points : 0) ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleSendEmail}
              >
                <Text style={styles.closeButtonText}>Send</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#131224",
    flex: 1,
    padding: 16,
  },
  sideBySideContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sideCard: {
    backgroundColor: "#282844",
    borderRadius: 8,
    padding: 16,
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
  },
  cardImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 16,
  },
  content: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  buttonTouch: {
    borderWidth: 1,
    borderColor: "#6200ea",
    borderRadius: 20,
    textAlign: "center",
    padding: 10,
    width: 150,
  },
  buttonTouch2: {
    borderWidth: 1,
    borderColor: "#6200ea",
    borderRadius: 20,
    textAlign: "center",
    marginLeft: 10,
    padding: 10,
  },
  playButton: {
    marginTop: 10,
  },
  modalView: {
    backgroundColor: "#282844",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    width: "80%",
    padding: 10,
    borderColor: "#6200ea",
    borderWidth: 1,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: "#6200ea",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default GiftPaymentPage;
