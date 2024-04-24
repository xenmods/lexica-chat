/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Settings() {
  const [models, setModels] = React.useState([]);

  const getModels = async () => {
    try {
      const response = await fetch('https://lexica.qewertyy.dev/models');
      const data = await response.json();
      const chatModels = data.models.chat;
      return chatModels;
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const saveModel = async (model) => {
    await AsyncStorage.setItem('model', JSON.stringify(model));
    console.log('Model saved:', model);
  };

  React.useEffect(() => {
    getModels().then((data) => setModels(data));
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: '#1b1a1b' }} className="h-full bg-[#1b1a1b]">
      <View>
        <SelectDropdown
          data={models}
          onSelect={(selectedItem, index) => {
            saveModel(selectedItem);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButton}>
                <Text style={styles.dropdownButtonText}>
                  {(selectedItem && selectedItem.name) || 'Select a model'}
                </Text>
                <Icon
                  name={isOpened ? 'chevron-up' : 'chevron-down'}
                  style={styles.dropdownButtonIcon}
                />
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={[styles.dropdownItem, isSelected && styles.dropdownItemSelected]}>
                <Text style={styles.dropdownItemText}>{item.name}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenu}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
  },
  dropdownButtonText: {
    color: '#fff',
  },
  dropdownButtonIcon: {
    color: '#fff',
    fontSize: 20,
  },
  dropdownMenu: {
    backgroundColor: '#1b1a1b',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  dropdownItemSelected: {
    backgroundColor: '#2e78b7',
  },
  dropdownItemText: {
    color: '#fff',
  },
});
