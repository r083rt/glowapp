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
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ListBooking} from '../components';

export default function MUADashboard({navigation, route}) {
  const user = route.params.user;
  const [booking, setBooking] = useState([]);
  useEffect(() => {
    const getBooking = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('booking')
          .where('mua_id', '==', user.uid)
          .get();
        const newData = [];

        querySnapshot.forEach(doc => {
          console.log(doc.data());
          newData.push(doc.data());
        });
        setBooking(newData);
      } catch (error) {
        console.log('Error getting documents: ', error);
      }
    };

    getBooking();
  }, []);

  const handleViewBooking = e => {
    console.log(e);
  };

  return (
    <Box flex={1} bgColor={'#FFF2F2'}>
      <VStack space={2} px={5}>
        <HStack space={6} mt={10}>
          <TouchableOpacity
            onPress={() => {
              auth()
                .signOut()
                .then(() => navigation.replace('Splash'));
            }}>
            <Avatar
              w={70}
              h={70}
              bg="#F47C7C"
              source={{
                uri: user.foto,
              }}>
              {user.nama}
            </Avatar>
          </TouchableOpacity>

          <VStack space={1}>
            <Heading fontWeight={'extrabold'} size={'xl'} color={'#F47C7C'}>
              Hi, {user.nama}
            </Heading>
            <Text color={'#F47C7C'} fontWeight={'bold'}>
              {user.kategori}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('MUAPorto')}>
              <Box
                borderRadius={30}
                bgColor={'#F47C7C'}
                p={2}
                alignItems={'center'}>
                <Text fontWeight={'bold'} color={'#FFF'}>
                  Gallery Portofolio
                </Text>
              </Box>
            </TouchableOpacity>
          </VStack>
        </HStack>
        <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
        <Heading>Appointment Schedule</Heading>
        <ListBooking onPressItem={handleViewBooking} data={booking} />
      </VStack>
    </Box>
  );
}
