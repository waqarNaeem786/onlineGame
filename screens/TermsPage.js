import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TermsPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>
      <Text style={styles.content}>
        [Your terms and conditions content goes here.]
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
    
    export default TermsPage;
