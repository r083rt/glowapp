import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  HStack,
  Heading,
  VStack,
  Center,
  Avatar,
  Button,
  Input,
  Spinner,
  FlatList,
  Divider,
  ScrollView,
  Image,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {ListMuaChat} from '../components';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
export default function MUAChat({navigation, route}) {
  const [muas, setMUAS] = useState([]);
  useEffect(() => {
    getChatHistory();
    getMUA();
  }, []);
  const getMUA = async () => {
    try {
      const querySnapshot = await firestore().collection('mua').get();
      const newData = [];
      querySnapshot.forEach(doc => {
        newData.push(doc.data());
      });
      setMUAS(newData);
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  };

  const getChatHistory = async () => {
    const uid = await AsyncStorage.getItem('uid');
    const chatsSnapshot = await firestore().collection('chats').get();

    const allData = [];

    chatsSnapshot.forEach(async chatDoc => {
      const chatData = chatDoc.data();
      const chatId = chatDoc.id;
      console.log(chatId);

      // const messagesQuerySnapshot = await firestore()
      //   .collection('chats')
      //   .doc(chatId)
      //   .collection('messages')
      //   .get();

      // const messages = messagesQuerySnapshot.docs.map(messageDoc =>
      //   messageDoc.data(),
      // );

      // const chatWithMessages = {
      //   id: chatId,
      //   data: chatData,
      //   messages: messages,
      // };

      // allData.push(chatWithMessages);
    });

    // console.log(allData);
    // queueSnapshot.onSnapshot(querySnapshot => {
    //   const filteredMessages = querySnapshot.docs
    //     .map(docSnap => {
    //       const data = docSnap.data();
    //       const createdAt = data.createdAt.toDate();
    //       if (data.senderId === senderId) {
    //         return {
    //           ...data,
    //           createdAt,
    //         };
    //       }
    //       return null;
    //     })
    //     .filter(message => message !== null);
    //   console.log(filteredMessages);
    //   setMessages(filteredMessages);
    // });
  };

  const handleChat = e => {
    console.log(e);
  };
  return (
    <Box flex={1} p={4} mt={10}>
      <HStack my={10} space={4} alignItems={'center'}>
        <TouchableOpacity
          style={{marginTop: 10}}
          onPress={() => navigation.goBack()}>
          <IoniconsIcon name="arrow-back-circle" color={'#F47C7C'} size={30} />
        </TouchableOpacity>
        <Heading>Conversations</Heading>
      </HStack>
      <ListMuaChat data={muas} onPressItem={handleChat} />
    </Box>
  );
}
