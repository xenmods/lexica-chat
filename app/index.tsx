// import React from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
// import { Link, router } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { StatusBar } from 'expo-status-bar';

// import { MotiView } from 'moti';

// export default function App() {
//   return (
//     <SafeAreaView>
//       <View className="h-full w-full bg-[#1b1a1b]">
//         <View className="flex h-full flex-col items-center justify-center p-3">
//           <MotiView
//             from={{
//               opacity: 0,
//               scale: 0.5,
//             }}
//             animate={{
//               opacity: 1,
//               scale: 1,
//             }}
//             transition={{
//               type: 'timing',
//             }}>
//             <Image
//               source={require('../assets/robot.png')}
//               className="h-[300px] w-[300px] rounded-full shadow-2xl"
//             />
//           </MotiView>
//           <Text className="text-4xl font-bold text-white">
//             Welcome to <Text className="font-extrabold">Lexica</Text>!
//           </Text>
//           <Text className="mt-1 text-lg font-bold text-white/50">A simple AI chat app!</Text>
//           <TouchableOpacity
//             onPress={() => {
//               router.push('/home');
//             }}
//             className="mx-3 mt-5 w-full items-center justify-center rounded-xl bg-white p-3">
//             <Text className="font-extrabold text-black">Get Started</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       <StatusBar backgroundColor="#161622" style="light" />
//     </SafeAreaView>
//   );
// }
/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import { MotiView } from 'moti';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/Feather';

interface Message {
  role: string;
  content: string;
}

interface ResponseFormat {
  message: string;
  code: number;
  content: string;
}

async function chat(messages: Message[]): Promise<ResponseFormat> {
  try {
    const payload = {
      messages: messages,
    };
    const model = await AsyncStorage.getItem('model');
    let model_id = 14;
    if (model) {
      model_id = JSON.parse(model).id;
    }

    const response = await fetch(`https://lexica.qewertyy.dev/models?model_id=${model_id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    // Return the response data in the specified format
    return {
      message: 'success',
      code: responseData.status,
      content: responseData.content, // Assuming response data contains the content
    };
  } catch (error) {
    // If an error occurs, handle it accordingly
    console.error('Error:', error.message);
    return {
      message: 'error',
      code: -1,
      content: 'Welp, cannot respond to that one.', // You can add more details here if needed
    };
  }
}

export default function Home() {
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'assistant', content: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [topics, setTopics] = React.useState([]);
  const [modelName, setModelName] = React.useState('Llama 2');

  // Ref for the input field
  const inputRef = React.useRef(null);

  const generateTopics = () => {
    // choose 3 random topics from the list
    const topics = [
      'What is the meaning of life?',
      'How do I make a sandwich?',
      '6 year old birthday party ideas',
      'How to make a website',
      'Write a poem about love',
      'How to make a cake',
      'Brainstorm edge cases',
      'Write a thank you note',
    ];
    const selectedTopics = [];
    const remainingTopics = [...topics]; // Create a copy of the topics array

    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * remainingTopics.length);
      const selectedTopic = remainingTopics.splice(randomIndex, 1)[0]; // Remove the selected topic from the remaining topics
      selectedTopics.push(selectedTopic);
    }
    setTopics(selectedTopics);
  };

  // Function to load the chat history
  const loadChatHistory = async () => {
    try {
      const chatHistory = await AsyncStorage.getItem('messages');
      if (chatHistory) {
        setMessages(JSON.parse(chatHistory));
      }
    } catch (error) {
      console.error('Error loading chat history:', error.message);
    }
  };

  const loadModelName = async () => {
    try {
      const model = await AsyncStorage.getItem('model');
      if (model) {
        setModelName(JSON.parse(model).name);
      }
    } catch (error) {
      console.error('Error loading model name:', error.message);
    }
  };

  // Load the chat history on component mount
  React.useEffect(() => {
    loadChatHistory();
    loadModelName();
    generateTopics();
  }, []);

  const clearChat = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      setMessages([{ role: 'assistant', content: 'Hello! How can I assist you today?' }]);
      const topics = [
        'What is the meaning of life?',
        'How do I make a sandwich?',
        '6 year old birthday party ideas',
        'How to make a website',
        'Write a poem about love',
        'How to make a cake',
        'Brainstorm edge cases',
        'Write a thank you note',
      ];
      const selectedTopics = [];
      const remainingTopics = [...topics]; // Create a copy of the topics array

      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * remainingTopics.length);
        const selectedTopic = remainingTopics.splice(randomIndex, 1)[0]; // Remove the selected topic from the remaining topics
        selectedTopics.push(selectedTopic);
      }
      setTopics(selectedTopics);
    } catch (error) {
      console.error('Error clearing chat:', error.message);
    }
  };

  // Function to send a message
  const sendMessage = async () => {
    // Get the message from the input field
    const message = input.trim();
    if (!message) return;
    if (loading) return;
    setLoading(true);
    // Clear the input field
    setInput('');
    // Add the user message to the messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'user',
        content: message,
      },
      // a fake typing indicator
      { role: 'assistant', content: 'Typing...' },
    ]);

    // Send the message to the chatbot
    const response = await chat([...messages, { role: 'user', content: message }]);
    setMessages((prevMessages) => prevMessages.slice(0, -1));
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'assistant',
        content: response.content,
      },
    ]);
    // check if save_history is enabled in settings
    const saveHistory = await AsyncStorage.getItem('save_history');
    if (saveHistory === 'true') {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify([
          ...messages,
          { role: 'user', content: message },
          { role: 'assistant', content: response.content },
        ])
      );
    }
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <View className="relative h-full w-full overflow-hidden bg-[#1b1a1b]">
        <View className="m-5 flex-row items-center justify-between bg-[#1b1a1b]">
          {/* <View className="flex-row justify-between"> */}
          <Text className="mr-2 text-center text-2xl font-extrabold text-white">
            Lexica <Text className="text-green-500">Chat</Text>
          </Text>
          <View className="flex-row">
            <TouchableOpacity onPress={clearChat}>
              <Text className="p-3">
                <Icon name="trash-can-outline" size={20} color="white" />
              </Text>
            </TouchableOpacity>
            <SelectDropdown
              // data would be settings and a link to t.me/xendaddy
              data={[
                { name: 'Settings', icon: 'settings', url: '/settings' },
                { name: 'Contact', icon: 'mail', url: 'https://t.me/xendaddy' },
              ]}
              onSelect={(selectedItem, index) => {
                router.push(selectedItem.url);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View className="flex-row items-center">
                    <Text className="p-3">
                      <Icon name="dots-vertical" size={20} color="white" />
                    </Text>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <TouchableOpacity className="flex-row items-center justify-center px-3">
                    <FIcon name={item.icon} size={15} color="white" />
                    <Text className="text-md p-3 text-white">{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={{
                backgroundColor: '#1b1a1b',
                borderRadius: 10,
                marginRight: 10,
                width: 100,
                marginLeft: -60,
                maxWidth: '80vw', // Set maximum width as a percentage of viewport width
                overflowX: 'auto', // Enable horizontal scrolling if necessary
                position: 'absolute', // Adjust the positioning as needed
                right: 0, // Ensure it stays within the viewport
              }}
            />
          </View>
        </View>
        <ScrollView className="mt-5 h-5/6 w-full" showsVerticalScrollIndicator={false}>
          {messages.length > 1 ? (
            messages.map((message, index) => (
              <View
                key={index}
                className={`w-full flex-row items-center rounded-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <MotiView
                  from={{ opacity: 0, translateY: 50 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 500 }}
                  className={`mx-3 my-2 flex-row items-center ${message.role === 'user' ? 'justify-end rounded-bl-xl rounded-tl-xl rounded-tr-xl bg-green-500' : 'justify-start rounded-bl-xl rounded-br-xl rounded-tr-xl bg-white/10'}  p-3`}>
                  <Text className="text-white">{message.content}</Text>
                </MotiView>
              </View>
            ))
          ) : (
            <View className="flex-col items-center justify-center">
              <Text className="text-center text-2xl font-extrabold text-white">
                How can I assist you today?
              </Text>
              {topics.map((topic, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setInput(topic);
                    setTopics([]);
                  }}
                  className="mx-3 my-2 flex-row items-center justify-center rounded-xl bg-white/10 p-3">
                  <Text className="text-white">{topic}</Text>
                </TouchableOpacity>
              ))}
              {/* <MotiView
                from={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 500 }}
                className="mx-3 flex-row items-center justify-start rounded-xl bg-white/10 p-3">
                <Text className="text-white">Hello! How can I assist you today?</Text>
              </MotiView> */}
            </View>
          )}
        </ScrollView>
        {/* input for chat */}
        <View className="m-5 flex-row items-center justify-between gap-2">
          <TextInput
            ref={inputRef}
            autoCapitalize="sentences"
            placeholder="Type a message..."
            placeholderTextColor="white"
            style={{ color: 'white', flex: 1 }}
            className="rounded-full bg-white/10 px-3 py-2"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={(event) => {
              sendMessage();
            }}
          />
          <TouchableOpacity
            onPress={() => {
              sendMessage();
            }}
            disabled={loading}>
            <Text className={`rounded-full p-3 text-black ${loading ? 'bg-gray-500' : 'bg-white'}`}>
              <Icon name="arrow-up" size={20} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar backgroundColor="#1b1a1b" style="light" />
    </SafeAreaView>
  );
}
