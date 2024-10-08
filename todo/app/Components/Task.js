import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';

const Task = (props) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [reminderTime, setReminderTime] = useState('');

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = async (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    setReminderTime(formattedTime);
    hideDatePicker();

    // Request notification permissions
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const permissionResponse = await Notifications.requestPermissionsAsync();
      if (permissionResponse.status !== 'granted') {
        alert('Permission to send notifications is required!');
        return;
      }
    }

    // Schedule the notification
    scheduleNotification(date);
  };

  const scheduleNotification = async (date) => {
    const trigger = date.getTime() / 1000; // Convert to seconds
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: `Task: "${props.text}" is due soon!`,
      },
      trigger: {
        seconds: trigger - Math.floor(Date.now() / 1000),
      },
    });
    console.log('Notification scheduled for', reminderTime);
  };

  return (
    <View style={styles.task}>
      <View style={styles.taskLeft}>
        <View style={styles.square}>
          <TouchableOpacity onPress={props.onToggleImportant}>
            <Image
              source={
                props.isImportant
                  ? require('../../assets/images/Important-fill.png')
                  : require('../../assets/images/Important.png')
              }
              style={styles.impo}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>{props.text}</Text>
      </View>
      <View style={styles.iconsBox}>
        <View style={styles.taskRight}>
          <TouchableOpacity onPress={showDatePicker}>
            <View style={styles.notify}>
              <Image
                source={require('../../assets/images/Bell-Notification.png')}
                style={styles.notifyImg}
              />
            </View>
          </TouchableOpacity>
          {reminderTime ? (
            <Text style={styles.reminderText}>{reminderTime}</Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={props.onDelete}>
          <View style={styles.closeBtn}>
            <Image
              source={require('../../assets/images/Delete-2.png')}
              style={styles.closeImg}
            />
          </View>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        is24Hour={false}
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
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  impo: {
    width: 20,
    height: 20,
  },
  text: {
    maxWidth: '80%',
    fontWeight: '600',
  },
  taskRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconsBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notify: {
    paddingVertical: 5,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 50,
  },
  notifyImg: {
    width: 17,
    height: 17,
    padding: 5,
  },
  closeBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 50,
  },
  closeImg: {
    width: 15,
    height: 15,
  },
  reminderText: {
    marginLeft: 5,
    marginRight: 10,
    fontSize: 14,
    color: '#555',
  },
});

export default Task;
