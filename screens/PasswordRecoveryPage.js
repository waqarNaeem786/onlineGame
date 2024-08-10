import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const PasswordRecoveryPage = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordRecovery = () => {
    // Perform validation if needed

    // Make API call to send recovery email
    axios.post('https://spectro-coins.site/forget', { email })
      .then(response => {
        // Handle success response, such as showing a success message
        Alert.alert('Password Recovery', 'Recovery email sent successfully.');
        // Navigate to appropriate screen after success
        navigation.goBack(); // Example: navigate to previous screen
      })
      .catch(error => {
        // Handle error response, such as showing an error message
        Alert.alert('Error', 'Failed to send recovery email. Please try again later.');
        console.error('Password recovery error:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Recovery</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="email"
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordRecovery}>
        <Text style={styles.buttonText}>Send Recovery Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#131224',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: 'white',
  },
  input: {
    height: 50,
    borderColor: '#6200ea',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 16,
    borderRadius: 8,
    color: 'white',
    backgroundColor: '#3d0066',
  },
  button: {
    backgroundColor: '#6A5DA5',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default PasswordRecoveryPage;
