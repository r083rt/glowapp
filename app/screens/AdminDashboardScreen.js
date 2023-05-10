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
} from 'native-base';
import {Image, Dimensions} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function AdminDashboard({navigation, route}) {
  return (
    <ScrollView flex={1} bgColor={'#FFF2F2'}>
      <Text>Admin page</Text>
      <Button
        onPress={() => {
          auth()
            .signOut()
            .then(() => navigation.replace('Splash'));
        }}></Button>
    </ScrollView>
  );
}
