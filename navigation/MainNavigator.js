import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";
import LoginPage from "../screens/LoginPage";
import SubscriptionPage from "../screens/SubscriptionPage";
import PasswordRecoveryPage from "../screens/PasswordRecoveryPage";
import TermsPage from "../screens/TermsPage";
import PrivacyPage from "../screens/PrivacyPage";
import ProfilePage from "../screens/ProfilePage";
import GiftPaymentPage from "../screens/Rewards";
import ActivitiesTransactionsPage from "../screens/ActivitiesTransactionsPage";
import Home from "../screens/Home";
import TopBar from "../screens/TopBar";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabBarIcon = (props) => {
  return (
    <Ionicons
      name={props.name}
      size={props.size}
      color={props.focused ? "#003366" : "#003366"}
      style={styles.icon}
    />
  );
};

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let label;

        if (route.name === "Activity") {
          iconName = "time";
          label = "Activity";
        } else if (route.name === "Reward") {
          iconName = "gift";
          label = "Reward";
        } else if (route.name === "Profile") {
          iconName = "person-circle-outline";
          label = "Profile";
        } else if (route.name === "Home") {
          iconName = "home";
          label = "Home";
        }

        return (
          <View style={styles.tabItem}>
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? "#003366" : "#FFFFFF"}
            />
            <Text
              style={[styles.label, { color: focused ? "#003366" : "#FFFFFF" }]}
            >
              {label}
            </Text>
          </View>
        );
      },
      tabBarShowLabel: false,
      tabBarStyle: styles.tabBar,
      header: () => <TopBar />,
    })}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Activity" component={ActivitiesTransactionsPage} />
    <Tab.Screen name="Reward" component={GiftPaymentPage} />
    <Tab.Screen name="Profile" component={ProfilePage} />
  </Tab.Navigator>
);

const MainNavigator = () => (
  <Stack.Navigator initialRouteName="Splash">
    <Stack.Screen
      name="Login"
      component={LoginPage}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Subscription"
      component={SubscriptionPage}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="PasswordRecovery"
      component={PasswordRecoveryPage}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Terms" component={TermsPage} />
    <Stack.Screen name="Privacy" component={PrivacyPage} />
    <Stack.Screen
      name="MainTabs"
      component={MainTabNavigator}
      options={{ headerShown: false }}
    />
    {/* <Stack.Screen name="Home" component={OffersCompaniesPage} options={{ headerShown: false }} /> */}
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#F7A600",
    borderRadius: 30,
    // borderRightRadius: 30,
    height: 60,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    elevation: 0,
  },
  tabItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
  },
  icon: {
    marginBottom: -10,
  },
});

export default MainNavigator;
