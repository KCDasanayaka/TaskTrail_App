import React from 'react';
import { StyleSheet, View, Image } from "react-native";
import logo from '../../assets/images/MyReminder.png'

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View>
        <Image source={logo} style={styles.image}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  // You likely meant 'justifyContent'
    alignItems: 'center',       // To center items horizontally
    backgroundColor: '#f0f0f0', // Optional background color
  },
  image:{
    width:251.7,
    height:42.6,
    resizeMode:'cover',

  }

});
