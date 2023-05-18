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
} from 'native-base';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import {Image, Dimensions, TouchableOpacity} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

import {CoinSelection, ListAppointment, ListTopup} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

export default function UserProfile({navigation, route}) {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const _width = Dimensions.get('screen').width;
  const _height = Dimensions.get('screen').height;
  const user = route.params.user;
  const [appointment, setAppontment] = useState([]);
  const [topup, setTopup] = useState([]);
  const [selectValue, setSelectValue] = useState(0);

  useEffect(() => {
    const getAppointment = async () => {
      try {
        const uid = await AsyncStorage.getItem('uid');
        const querySnapshot = await firestore()
          .collection('booking')
          .where('status_pekerjaan', '==', 'Menunggu')
          .where('customer_id', '==', uid)
          .get();
        const newData = [];
        querySnapshot.forEach(doc => {
          newData.push(doc.data());
        });

        setAppontment(newData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log('Error getting documents: ', error);
      }
    };
    const getTrx = async () => {
      try {
        const uid = await AsyncStorage.getItem('uid');
        const querySnapshot = await firestore()
          .collection('transaction')
          .where('customer_id', '==', uid)
          .where('jenis', '==', 'topup')
          .where('dikonfirmasi', '==', false)
          .get();
        const newData = [];
        querySnapshot.forEach(doc => {
          newData.push(doc.data());
        });

        setTopup(newData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log('Error getting documents: ', error);
      }
    };
    getAppointment();
    getTrx();
  }, []);

  const uploadImage = async imageUri => {
    const uid = await AsyncStorage.getItem('uid');
    // create a unique file name for the image
    const fileName = `${Date.now()}.jpg`;

    // create a reference to the storage location where the image will be uploaded
    const reference = storage().ref(`profile/${uid}`);

    // upload the image to the storage location
    const task = reference.putFile(imageUri);

    // wait for the upload to complete and get the download URL of the uploaded image
    const downloadURL = await new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
        },
        error => {
          reject(error);
        },
        async () => {
          const url = await reference.getDownloadURL();
          resolve(url);
        },
      );
    });

    await firestore().collection('users').doc(uid).update({
      foto: downloadURL,
    });
    Toast.show({
      type: 'success',
      text1: 'Upload Photo Success',
    });

    // getData();

    return downloadURL;
  };

  const handleLaunchGallery = e => {
    // setFoto64('');
    const imageOptions = {
      title: 'Capture Image',
      quality: 0.8,

      rotation: 0,
      maxHeight: 720,
      maxWidth: 576,
      mediaType: 'photo',
      includeBase64: true,
    };
    launchImageLibrary(imageOptions, result => {
      if (result.assets) {
        console.log(result.assets[0].uri);
        uploadImage(result.assets[0].uri);
      }
    });
  };

  const handleChat = async e => {
    const nama = await AsyncStorage.getItem('nama');
    const uid = await AsyncStorage.getItem('uid');
    navigation.navigate('Chat', {
      chatId: e.mua_id + uid,
      receiverId: e.mua_id,
      receiverName: e.mua_name,
      senderId: uid,
      senderName: nama,
    });
  };

  return (
    <Box flex={1} bgColor={'#FFF2F2'}>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Top Up Coin</Modal.Header>
          <Modal.Body>
            {selectValue === 0 || selectValue === NaN ? null : (
              <Heading mb={3}>{selectValue} Coin</Heading>
            )}
            <CoinSelection
              onSelectValue={val => {
                setSelectValue(val);
              }}
            />
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
                  setShowModal(false);
                  navigation.navigate('Payment', {
                    coin: selectValue,
                  });
                }}>
                Pay
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <ScrollView flex={1} mt={5} p={5} bgColor={'#FFF2F2'}>
        <TouchableOpacity
          style={{marginTop: 10}}
          onPress={() => navigation.goBack()}>
          <IoniconsIcon name="arrow-back-circle" color={'#F47C7C'} size={40} />
        </TouchableOpacity>
        <HStack mt={10} space={5} w={_width * 0.8}>
          <Box w={_width * 0.3} h={_width * 0.4}>
            {user.foto != '' ? (
              <TouchableOpacity onPress={handleLaunchGallery}>
                <Image
                  source={{uri: user.foto}}
                  borderRadius={10}
                  style={{
                    width: _width * 0.3,
                    height: _width * 0.38,
                    resizeMode: 'cover',
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleLaunchGallery}>
                <Image
                  source={require('../assets/make-up.png')}
                  borderRadius={10}
                  style={{
                    width: _width * 0.3,
                    height: _width * 0.3,
                    resizeMode: 'cover',
                  }}
                />
              </TouchableOpacity>
            )}
          </Box>
          <VStack space={3}>
            <Heading size={'lg'}>{user.nama}</Heading>

            <HStack space={3}>
              <FontAwesomeIcon name={'coins'} size={20} color={'#F47C7C'} />
              <Text color={'#F47C7C'} fontSize={18} fontWeight={'bold'}>
                {user.coin}
              </Text>
            </HStack>
            <TouchableOpacity
              onPress={() => {
                setSelectValue(0);
                setShowModal(true);
              }}>
              <HStack
                w={140}
                px={5}
                py={2}
                alignContent={'center'}
                alignItems={'center'}
                space={2}
                bgColor={'#F47C7C'}
                borderRadius={5}>
                <FontAwesomeIcon name={'coins'} size={20} color={'#FFF'} />
                <Text fontSize={12} fontWeight={'bold'} color={'#FFF'}>
                  Topup Coin
                </Text>
              </HStack>
            </TouchableOpacity>
          </VStack>
        </HStack>
        <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
        <Heading size={'md'} mb={4}>
          Upcoming Appointment
        </Heading>
        {isLoading == true ? (
          <Spinner color={'#F47C7C'} />
        ) : (
          <ListAppointment data={appointment} onPressItem={handleChat} />
        )}
        <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
        <Heading size={'md'} mb={4}>
          Topup Status
        </Heading>
        <ListTopup data={topup} />
      </ScrollView>
      <Button
        onPress={() =>
          auth()
            .signOut()
            .then(() => navigation.replace('Splash'))
        }
        m={5}
        backgroundColor={'#F47C7C'}
        borderRadius={10}
        size={'md'}
        _text={{fontWeight: 'extrabold'}}>
        Sign Out
      </Button>
    </Box>
  );
}
