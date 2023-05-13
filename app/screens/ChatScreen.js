import React, {useState, useCallback, useEffect} from 'react';
import {Box, Text, Button, HStack, VStack, Heading} from 'native-base';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
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
