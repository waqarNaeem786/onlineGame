import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TopBar = () => {
  const navigation = useNavigation();
  const [balance, setBalance] = useState(0);
  const [nextPayout, setNextPayout] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = await AsyncStorage.getItem('AuthToken');
        const response = await axios.post('https://cashgames.website/api/me/balance', {}, {
          headers: { "Authorization": token }
        });
        if (response.data.status === 1) {
          setBalance(response.data.b);
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    };

    const fetchPayout = async () => {
      try {
        const token = await AsyncStorage.getItem('AuthToken');
        const response = await axios.post('https://cashgames.website/api/gift/get', {}, {
          headers: { "Authorization": token }
        });
        if (response.data.status === 1) {
          const payouts = response.data.cat.flatMap(cat => cat.items);
          const nextPayout = payouts.length > 0 ? payouts[0].points : 0;
          setNextPayout(nextPayout);
        }
      } catch (error) {
        console.error('Failed to fetch payout:', error);
      }
    };

    fetchBalance();
    fetchPayout();
  });

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: balance,
      duration: 30000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [balance]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, nextPayout],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.topBarContainer}>
        <View style={styles.coinAndTitleContainer}>
          <View style={styles.coinContainer}>
            <Text style={{ fontSize: 24, color: 'gold' }}>$</Text>
            <Text style={styles.coinText}>{balance}</Text>
          </View>
          <Text style={styles.title}>Let's start earning</Text>
        </View>
        <Ionicons onPress={() => navigation.navigate('Profile')} name="person-circle" size={30} color="white" />
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.backgroundBar}>
          <Animated.View style={[styles.animatedBar, { width: progressWidth }]}>
            <LinearGradient
              colors={['#FF00A6', '#FF9900']}
              start={[0, 0.5]}
              end={[1, 0.5]}
              style={styles.linearGradient}
            />
          </Animated.View>
        </View>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>{balance} / {nextPayout}</Text>
          <Text style={styles.payoutText}>Next Payout ${nextPayout}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#131224',
    padding: 16,
    paddingTop: 40,
  },
  topBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  coinAndTitleContainer: {
    flex: 1,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  coinText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  title: {
    color: 'white',
    fontSize: 16,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  backgroundBar: {
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1A1A2E', // Background color matching the theme
    overflow: 'hidden',
  },
  animatedBar: {
    height: '100%',
  },
  linearGradient: {
    flex: 1,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'left',
  },
  payoutText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'right',
  },
});

export default TopBar;
