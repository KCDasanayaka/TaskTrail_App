import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import Task from '../Components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  // Load tasks from AsyncStorage when the component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('tasks');
      if (storedItems) {
        const tasks = JSON.parse(storedItems);
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const todayTasks = tasks[today] || []; // Get tasks for today
        setTaskItems(todayTasks);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  // Function to add a task to the taskItems array
  const handleAddTask = async () => {
    if (task.trim()) {
      Keyboard.dismiss();
      const newTask = { text: task, isImportant: false };
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      // Update the tasks in AsyncStorage
      const storedItems = await AsyncStorage.getItem('tasks');
      const tasks = storedItems ? JSON.parse(storedItems) : {};
      if (!tasks[today]) {
        tasks[today] = [];
      }
      tasks[today].push(newTask);
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks)); // Save updated tasks

      setTaskItems([...taskItems, newTask]); // Update the local state
      setTask(''); // Clear input field
    }
  };

  // Function to remove a task
  const completeTask = async (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1); // Remove task at specific index

    const today = new Date().toISOString().split('T')[0]; // Get today's date
    const storedItems = await AsyncStorage.getItem('tasks');
    const tasks = storedItems ? JSON.parse(storedItems) : {};
    tasks[today] = itemsCopy; // Update today's tasks
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks)); // Save updated tasks

    setTaskItems(itemsCopy); // Update local state
  };

  // Sort tasks by importance (important tasks will appear at the top)
  const sortedTaskItems = [...taskItems].sort((a, b) => b.isImportant - a.isImportant);

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Image source={require('../../assets/images/to-do.png')} style={styles.image} />
        <Text style={styles.headText}>ToDo</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eaed',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 45,
    width: '100%',
    gap: 10,
  },
  image: {
    width: 30,
    height: 30,
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
