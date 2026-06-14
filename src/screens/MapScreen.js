import React, { useState, useRef } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Pressable } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

//MOCK DATA - In Downtown Calgary
const MOCK_USERS = [
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

export default function MapScreen({ navigation }) {
  
  //LOGOUT LOGIC
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user_username');
      navigation.reset({ index: 0, routes: [{ name: 'WelcomeScreen' }] });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const mapRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const showTooltip = async (user) => {
    if (!mapRef.current) return;

    const point = await mapRef.current.pointForCoordinate({
      latitude: user.latitude,
      longitude: user.longitude,
    });

    setTooltip({
      user,
      x: point.x,
      y: point.y,
    });
  };

  const hideTooltip = () => setTooltip(null);

  return (
    //Fixed Camera on Calgary Tower
    <View style={styles.container}>
      {}
      <MapView provider={PROVIDER_GOOGLE}
        ref={mapRef}
        onPress={hideTooltip}
        style={styles.map}
        initialRegion={{
          latitude: 51.0443,     
          longitude: -114.0631,    
          latitudeDelta: 0.012, 
          longitudeDelta: 0.012,
        }}
      >
        {MOCK_USERS.map(user => (
          <Marker 
            key={user.id} 
            coordinate={{ latitude: user.latitude, longitude: user.longitude }}
            onPress={() => showTooltip(user)}
          >

            <View style={styles.markerWrapper}>
              <View style={styles.avatarMarker}>
                <Image 
                  source={{ uri: user.avatar }} 
                  style={styles.avatarImage} 
                  resizeMode="cover"
                />
              </View>
            </View> 
          </Marker>
        ))}
      </MapView>
      {tooltip && (
        <Pressable
          onPress={() =>
            navigation.navigate('ProfileScreen', {
              username: tooltip.user.username,
            })
          }
          style={{
            position: 'absolute',
            left: tooltip.x - 75,
            top: tooltip.y - 90,
            width: 100,
            backgroundColor: '#25ebb3',
            padding: 5,
            borderRadius: 10,
            zIndex: 9999,
            elevation: 10,
          }}
        >
          <Text style={{ color: 'black', fontWeight: 'bold' }}>
            {tooltip.user.name}
          </Text>
          <Text style={{ color: '#000000', marginTop: 4, textDecorationLine: 'underline' }}>
            View GitHub
          </Text>
        </Pressable>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

//Stylesheet 

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  map: { 
    flex: 1 
  },
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMarker: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    borderWidth: 2, 
    borderColor: '#ed1919', 
    overflow: 'hidden', 
    backgroundColor: '#cccccc',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5
  },
  avatarImage: { 
    width: '100%', 
    height: '100%',
    borderRadius: 25
  },
  logoutButton: { 
    position: 'absolute', 
    top: 50, 
    right: 20, 
    backgroundColor: '#0A2540', 
    paddingVertical: 8,
    paddingHorizontal: 16, 
    borderRadius: 6,
    zIndex: 10 
  },
  logoutText: { 
    color: '#ffffff', 
    fontSize: 12, 
    fontWeight: 'bold' 
  }
});