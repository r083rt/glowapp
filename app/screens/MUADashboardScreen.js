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
  Modal,
} from 'native-base';
import {Image, Dimensions} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  ListBooking,
  ListChat,
  ListPendingCoin,
  ListConfirm,
  ListHistoryOrderMUA,
} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Toast from 'react-native-toast-message';
export default function MUADashboard({navigation, route}) {
  const [selectedID, setSelectedID] = useState('');
  const [bank, setBank] = useState('');
  const [noRek, setNoRek] = useState('');
  const [namaNasabah, setNamaNasabah] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalWithdraw, setShowModalWithdraw] = useState(false);
  const [pendingCoin, setPendingCoin] = useState([]);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [booking, setBooking] = useState([]);
  const [confirm, setConfirm] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState({
    id: '',
    kategori: '',
    nama: '',
    nominal: 0,
    tanggal: '',
    jam: '',
    catatan: '',
    customer_id: '',
  });

  const getProfile = async () => {
    const uid = await AsyncStorage.getItem('uid');
    try {
      setIsLoading(true);
      firestore()
        .collection('mua')
        .doc(uid)
        .get()
        .then(documentSnapshot => {
          console.log('User exists: ', documentSnapshot.exists);

          if (documentSnapshot.exists) {
            setUser(documentSnapshot.data());
            setIsLoading(false);
          }
        });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const getConfirm = async () => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      const querySnapshot = await firestore()
        .collection('booking')
        .where('status_pekerjaan', '==', 'Menunggu')
        .where('mua_id', '==', uid)
        .get();
      const newData = [];

      querySnapshot.forEach(doc => {
        console.log(doc.id);
        const data = doc.data();
        newData.push({uid: doc.id, ...data});
      });
      setConfirm(newData);
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  };

  const getBooking = async () => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      const querySnapshot = await firestore()
        .collection('booking')
        .where('status_pekerjaan', '==', 'Diterima')
        .where('mua_id', '==', uid)
        .get();
      const newData = [];

      querySnapshot.forEach(doc => {
        console.log(doc.id);
        const data = doc.data();
        newData.push({uid: doc.id, ...data});
      });
      setBooking(newData);
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  };

  const getHistoryOrder = async () => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      const querySnapshot = await firestore()
        .collection('booking')
        .where('status_pekerjaan', '==', 'Selesai')
        .where('mua_id', '==', uid)
        .get();
      const newData = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        newData.push({uid: doc.id, ...data});
      });
      console.log(newData);
      setHistory(newData);
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  };

  async function getChat() {
    try {
      const uid = await AsyncStorage.getItem('uid');
      const querySnapshot = await firestore()
        .collection('newchat')
        .doc(uid)
        .collection('messages')
        .where('is_read', '==', false)
        .get();
      const newData = [];

      querySnapshot.forEach(doc => {
        newData.push(doc.data());
      });
      setChats(newData);
    } catch (error) {}
  }

  async function getPendingCoin() {
    try {
      const uid = await AsyncStorage.getItem('uid');
      const querySnapshot = await firestore()
        .collection('coin_trx')
        .where('mua_id', '==', uid)
        .where('status', '==', 'Baru')
        .get();
      const newData = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        newData.push({uid: doc.id, ...data});
      });
      setPendingCoin(newData);
      // setChats(newData);
    } catch (error) {}
  }

  useEffect(() => {
    getChat();
    getBooking();
    getProfile();
    getPendingCoin();
    getConfirm();
    getHistoryOrder();
  }, []);

  const handleWithdraw = async e => {
    console.log(selectedID);
    if (namaNasabah == '' || noRek == '' || bank == '') {
      Toast.show({
        type: 'error',
        text1: 'Lengkapi data pencairan coin!',
      });
      return;
    }
    try {
      await firestore().collection('coin_trx').doc(selectedID).update({
        status: 'Menunggu Pencairan',
        bank: bank.toString(),
        no_rek: noRek.toString(),
        nama_nasabah: namaNasabah.toString(),
      });
      setShowModalWithdraw(false);
      getPendingCoin();

      Toast.show({
        type: 'success',
        text1: 'Admin akan memproses pencairan Anda.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Gagal update',
      });
    }
  };

  const handleViewChat = async e => {
    const nama = await AsyncStorage.getItem('nama');
    const uid = await AsyncStorage.getItem('uid');

    navigation.navigate('Chat', {
      senderId: uid,
      senderName: e.name,
      receiverId: e.from,
      chatId: e.chatId,
    });
  };

  const handleFinish = async e => {
    const uid = await AsyncStorage.getItem('uid');
    const nama = await AsyncStorage.getItem('nama');
    await firestore().collection('booking').doc(selectedBooking.id).update({
      status_pekerjaan: 'Selesai',
      status_bayar: 'Lunas',
    });
    await firestore()
      .collection('coin_trx')
      .add({
        tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
        booking_id: selectedBooking.id,
        nominal: selectedBooking.nominal,
        client: selectedBooking.nama,
        mua_id: uid,
        mua_name: nama,
        status: 'Baru',
      });
    getPendingCoin();
    const documentRef = firestore()
      .collection('users')
      .doc(selectedBooking.customer_id);

    firestore()
      .runTransaction(async transaction => {
        const documentSnapshot = await transaction.get(documentRef);
        const currentCoin = documentSnapshot.get('coin');

        const updatedCoin = currentCoin - selectedBooking.nominal;

        transaction.update(documentRef, {
          coin: updatedCoin,
        });
      })
      .then(() => {
        console.log('Nominal updated to coin successfully');
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Gagal update',
        });
        console.log('Error updating nominal:', error);
      });

    setShowModal(false);
    Toast.show({
      type: 'success',
      text1: 'Update Booking Status Success',
    });
    getBooking();
  };

  const handleAcceptBooking = async e => {
    console.log(e.uid);
    firestore()
      .collection('booking')
      .doc(e.uid)
      .update({
        status_pekerjaan: 'Diterima',
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Update status berhasil.',
        });
        getBooking();
        getConfirm();
        getHistoryOrder();
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Gagal update',
        });
      });
  };

  const handleDeclineBooking = async e => {
    console.log(e.uid);
    firestore()
      .collection('booking')
      .doc(e.uid)
      .update({
        status_pekerjaan: 'Ditolak',
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Update status berhasil.',
        });
        getBooking();
        getConfirm();
        getHistoryOrder();
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Gagal update',
        });
      });
  };

  return (
    <Box flex={1} bgColor={'#FFF2F2'}>
      <Modal
        closeOnOverlayClick
        isOpen={showModal}
        onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.Header>
            <Heading size={'sm'}>Pekerjaan selesai ?</Heading>
          </Modal.Header>
          <Modal.Body>
            <Text fontWeight={'bold'} fontSize={20}>
              {selectedBooking.nama}
            </Text>
            <Text fontWeight={'bold'} fontSize={17}>
              {selectedBooking.kategori}
            </Text>
            <Text fontWeight={'bold'}>
              {moment(selectedBooking.tanggal).format('DD MMMM YYYY') +
                ' ' +
                selectedBooking.jam}
            </Text>
            <HStack space={3} alignItems={'center'}>
              <FontAwesomeIcon name={'coins'} color={'#F47C7C'} />
              <Text fontWeight={'bold'}>{selectedBooking.nominal}</Text>
            </HStack>
            {selectedBooking.catatan != '' ? (
              <Text fontWeight={'bold'}>
                {'Catatan : ' + selectedBooking.catatan}
              </Text>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button
              w={'48%'}
              variant={'ghost'}
              _text={{color: '#F47C7C'}}
              onPress={() => setShowModal(false)}>
              Belum
            </Button>
            <Button w={'48%'} colorScheme={'success'} onPress={handleFinish}>
              Selesai
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Modal
        closeOnOverlayClick
        isOpen={showModalWithdraw}
        onClose={() => setShowModalWithdraw(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.Header>
            <Heading size={'sm'}>Masukkan data pencairan</Heading>
          </Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <Input
                onChangeText={text => setBank(text)}
                placeholder="Nama Bank"></Input>
              <Input
                onChangeText={text => setNoRek(text)}
                placeholder="Nomor Rekening"></Input>
              <Input
                onChangeText={text => setNamaNasabah(text)}
                placeholder="Nama Nasabah"></Input>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              w={'48%'}
              variant={'ghost'}
              _text={{color: '#F47C7C'}}
              onPress={() => setShowModalWithdraw(false)}>
              Batal
            </Button>
            <Button w={'48%'} colorScheme={'success'} onPress={handleWithdraw}>
              Kirim
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {user != null ? (
        <ScrollView flex={1}>
          <VStack space={2} px={5}>
            <HStack space={6} mt={10}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MUADetails', {
                    user: user,
                  });
                }}>
                <Avatar
                  w={110}
                  h={110}
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
                <HStack alignItems={'center'} space={2}>
                  <FontAwesomeIcon name={'coins'} color={'#F47C7C'} size={16} />
                  <Heading
                    fontWeight={'extrabold'}
                    size={'md'}
                    color={'#F47C7C'}>
                    {user.coin}
                  </Heading>
                </HStack>

                <Button
                  _text={{fontWeight: 'bold'}}
                  size={'xs'}
                  width={100}
                  leftIcon={
                    <FontAwesomeIcon
                      size={15}
                      name="photo-video"
                      color={'#FFF'}
                    />
                  }
                  backgroundColor={'#F47C7C'}
                  onPress={() => {
                    navigation.navigate('MUAPorto');
                  }}>
                  Portofolio
                </Button>
              </VStack>
            </HStack>
            <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
            <Heading>Confirm Appointment</Heading>
            <ListConfirm
              data={confirm}
              onAcceptItem={handleAcceptBooking}
              onDeclineItem={handleDeclineBooking}
            />

            <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
            <Heading>Appointment Schedule</Heading>
            <ListBooking
              onPressItem={e => {
                setSelectedBooking({
                  id: e.uid,
                  kategori: e.kategori,
                  nama: e.nama,
                  nominal: parseInt(e.nominal),
                  tanggal: e.tanggal,
                  jam: e.jam,
                  catatan: e.catatan,
                  customer_id: e.customer_id,
                });
                setShowModal(true);
              }}
              data={booking}
            />
            <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
            <Heading>History Order</Heading>
            <ListHistoryOrderMUA data={history} />

            <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
            <Heading>New Chat</Heading>
            <ListChat onPressItem={handleViewChat} data={chats} />
            <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
            <Heading>Coin Bisa Dicairkan</Heading>
            <ListPendingCoin
              data={pendingCoin}
              onPressItem={e => {
                setSelectedID(e.uid);
                setShowModalWithdraw(true);
              }}
            />
          </VStack>
        </ScrollView>
      ) : (
        <Center flex={1}>
          <Spinner />
        </Center>
      )}
    </Box>
  );
}
