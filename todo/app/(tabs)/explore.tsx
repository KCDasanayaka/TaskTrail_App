import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity, SafeAreaView } from 'react-native';
import {Agenda} from 'react-native-calendars';


export default function calendars() {
  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        items={{
          '2024-03-26': [{ name: 'Meeting 1', date: 'Event details...' }],
          '2024-03-28': [{ name: 'Meeting 2', date: 'Event details...' }],
          '2024-03-29': [{ name: 'Meeting 3', date: 'Event details...' }],
        }}
        selected={'2024-03-26'} // This will ensure the initial date is correct
        renderItem={(item, isFirst) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#888',
  },
});

