/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Settings() {
  const [models, setModels] = React.useState([]);
  const [currentModel, setCurrentModel] = React.useState({
    baseModel: 'Llama',
    id: 14,
    name: 'Llama 2',
    version: '7b-chat-fp16',
  });

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
    ToastAndroid.show('Saved Model!', ToastAndroid.LONG);
  };

  const loadModel = async () => {
    const model = await AsyncStorage.getItem('model');
    if (model) {
      setCurrentModel(JSON.parse(model));
    }
  };

  React.useEffect(() => {
    loadModel();
    getModels().then((data) => setModels(data));
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: '#1b1a1b' }} className="h-full bg-[#1b1a1b]">
      <View className="h-full w-full flex-col gap-4 px-3">
        <View>
          <Text className="text-4xl font-extrabold text-white">Select a model</Text>
          <Text className="text-lg font-bold text-white">Choose a model to chat with</Text>
        </View>
        <SelectDropdown
          data={models}
          defaultValue={currentModel}
          onSelect={(selectedItem, index) => {
            saveModel(selectedItem);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View className="h-[40px] w-[100px] flex-row items-center justify-between rounded-lg border border-white/50 bg-[#1b1a1b] p-3">
                <Text style={styles.dropdownButtonText}>
                  {(selectedItem && selectedItem.name) || currentModel.name}
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
        <Text className="text-sm font-bold text-red-500">
          *Note: Some models may not work as expected
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#1b1a1b',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  dropdownButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  dropdownButtonIcon: {
    fontSize: 24,
    color: 'white',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 200,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#1b1a1b',
    marginVertical: 5,
  },
  dropdownItemSelected: {
    backgroundColor: 'black',
  },
  dropdownItemText: {
    fontSize: 18,
    color: 'white',
  },
  dropdownMenu: {
    backgroundColor: '#1b1a1b',
    borderRadius: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
