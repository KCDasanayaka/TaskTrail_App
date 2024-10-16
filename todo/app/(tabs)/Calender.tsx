import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler'; // Import necessary components

export default function Calendars() {
  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    loadTasks(); // Load tasks when the component mounts
  }, []);

  useEffect(() => {
    saveTasks(); // Save tasks whenever items change
  }, [items]);

  const loadTasks = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('tasks');
      if (storedItems) {
        setItems(JSON.parse(storedItems)); // Load tasks from AsyncStorage
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(items)); // Save tasks to AsyncStorage
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  const handleAddTask = () => {
    if (!taskTitle.trim() || !taskDescription.trim() || !selectedDate || !reminderTime) return;

    const newTask = {
      id: Math.random().toString(), // Add an ID for identifying each task
      name: taskTitle,
      description: taskDescription,
      reminderTime: reminderTime,
    };

    const updatedItems = { ...items };
    if (updatedItems[selectedDate]) {
      updatedItems[selectedDate].push(newTask); // Add to existing tasks
    } else {
      updatedItems[selectedDate] = [newTask]; // Create a new entry for the date
    }

    setItems(updatedItems); // Update state
    setTaskTitle(''); // Reset task title
    setTaskDescription(''); // Reset task description
    setReminderTime(''); // Reset reminder time
    Keyboard.dismiss(); // Dismiss keyboard
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = async (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    setReminderTime(formattedTime);
    hideDatePicker();

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const permissionResponse = await Notifications.requestPermissionsAsync();
      if (permissionResponse.status !== 'granted') {
        alert('Permission to send notifications is required!');
        return;
      }
    }

    scheduleNotification(date);
  };

  const scheduleNotification = async (date) => {
    const trigger = date.getTime() / 1000; // Convert to seconds
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: `Task: "${taskTitle}" is due soon!`,
      },
      trigger: {
        seconds: trigger - Math.floor(Date.now() / 1000),
      },
    });
    console.log('Notification scheduled for', reminderTime);
  };

  const handleDeleteTask = (taskId) => {
    const updatedItems = { ...items };
    if (updatedItems[selectedDate]) {
      updatedItems[selectedDate] = updatedItems[selectedDate].filter(task => task.id !== taskId);
      if (updatedItems[selectedDate].length === 0) {
        delete updatedItems[selectedDate]; // Remove the date if no tasks remain
      }
      setItems(updatedItems); // Update the state
    }
  };

  const TaskItem = ({ item }) => {
    const renderRightActions = () => {
      return (
        <View style={styles.deleteButtonContainer}>
          <Text style={styles.deleteText}>Delete</Text>
        </View>
      );
    };

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        onSwipeableRightOpen={() => handleDeleteTask(item.id)} // Delete task when swiped
        overshootRight={false}
      >
        <TouchableOpacity style={styles.item}>
          <View style={styles.taskContainer}>
            <View style={styles.taskContent}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
            <Text style={styles.reminderTimeText}>{item.reminderTime}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topBox}>
          <View style={styles.head}>
            <Image source={require('../../assets/images/MyReminder.png')} style={styles.image} />
          </View>
        </View>
        <Agenda
          items={items}
          selected={selectedDate}
          onDayPress={(day) => {
            setSelectedDate(day.dateString); // Update selected date
            setTaskTitle(''); // Reset task fields
            setTaskDescription('');
            Keyboard.dismiss();
          }}
          renderItem={(item) => <TaskItem item={item} />}
          renderEmptyData={() => {
            if (selectedDate) {
              return <Text style={styles.noTasksText}>No tasks for this date.</Text>;
            }
            return null;
          }}
        />

        {selectedDate && (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.writeTaskWrapper}>
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
              <View style={styles.calRight}>
                <View style={styles.taskRight}>
                  <TouchableOpacity onPress={showDatePicker}>
                    <View style={styles.notify}>
                      <Image source={require('../../assets/images/Bell-Notification.png')} style={styles.notifyImg} />
                    </View>
                  </TouchableOpacity>
                  {reminderTime ? <Text style={styles.reminderText}>{reminderTime}</Text> : null}
                </View>
                <TouchableOpacity onPress={handleAddTask}>
                  <View style={styles.addWrapper}>
                    <Image source={require('../../assets/images/add.png')} style={styles.btnImg} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}

        <DateTimePickerModal isVisible={isDatePickerVisible} mode="time" onConfirm={handleConfirm} onCancel={hideDatePicker} is24Hour={false} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 5,
  },
  deleteButtonContainer: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    marginTop: 25,
    borderRadius: 5,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: 'lightblue',
    marginHorizontal: 10,
    padding: 10,
    marginTop: 25,
    borderRadius: 5,
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
    width: 167.8,
    height: 28.4,
    marginRight: 10,
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
  calRight: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
  },
  addWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  calInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  taskRight: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  notify: {
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderColor: '#000',
    borderWidth: 3,
  },
  notifyImg: {
    width: 17,
    height: 17,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff0000',
    textAlign: 'right',
  },
  reminderText: {
    fontSize: 10,
  },
});
