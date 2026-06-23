import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, Keyboard } from 'react-native';
import MapView from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyGitHubUser } from '../services/githubApi';

//MOCK DATA - In Downtown Calgary
var users = [
  { 
    id: '1', 
    username: 'SajalGokani',                   
    name: 'Sajal Gokani',                      
    avatar: 'https://avatars.githubusercontent.com/u/228764650?v=4&s=400', 
    latitude: 51.0464, // My avatar- At Bow Valley College 
    longitude: -114.0624 
  },
  { 
    id: '2', 
    username: 'torvalds',                      
    name: 'Linus Torvalds', 
    avatar: 'https://github.com/torvalds.png', 
    latitude: 51.0445, 
    longitude: -114.0650 
  },
  {
    id: '3',
    username: 'gaearon', 
    name: 'Dan Abramov',
    avatar: 'https://github.com/gaearon.png',
    latitude: 51.0428, 
    longitude: -114.0615
  },
  {
    id: '4',
    username: 'yyx990803', 
    name: 'Evan You',
    avatar: 'https://github.com/yyx990803.png',
    latitude: 51.0448, 
    longitude: -114.06
  }
];

function generateNearbyLocation(lat, lng, maxOffset = 0.005) {
  return {
    latitude: lat + (Math.random() - 0.5) * 2 * maxOffset,
    longitude: lng + (Math.random() - 0.5) * 2 * maxOffset,
  };
}

//Set use state for Keyboard hight
export default function WelcomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );

//Keyboard listener
    const hideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const handleSignUp = async () => {
    //check: Alert if user clicks button with an empty input field
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a GitHub username");
      return;
    }

    //Network Check: Verify via the public API service file
    const result = await verifyGitHubUser(username.trim());
    
    //If login is successful populate the logib GitHub ID on the map
    if (result.success) {
      var data = result.data;
      var location = generateNearbyLocation(51.0443, -114.0631)
      users.push({
        id: data.id,
        username: data.login,
        name: data.login,
        avatar: data.avatar_url,
        latitude: location.latitude,
        longitude: location.longitude
      });

      navigation.navigate('MapScreen', {
              users: users,
            })
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
      <View
        style={[
          styles.formContainer,
          {
            bottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20,
          },
        ]}
      >
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
    paddingBottom: 40,
    position: 'absolute',
    left: 20,
    right: 20
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