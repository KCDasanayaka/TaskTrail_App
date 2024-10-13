import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Task from '../Components/Task';


export default function HomeScreen() {
  const [taskItems, setTaskItems] = useState([]);
  const [task, setTask] = useState('');

  // Load today's tasks from AsyncStorage
  useEffect(() => {
    loadTasksForToday(); // Load tasks when the component mounts
  }, []);

  const loadTasksForToday = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('tasks');
      if (storedItems) {
        const tasks = JSON.parse(storedItems);
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const todayTasks = tasks[today] || []; // Get today's tasks
        setTaskItems(todayTasks); // Update state with today's tasks
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  // Function to add a task to the taskItems array for today
  const handleAddTask = async () => {
    if (task.trim()) {
      Keyboard.dismiss();
      const newTask = { text: task, isImportant: false };

      const today = new Date().toISOString().split('T')[0]; // Get today's date
      const updatedItems = [...taskItems, newTask]; // Add new task
      setTaskItems(updatedItems); // Update state with new task

      // Save tasks to AsyncStorage
      try {
        const storedItems = await AsyncStorage.getItem('tasks');
        const tasks = storedItems ? JSON.parse(storedItems) : {};
        tasks[today] = updatedItems; // Update today's tasks in storage
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks)); // Save updated tasks
      } catch (error) {
        console.error('Failed to save tasks:', error);
      }

      setTask(''); // Clear input field
    }
  };

  // Function to toggle priority for a task
  const toggleImportant = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy[index].isImportant = !itemsCopy[index].isImportant;
    setTaskItems(itemsCopy);
  };

  // Function to remove a task
  const completeTask = async (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1); // Remove task at specific index
    setTaskItems(itemsCopy);

    // Update AsyncStorage after removing a task
    try {
      const today = new Date().toISOString().split('T')[0]; // Get today's date
      const storedItems = await AsyncStorage.getItem('tasks');
      const tasks = storedItems ? JSON.parse(storedItems) : {};
      tasks[today] = itemsCopy; // Update today's tasks in storage
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks)); // Save updated tasks
    } catch (error) {
      console.error('Failed to update tasks:', error);
    }
  };

  // Sort tasks by importance (important tasks will appear at the top)
  const sortedTaskItems = [...taskItems].sort((a, b) => b.isImportant - a.isImportant);

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/clipboard.png')} style={styles.image} />
        </View>
        
        <Text style={styles.headText}>MyReminder</Text>
      </View>
      <View style={styles.taskWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>
        <View style={styles.items}>
          {sortedTaskItems.map((item, index) => (
            <TouchableOpacity key={index}>
              <Task
                text={item.text}
                isImportant={item.isImportant}
                onToggleImportant={() => toggleImportant(index)}
                onDelete={() => completeTask(index)}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.writeTaskWrapper}>
        <TextInput
          style={styles.input}
          placeholder={'Write a task'}
          value={task}
          onChangeText={text => setTask(text)}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
            <Image source={require('../../assets/images/add.png')} style={styles.btnImg} />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

// Add your styles here...


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eaed',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 45,
    width: '100%',
    gap: 10,
  },
  logoContainer:{
    padding:5,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode:'cover'
  },
  headText: {
    fontSize: 28,
    fontWeight: '700',
    margin: 0,
  },
  taskWrapper: {
    paddingTop: 60,
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
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 60,
    borderColor: '#c0c0c0',
    borderWidth: 1,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#c0c0c0',
    borderWidth: 1,
  },
  btnImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
