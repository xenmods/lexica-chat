/* eslint-disable prettier/prettier */
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

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
      <View className="h-full w-full flex-col bg-[#1b1a1b] px-5">
        <View className="gap-5">
          <View className="mb-5 flex-row items-center gap-3">
            <View className="h-12 w-12 rounded-full bg-white" />
            <Text className="text-xl font-extrabold text-white">Guest User</Text>
          </View>
          <View>
            <Text className="mb-5 text-sm font-bold text-white">Account</Text>
            <View className="w-full flex-col gap-4">
              <TouchableOpacity
                onPress={() => router.push('/settings/models')}
                className="flex-row items-center">
                <View>
                  <Icon name="brain" size={26} color="white" />
                </View>
                <View className="flex-col">
                  <Text className="ml-5 text-lg font-bold text-white">Model</Text>
                  <Text className="text-md ml-5 text-white">Select a model</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/settings/history')}
                className="flex-row items-center">
                <View>
                  <Icon name="history" size={26} color="white" />
                </View>
                <View className="flex-col">
                  <Text className="ml-5 text-lg font-bold text-white">History</Text>
                  <Text className="text-md ml-5 text-white">Save chat history</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text className="mb-5 text-sm font-bold text-white">About</Text>
            <View className="w-full flex-col gap-4">
              <TouchableOpacity
                onPress={() => router.push('https://telegram.dog/xendaddy')}
                className="flex-row items-center">
                <View>
                  <Icon name="help-circle-outline" size={26} color="white" />
                </View>
                <View className="flex-col">
                  <Text className="ml-5 text-lg font-bold text-white">Help</Text>
                  <Text className="text-md ml-5 text-white">Get Help</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('https://telegram.dog/xendaddy')}
                className="flex-row items-center">
                <View>
                  <Icon name="email-outline" size={26} color="white" />
                </View>
                <View className="flex-col">
                  <Text className="ml-5 text-lg font-bold text-white">Contact</Text>
                  <Text className="text-md ml-5 text-white">Contact the developer</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('https://lexica.qewertyy.dev/')}
                className="flex-row items-center">
                <View>
                  <Icon name="api" size={26} color="white" />
                </View>
                <View className="flex-col">
                  <Text className="ml-5 text-lg font-bold text-white">API Credits</Text>
                  <Text className="text-md ml-5 text-white">Built on top of Lexica API</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <StatusBar backgroundColor="#1b1a1b" style="light" />
    </SafeAreaView>
  );
}
