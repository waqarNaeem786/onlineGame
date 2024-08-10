import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ActivitiesTransactionsPage = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const token = await AsyncStorage.getItem('AuthToken');
      try {
        const res = await axios.post('https://cashgames.website/api/history/ref', {}, {
          headers: {
            'Authorization': `${token}`,
          },
        });
        if (res.data.status === 1) {
          setActivities(res.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchActivities();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Ionicons name="gift-outline" size={40} color="white" style={styles.icon} />
      <View style={styles.details}>
        <Text style={styles.network}>{item.network}</Text>
        <Text style={styles.points}>{item.points} points</Text>
        <Text style={styles.date}>{new Date(item.date * 1000).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activities and Transactions</Text>
      {activities.length > 0 ? (
        <FlatList
          data={activities}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.content}>No recent activities.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#131224',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#FFFFFF',
  },
  content: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  list: {
    paddingBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#1E1D3D',
    borderRadius: 8,
  },
  icon: {
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  network: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  points: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#AAAAAA',
  },
});

export default ActivitiesTransactionsPage;
