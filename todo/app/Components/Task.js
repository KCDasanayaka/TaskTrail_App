import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

const Task = (props) => {
    return (
      <View style={styles.task}>
        <View style={styles.taskLeft}>
          <View style={styles.square}></View>
          {/* Ensure that task text is wrapped in <Text> */}
          <Text style={styles.text}>{props.text}</Text>
        </View>
        <View style={styles.circle}></View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    task: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 2, // Adds shadow for Android
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    circle: {
      width: 12,
      height: 12,
      borderColor: '#55bcf6',
      borderWidth: 2,
      borderRadius: 5,
    },
    taskLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    square: {
      width: 24,
      height: 24,
      backgroundColor: '#55bcf6',
      opacity: 0.4,
      borderRadius: 5,
      marginRight: 15,
    },
    text: {
      maxWidth: '80%',
    },
  });
  
  export default Task;