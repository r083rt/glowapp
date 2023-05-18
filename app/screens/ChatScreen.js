import React, {useState, useCallback, useEffect} from 'react';
import {Box, Text, Button, HStack, VStack, Heading} from 'native-base';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {TouchableOpacity} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
export default function Chat({navigation, route}) {
  const [uid, setUID] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const queueSnapshot = firestore()
      .collection('chats')
      .doc(route.params.chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    queueSnapshot.onSnapshot(querySnapshot => {
      const allMessages = querySnapshot.docs.map(docSnap => {
        return {
          ...docSnap.data(),
          createdAt: new Date(),
        };
      });
      setMessages(allMessages);
    });
  }, []);

  const onSend = useCallback((messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      senderId: route.params.senderId,
      receiverId: route.params.receiverId,
      senderName: route.params.senderName,
    };
    console.log(myMsg);
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));

    firestore()
      .collection('chats')
      .doc(route.params.chatId)
      .collection('messages')
      .add({
        ...myMsg,
        createdAt: new Date(),
      });

    firestore()
      .collection('newchat')
      .doc(route.params.receiverId)
      .collection('messages')
      .add({
        from: route.params.senderId,
        chatId: route.params.receiverId + route.params.senderId,
        createdAt: new Date(),
        name: route.params.senderName,
        is_read: false,
      });
  }, []);
  return (
    <Box flex={1} bgColor={'#FFF'}>
      <HStack space={10} alignItems={'center'}>
        <TouchableOpacity
          style={{marginTop: 50, marginLeft: 20}}
          onPress={() => navigation.goBack()}>
          <IoniconsIcon name="arrow-back-circle" color={'#F47C7C'} size={40} />
        </TouchableOpacity>
        <Heading mt={50}>{route.params.receiverName}</Heading>
      </HStack>

      <GiftedChat
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#F47C7C',
                },
              }}
            />
          );
        }}
        renderAvatar={null}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: route.params.senderId,
        }}
      />
    </Box>
  );
}
