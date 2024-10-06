import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const Task = (props) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [reminderTime, setReminderTime] = useState('');

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    setReminderTime(formattedTime);
    hideDatePicker();
  };

  return (
    <View style={styles.task}>
      <View style={styles.taskLeft}>
        <View style={styles.square}></View>
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
    padding:5,
  },
  closeBtn:{
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


