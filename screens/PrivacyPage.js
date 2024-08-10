import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PrivacyPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.content}>
        [Your privacy policy content goes here.]
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
  },
});

export default PrivacyPage;