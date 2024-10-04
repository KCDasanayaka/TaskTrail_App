import React, { useState } from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, TextInput,Image } from 'react-native';
import Task from '../Components/Task';

export default function HomeScreen() {
  const [task, setTask] = useState(''); // Input field state
  const [taskItems, setTaskItems] = useState([]); // List of tasks

  // Function to add a task to the taskItems array
  const handleAddTask = () => {
    if (task.trim()) { // Check if task is not empty
      Keyboard.dismiss();
      setTaskItems([...taskItems, task]); // Add new task
      setTask(''); // Clear input field
    }
  };

  // Function to remove a task
  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  }

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Image
          source={require('../../assets/images/to-do.png')} // Path to your image file
          style={styles.image}
        />
        <Text style={styles.headText}>ToDo</Text>
      </View>
      <View style={styles.taskWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>
        <View style={styles.items}>
          {/* Dynamically render task items */}
          {taskItems.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => completeTask(index)}>
              <Task text={item} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder={'Write a task'}
          value={task}
          onChangeText={text => setTask(text)}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
          <Image
            source={require('../../assets/images/add.png')} // Path to your image file
            style={styles.btnImg}
          />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eaed',
  },
  head:{
    flexDirection:'row',
    alignItems:'flex-end',
    justifyContent:'center',
    marginTop:20,
    width:'100%',
    gap:10,
  },
  image: {
    width: 30,  // Set your desired width
    height: 30, // Set your desired height
  },
  headText:{
    fontSize:28,
    fontWeight:'700',
    margin:0,
  },
  taskWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 60,
    borderColor: '#c0c0c0',
    borderWidth: 1,
  },
  addWrapper: {
    width: 50,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#c0c0c0',
    borderWidth: 1,
  },
  btnImg:{
    width:40,
    height:40,
    borderRadius:50,
  },
  addText: {
    fontSize: 24,
    color: '#55BCF6',
  },
});
