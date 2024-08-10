import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tapjoy } from "react-native-tapjoy";

const tapjoyOptions = {
  sdkKeyAndroid: "", // Will be set dynamically
  gcmSenderIdAndroid: "",
  debug: true,
};

const OffersCompaniesPage = ({ navigation }) => {
  const [offers, setOffers] = useState([]);
  const [apiToken, setApiToken] = useState("");
  const [apikey, setApiKey] = useState("");
  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const res = await axios.get(
          "https://ipinfo.io/json?token=285fe0806df8ea",
        );
        return res.data.country;
      } catch (error) {
        console.error("Error fetching country code:", error);
        throw new Error("Failed to fetch country code");
      }
    };

    const fetchAuthToken = async () => {
      try {
        const authToken = await AsyncStorage.getItem("AuthToken");
        if (!authToken) {
          console.error("AuthToken not found in AsyncStorage.");
          Alert.alert("Error", "AuthToken not found. Please log in again.");
          throw new Error("AuthToken not found");
        }
        return authToken;
      } catch (error) {
        console.error("Error fetching AuthToken:", error);
        throw new Error("Failed to fetch AuthToken");
      }
    };

    const fetchOffers = async (countryCode, authToken) => {
      try {
        const response = await axios.post(
          "https://cashgames.website/api/connect",
          { cc: countryCode },
          {
            headers: {
              Authorization: authToken,
            },
          },
        );
        if (response.data && response.data.data) {
          const responseData = JSON.parse(response.data.data);
          if (responseData.offers) {
            const allOffers = [
              ...responseData.offers.offerwall_sdk,
              ...responseData.offers.offerwall_cpa,
              ...responseData.offers.offerwall_cpv,
              ...responseData.offers.offerwall_web,
            ].filter((offer) => offer.name);

            setOffers(allOffers);
          } else {
            console.log("No offers found in the response.");
          }
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
        throw new Error("Failed to fetch offers");
      }
    };

    const fetchApiToken = async () => {
      try {
        const apiKey = await AsyncStorage.getItem("ApiToken");
        if (apiKey) {
          // console.log("API token:", apiKey);
          setApiToken(apiKey);
        } else {
          console.log("API token not found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error fetching API token:", error);
        throw new Error("Failed to fetch API token");
      }
    };

    const fetchData = async () => {
      try {
        const countryCode = await fetchCountryCode();
        const authToken = await fetchAuthToken();
        await fetchOffers(countryCode, authToken);
        await fetchApiToken();
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    fetchData();

    const initialiseTapjoy = async (sdkKey) => {
      try {
        console.log(sdkKey);
      } catch (error) {
        console.error("Error initializing Tapjoy:", error);
      }
    };

    const initialiseTapjoyWithOfferData = async () => {
      try {
        const countryCode = await fetchCountryCode();
        const authToken = await fetchAuthToken();
        const response = await axios.post(
          "https://cashgames.website/api/connect",
          { cc: countryCode },
          {
            headers: {
              Authorization: authToken,
            },
          },
        );

        const responseData = JSON.parse(response.data.data);
        // console.log(responseData);
        const offerData = responseData.offers.offerwall_sdk.find(
          (offer) => offer.name === "tapjoy",
        );
        // console.log(offerData);
        if (offerData) {
          const offerDataSdk = JSON.parse(offerData.data);
          // console.log(offerDataSdk[0].value);
          const sdkKey = offerDataSdk[0].value;
          // console.log(sdkKey);
          await initialiseTapjoy(offerDataSdk);
        }
      } catch (error) {
        console.error("Error fetching Tapjoy offer data:", error);
      }
    };

    initialiseTapjoyWithOfferData();
  }, []);

  const handlePlayButtonPress = (offer) => {
    if (offer.data.includes("http")) {
      const url = offer.data.replace("[app_uid]@@@-", apiToken);
      console.log("Opening URL:", url);
      Linking.openURL(url).catch((err) =>
        console.error("An error occurred", err),
      );
    } else {
      const placementName = JSON.parse(offer.data);
      console.log(placementName[0].value);
      // and here is the placement name
      const placement = new Tapjoy.TJPlacement(placementName[0].value);
      placement.requestContent();
      placement.on(Tapjoy.TJPlacement.CONTENT_IS_READY, () => {
        placement.showContent();
      });
      placement.on(Tapjoy.TJPlacement.CONTENT_DID_DISMISS, () => {
        console.log("Content dismissed");
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <LinearGradient
        colors={["#9C27B0", "#673AB7"]}
        style={styles.fullWidthCard}
      >
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.MainCardImage}
        />
        <View style={styles.MainCardContent}>
          <Text style={styles.earningsText}>Earnings up to</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="cash-outline" size={24} color="gold" />
            <Text style={styles.priceText}> $1000</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => alert("Play button pressed")}
        >
          <Ionicons
            name="play-circle"
            size={24}
            color="white"
            style={styles.playIcon}
          />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.offersContainer}>
        {offers.map((offer, index) => (
          <LinearGradient
            key={index}
            colors={["#9C27B0", "#673AB7"]}
            style={styles.sideCard}
          >
            <Image
              source={{ uri: offer.network_image }}
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.earningsText}>{offer.title}</Text>
              <Text style={styles.priceText}>{offer.description}</Text>
            </View>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => handlePlayButtonPress(offer)}
            >
              <Ionicons
                name="play-circle"
                size={24}
                color="white"
                style={styles.playIcon}
              />
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
          </LinearGradient>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#131224",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  fullWidthCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  offersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sideCard: {
    borderRadius: 8,
    padding: 16,
    width: "48%",
    marginBottom: 16,
    alignItems: "center",
  },
  cardImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  MainCardImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardContent: {
    alignItems: "center",
    marginBottom: 16,
  },
  MainCardContent: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  earningsText: {
    fontSize: 16,
    color: "white",
  },
  priceText: {
    fontSize: 16,
    color: "whitesmoke",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7A600",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: "100%",
    justifyContent: "center",
  },
  playIcon: {
    marginRight: 8,
  },
  playButtonText: {
    fontSize: 16,
    color: "white",
  },
});

export default OffersCompaniesPage;
