
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview'; //Import embedded web browser 
export default function ProfileScreen({ route }) {
  
  const { username } = route.params;

  return (
    // Base container that stretches to fill the entire phone screen area
    <View style={styles.container}>
      
      {/* 
        Embedded web browser component that dynamically loads 
        the clicked developer's live GitHub profile URL template
      */}
      <WebView 
        source={{ uri: `https://github.com/${username}` }} 
        style={{ flex: 1 }} // Forces the web browser window to expand and fill the whole screen
      />
      
    </View>
  );
}

// Layout styles definition
const styles = StyleSheet.create({
  container: { 
    flex: 1 
  }
});