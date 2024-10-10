import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function Calendars() {
  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  // Load tasks from AsyncStorage when the app starts
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage when items are updated
  useEffect(() => {
    saveTasks();
  }, [items]);

  // Function to load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('tasks');
      if (storedItems) {
        setItems(JSON.parse(storedItems)); // Parse and set saved items
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  // Function to save tasks to AsyncStorage
  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(items)); // Save items as a JSON string
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  // Function to handle adding a task to the selected date
  const handleAddTask = () => {
    if (!taskTitle.trim() || !taskDescription.trim() || !selectedDate) return;

    const newTask = { name: taskTitle, data: taskDescription };

    const updatedItems = { ...items };
    if (updatedItems[selectedDate]) {
      updatedItems[selectedDate].push(newTask); // Add to existing date
    } else {
      updatedItems[selectedDate] = [newTask]; // Create a new entry for the date
    }

    setItems(updatedItems); // Update the state with the new task
    setTaskTitle(''); // Reset the title input field
    setTaskDescription(''); // Reset the description input field
    Keyboard.dismiss(); // Dismiss the keyboard after adding the task
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBox}>
        <View style={styles.head}>
          <Image
            source={require('../../assets/images/to-do.png')} // Path to your image file
            style={styles.image}
          />
          <Text style={styles.headText}>ToDo</Text>
        </View>
      </View>
      <Agenda
        items={items}
        selected={selectedDate} // Use selectedDate for initial selection
        onDayPress={(day) => {
          setSelectedDate(day.dateString); // Track selected date when a day is pressed
          setTaskTitle(''); // Clear input fields when selecting a new date
          setTaskDescription('');
          Keyboard.dismiss(); // Dismiss the keyboard when a new date is selected
        }}
        renderItem={(item) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.data}</Text>
          </TouchableOpacity>
        )}
        renderEmptyData={() => {
          if (selectedDate) {
            return <Text style={styles.noTasksText}>No tasks for this date.</Text>;
          }
          return null;
        }}
      />

      {selectedDate && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.writeTaskWrapper}
        >
          <View style={styles.calInput}>
            <View style={styles.calLeft}>
              <TextInput
                style={styles.input}
                placeholder={'Enter Task Title'}
                value={taskTitle}
                onChangeText={text => setTaskTitle(text)}
              />
              <TextInput
                style={styles.input}
                placeholder={'Enter Task Description'}
                value={taskDescription}
                onChangeText={text => setTaskDescription(text)}
              />
            </View>
            <TouchableOpacity onPress={handleAddTask}>
              <View style={styles.addWrapper}>
                <Image
                  source={require('../../assets/images/add.png')}
                  style={styles.btnImg}
                />
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 5,
  },
  topBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: 'lightblue',
    marginHorizontal: 10,
    padding: 10,
    marginTop: 25,
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#888',
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginRight: 10,
  },
  addWrapper: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  calLeft: {
    flexDirection: 'column',
    width: 300,
    gap: 5,
  },
  btnImg: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  noTasksText: {
    textAlign: 'center',
    padding: 20,
    color: 'gray',
  },
});
