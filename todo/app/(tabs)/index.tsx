import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Tasks from './Components/Task';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.taskWrapper}> {/* Corrected style name */}
        <Text style={styles.sectionTitle}> {/* Corrected style name */}
          Today's tasks
        </Text>
        <View style={styles.items}>
          {/* Task items will go here */}
          <Tasks/>
          <Tasks/>
          <Tasks/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eaed',
  },
  taskWrapper: {  // Corrected the name
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {  // Corrected the name
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    // Add styles here for your items if needed
  },
});
