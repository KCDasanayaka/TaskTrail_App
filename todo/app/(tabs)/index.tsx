import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>
          Today's tasks 
        </Text>
        <View style={styles.items}>
           
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
  },
  title: {
    fontSize: 32, // Large text size
    fontWeight: 'bold',
    color: '#000000', // Black text color
  },
  taskWrapper:{

  },
  sectiomTitle:{

  },
  items:{
    
  }
});
