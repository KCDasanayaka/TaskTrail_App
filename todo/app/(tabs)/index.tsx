import * as Notifications from 'expo-notifications';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import Task from '../Components/Task';

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  // Create notification channel for Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('reminder-channel', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Listener to handle notifications when app is running
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received!', notification);
    });

    return () => subscription.remove(); // Cleanup on unmount
  }, []);

  const handleAddTask = () => {
    if (task.trim()) {
      Keyboard.dismiss();
      setTaskItems([...taskItems, task]);
      setTask('');
    }
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  };

  const scheduleNotification = async (taskText) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: `Task: "${taskText}" is due soon!`,
        sound: 'default',
      },
      trigger: {
        seconds: 5, // Fire after 5 seconds for testing purposes
        channelId: Platform.OS === 'android' ? 'reminder-channel' : undefined, // Assign channel for Android
      },
    });

    console.log('Notification scheduled');
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Image source={require('../../assets/images/to-do.png')} style={styles.image} />
        <Text style={styles.headText}>ToDo</Text>
      </View>
      <View style={styles.taskWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>
        <View style={styles.items}>
          {taskItems.map((item, index) => (
            <TouchableOpacity key={index}>
              <Task text={item} onDelete={() => completeTask(index)} />
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
        <TouchableOpacity onPress={() => {
          handleAddTask();
          if (task.trim()) {
            scheduleNotification(task);
          }
        }}>
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
