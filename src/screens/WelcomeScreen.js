import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import MapView from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyGitHubUser } from '../services/githubApi';

export default function WelcomeScreen({ navigation }) {
  const [username, setUsername] = useState('');

  const handleSignUp = async () => {
    //check: Alert if user clicks button with an empty input field
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a GitHub username");
      return;
    }

    //Network Check: Verify via the public API service file
    const result = await verifyGitHubUser(username.trim());
    
    if (result.success) {
      // If valid, save session locally so they bypass this screen next boot
      await AsyncStorage.setItem('user_username', username.trim());
      // Navigate forward and clear history stack
      navigation.reset({ index: 0, routes: [{ name: 'MapScreen' }] });
    } else {
      //Invalid Check: Triggers the exact text alert popup shown in your screenshot
      Alert.alert("Error", "There is no such username on GitHub.");
    }
  };

  return (
    <View style={styles.container}>
      {}
      <MapView 
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 51.0443,     // Centered on downtown Calgary / Calgary Tower core
          longitude: -114.0631,
          latitudeDelta: 0.03,   
          longitudeDelta: 0.03,
        }}
      />
      
      {}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Insert your GitHub username"
          placeholderTextColor="#7a7a7a"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-end' 
  },
  formContainer: { 
    padding: 24, 
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: 16, 
    borderTopRightRadius: 16,
    paddingBottom: 40 
  },
  input: { 
    backgroundColor: 'rgba(220, 220, 220, 0.9)',
    padding: 16, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: '#b5b5b5', 
    marginBottom: 16,
    fontSize: 16,
    color: '#333'
  },
  button: { 
    backgroundColor: '#0A2540', 
    padding: 16, 
    borderRadius: 6, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#ffffff', 
    fontWeight: '600',
    fontSize: 16
  }
});