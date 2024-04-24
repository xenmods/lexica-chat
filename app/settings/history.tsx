/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Settings() {
  const [currentSetting, setCurrentSetting] = React.useState(false);

  const loadSetting = async () => {
    const setting = await AsyncStorage.getItem('save_history');
    if (setting) {
      console.log('Setting:', setting);
      setCurrentSetting(JSON.parse(setting));
    }
  };

  const saveSetting = async (setting) => {
    await AsyncStorage.setItem('save_history', JSON.stringify(setting));
    console.log('Setting saved:', setting);
    setCurrentSetting(setting);
  };

  React.useEffect(() => {
    loadSetting();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: '#1b1a1b' }} className="h-full bg-[#1b1a1b]">
      <View className="h-full w-full flex-col gap-4 px-3">
        <View>
          <Text className="text-4xl font-extrabold text-white">Chat History</Text>
          <Text className="text-lg font-bold text-white">Save chat history on this device</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-white">Save chat history</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#fff' }}
            thumbColor={currentSetting ? '#22C55E' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => saveSetting(value)}
            value={currentSetting}
          />
        </View>
        {/* a clear chat history button with red text */}
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.removeItem('messages');
            ToastAndroid.show('Chat history cleared', ToastAndroid.LONG);
          }}
          className="flex-row items-center gap-3">
          <Icon name="trash-can-outline" size={20} color="red" />
          <Text className=" text-lg font-bold text-red-500">Clear chat history</Text>
        </TouchableOpacity>
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
