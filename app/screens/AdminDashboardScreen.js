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
  Modal,
  ScrollView,
} from 'native-base';
import Toast from 'react-native-toast-message';
import {Image, Dimensions} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ListBooking, ListTopupAdmin} from '../components';

export default function AdminDashboard({navigation, route}) {
  const [showModalTopup, setShowModalTopup] = useState(false);
  const [topups, setTopups] = useState([]);
  const [topupInfo, setTopupInfo] = useState({});
  const [booking, setBooking] = useState([]);
  const user = route.params.user;

  const getTopup = async () => {
    console.log('booking');
    try {
      const querySnapshot = await firestore()
        .collection('transaction')
        .where('dikonfirmasi', '==', false)
        .get();
      const newData = [];

      querySnapshot.forEach(doc => {
        newData.push(doc.data());
      });
      setTopups(newData);
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  };

  useEffect(() => {
    const getBooking = async () => {
      console.log('booking');
      try {
        const querySnapshot = await firestore().collection('booking').get();
        const newData = [];

        querySnapshot.forEach(doc => {
          newData.push(doc.data());
        });
        setBooking(newData);
      } catch (error) {
        console.log('Error getting documents: ', error);
      }
    };
    getBooking();

    getTopup();
  }, []);

  const handleConfirm = () => {
    topupcoin = parseInt(topupInfo.jumlah) / 1000;

    var coin = 0;
    const docRef = firestore().collection('users').doc(topupInfo.customer_id);

    docRef
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          const data = documentSnapshot.data();
          coin = parseInt(data.coin);
          console.log('coin ', data);

          totalCoin = coin + topupcoin;
          return docRef.update({
            coin: totalCoin,
            // dikonfirmasi: true,
          });
        }
      })
      .then(() => {
        console.log('Document updated successfully');
        Toast.show({
          type: 'success',
          text1: 'Success Confirm Topup',
        });
        getTopup();
      })
      .catch(error => {
        console.log('Error updating document: ', error);
      });
  };

  const handleBooking = () => {};

  return (
    <ScrollView flex={1} bgColor={'#FFF2F2'}>
      <Modal isOpen={showModalTopup} onClose={() => setShowModalTopup(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Body>
            <Text fontWeight={'bold'}>{topupInfo.nama}</Text>
            <Text fontSize={20} fontWeight={'bold'}>
              Rp.
              {new Intl.NumberFormat('id-ID', {
                minimumFractionDigits: 0,
              }).format(parseInt(topupInfo.jumlah))}
            </Text>
            <Text>{topupInfo.pembayaran}</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModalTopup(false);
                }}>
                Cancel
              </Button>
              <Button
                colorScheme={'success'}
                onPress={() => {
                  setShowModalTopup(false);
                  handleConfirm();
                }}>
                Confirm
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <VStack mt={20} space={2} px={5}>
        <HStack space={6}>
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
              source={require('../assets/make-up.png')}>
              {user.nama}
            </Avatar>
          </TouchableOpacity>

          <VStack space={1}>
            <Heading fontWeight={'extrabold'} color={'#F47C7C'}>
              {user.nama}
            </Heading>
            <Text color={'#F47C7C'} fontWeight={'bold'}>
              {user.kategori}
            </Text>
          </VStack>
        </HStack>
        <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
        <Heading>Appointment Schedule</Heading>
        <ListBooking onPressItem={handleBooking} data={booking} />
        <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
        <Heading>New Topup</Heading>
        <ListTopupAdmin
          onPressItem={e => {
            setTopupInfo(e);
            setShowModalTopup(true);
          }}
          data={topups}
        />
      </VStack>
    </ScrollView>
  );
}
