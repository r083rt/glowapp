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
  IconButton,
  ScrollView,
  Modal,
  TextField,
  Image,
} from 'native-base';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import {Dimensions} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import {ListPorto} from '../components';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MUAProfile({navigation, route}) {
  const [showModal, setShowModal] = useState(false);
  const [showModalOption, setShowModalOption] = useState(false);
  const _width = Dimensions.get('screen').width;
  const _height = Dimensions.get('screen').height;
  const data = route.params.data;
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState(null);
  const [porto, setPorto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState({
    id: '',
    foto: '',
  });
  const [pickedDate, setPickedDate] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('porto')
          .where('uid', '==', route.params.data.uid)
          .get();
        const newData = [];
        querySnapshot.forEach(doc => {
          newData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setPorto(newData);
      } catch (error) {
        console.log('Error getting documents: ', error);
      }
    };
    getData();
  }, []);

  const saveAppointment = async () => {
    const uid = await AsyncStorage.getItem('uid');
    const nama = await AsyncStorage.getItem('nama');
    console.log('current user ', data.uid);
    const bookingID = uid + moment('DDMMYYHHmm');
    try {
      const docRef = await firestore()
        .collection('booking')
        .add({
          customer_id: uid,
          mua_id: data.uid,
          id: bookingID,
          jam: moment(bookingTime).format('HH:mm'),
          tanggal: moment(bookingDate).format('YYYY-MM-DD'),
          nama: nama,
          nominal: parseInt(data.rate),
          status_bayar: 'Menunggu Pembayaran',
          status_pekerjaan: 'Menunggu',
          catatan: notes,
          kategori: data.kategori,
        });

      setShowModal(!showModal);
      Toast.show({
        type: 'success',
        text1: 'Success Create Appointment.',
        text2: 'Your booking ID is ' + bookingID,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || bookingDate;
    setShowDate(Platform.OS === 'ios');
    setBookingDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || bookingTime;
    setShowTime(Platform.OS === 'ios');
    setBookingTime(currentTime);
  };

  const handleStartChat = async () => {
    const nama = await AsyncStorage.getItem('nama');
    const uid = await AsyncStorage.getItem('uid');
    navigation.navigate('Chat', {
      chatId: route.params.data.uid + uid,
      receiverId: route.params.data.uid,
      senderId: uid,
      senderName: nama,
    });
  };

  const handleSelectPhoto = e => {
    console.log(e.data.foto);
    setSelectedPhoto({
      foto: e.data.foto,
      id: e.id,
    });
    setShowModalOption(true);
  };
  return (
    <Box flex={1}>
      <Modal onClose={() => setShowModalOption(false)} isOpen={showModalOption}>
        <Modal.Content maxWidth="400px">
          <Modal.Body>
            <Image
              borderRadius={10}
              source={{
                uri: selectedPhoto.foto,
              }}
              w={400}
              h={380}
              mr={3}
              mb={5}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Appointment Detail</Modal.Header>
          <Modal.Body>
            <VStack space={2}>
              <Text>Choose Date</Text>
              <Input
                onFocus={() => setShowDate(!showDate)}
                borderColor={'#F47C7C'}
                placeholder="Please Choose Your Date">
                {bookingDate != null
                  ? moment(bookingDate).format('DD MMM YYYY')
                  : ''}
              </Input>
            </VStack>
            <VStack space={2}>
              <Text>Choose Time</Text>
              <Input
                onFocus={() => setShowTime(!showTime)}
                borderColor={'#F47C7C'}
                placeholder="Please Choose Your Time">
                {bookingTime != null ? moment(bookingTime).format('HH:mm') : ''}
              </Input>
            </VStack>
            <VStack space={2}>
              <Text>Notes</Text>
              <Input
                onChangeText={val => setNotes(val)}
                borderColor={'#F47C7C'}
                placeholder="Notes (optional)"
              />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                _text={{color: '#F47C7C'}}
                // colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}>
                Cancel
              </Button>
              <Button
                backgroundColor={'#F47C7C'}
                onPress={() => {
                  saveAppointment();
                  setShowModal(false);
                }}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {showDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          is24Hour={true}
          mode="date"
          onChange={onChangeDate}
        />
      )}

      {showTime && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          is24Hour={true}
          mode="time"
          onChange={onChangeTime}
          display="clock"
        />
      )}

      <ScrollView flex={1} p={5} bgColor={'#FFF2F2'}>
        <TouchableOpacity
          style={{marginTop: 40}}
          onPress={() => navigation.goBack()}>
          <IoniconsIcon name="arrow-back-circle" color={'#F47C7C'} size={40} />
        </TouchableOpacity>
        <HStack mt={10} space={5} w={_width * 0.8}>
          <Box w={_width * 0.3} h={_width * 0.4}>
            <Image
              source={{uri: data.foto}}
              borderRadius={10}
              style={{
                width: _width * 0.3,
                height: _width * 0.38,
                resizeMode: 'cover',
              }}
            />
          </Box>
          <VStack space={3}>
            <Heading size={'lg'}>{data.nama}</Heading>
            <Text w={220} fontWeight={'bold'} fontSize={15}>
              {data.kategori}
            </Text>
            <HStack space={3}>
              <FontAwesomeIcon name={'coins'} size={16} color={'#F47C7C'} />
              <Text color={'#F47C7C'} fontWeight={'bold'}>
                {data.rate}
              </Text>
            </HStack>
            <TouchableOpacity onPress={handleStartChat}>
              <HStack
                w={120}
                px={5}
                py={2}
                alignContent={'center'}
                alignItems={'center'}
                space={2}
                bgColor={'#F47C7C'}
                borderRadius={15}>
                <IoniconsIcon
                  size={20}
                  name="chatbox-ellipses-outline"
                  color={'#FFF'}
                />
                <Text fontSize={17} fontWeight={'bold'} color={'#FFF'}>
                  Chat
                </Text>
              </HStack>
            </TouchableOpacity>
          </VStack>
        </HStack>
        <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
        <Heading>Portofolio</Heading>
        {loading == true ? (
          <Center flex={1}>
            <Spinner />
          </Center>
        ) : (
          <ListPorto onPressItem={handleSelectPhoto} data={porto} />
        )}
      </ScrollView>
      <Button
        isDisabled={parseInt(route.params.coin) < parseInt(data.rate)}
        m={5}
        backgroundColor={'#F47C7C'}
        borderRadius={10}
        size={'md'}
        onPress={() => setShowModal(!showModal)}
        _text={{fontWeight: 'extrabold'}}
        isLoadingText={'Harap Tunggu ...'}>
        Make Appointment
      </Button>
    </Box>
  );
}
