import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens 
import WelcomeScreen from './src/screens/WelcomeScreen';
import MapScreen from './src/screens/MapScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('WelcomeScreen');

  // hook -verify login credentials
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user_username');
        
        // If a valid username is found, bypass the onboarding screen configuration
        if (user !== null) {
          setInitialRoute('MapScreen');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  // Condition 1: If the app is still querying local device storage, display a loading screen
  if (isLoading) {
    return (
      // Centers a native spinning wheel loader directly in the middle of the display
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0A2540" />
      </View>
    );
  }

  // Condition 2: Once storage validation resolves, boot up the navigation container architecture
  return (
    <NavigationContainer>
      {}
      <Stack.Navigator initialRouteName={initialRoute}>
        
        {/*Welcome screen*/}
        <Stack.Screen 
          name="WelcomeScreen" 
          component={WelcomeScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* Screen 2 Map Screen */}
        <Stack.Screen 
          name="MapScreen" 
          component={MapScreen} 
          options={{ title: 'Developer Community' }} 
        />
        
        {/* Screen 3 GitHub profiles */}
        <Stack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
          // Dynamically sets the top window header bar title using the username routing payload parameter
          options={({ route }) => ({ title: `${route.params.username}'s Profile` })} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}