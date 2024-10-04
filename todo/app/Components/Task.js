import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, TextInput } from 'react-native';

const Task = (props) => {
  const [showInput, setShowInput] = useState(false);  // State to show/hide text input
  const [time, setTime] = useState('');               // State to store the input time

  // Function to toggle the input field
  const toggleInput = () => {
    setShowInput(!showInput);
  };

  // Function to handle setting the alarm
  const setAlarm = () => {
    // Logic for setting the alarm (e.g., scheduling notification)
    console.log('Alarm set for:', time);
    // Hide the input field after setting the alarm
    setShowInput(false);
  };

  return (
    <View style={styles.task}>
      <View style={styles.taskLeft}>
        <View style={styles.square}></View>
        <Text style={styles.text}>{props.text}</Text>
      </View>

      <View style={styles.taskRight}>
        {/* TouchableOpacity to handle image click */}
        <TouchableOpacity onPress={toggleInput}>
          <View style={styles.notify}>
            <Image
              source={require('../../assets/images/notify.png')}
              style={styles.notifyImg}
            />
          </View>
        </TouchableOpacity>

        {/* Conditionally render the input field */}
        {showInput && (
          <TextInput
            style={styles.input}
            placeholder="Set time (e.g., 10:00 AM)"
            value={time}
            onChangeText={(text) => setTime(text)}
            onSubmitEditing={setAlarm} // When user submits, set the alarm
          />
        )}
      </View>
      <Image
              source={require('../../assets/images/delete.png')}
              style={styles.notifyImg}
            />
    </View>
  );
};

const styles = StyleSheet.create({
  task: {
    backgroundColor: '#fff',
    padding: 10,
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
    fontWeight: '600',
  },
  taskRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notify: {
    marginRight: 5,
    width: 22,
    height: 22,
    borderColor: '#c0c0c0',
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifyImg: {
    width: 20,
    height: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c0c0c0',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10, // Adds space between the image and input
    width: 100,
  },
});

export default Task;
