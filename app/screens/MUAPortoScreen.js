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
  Fab,
  ScrollView,
  Icon,
  Modal,
} from 'native-base';
import Toast from 'react-native-toast-message';
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Image, Dimensions, Alert} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {utils} from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ListBooking, ListPorto} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function MUAPorto({navigation, route}) {
  const [showModal, setShowModal] = useState(false);
  const [porto, setPorto] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const _width = Dimensions.get('screen').width;
  const _height = Dimensions.get('screen').height;
  const getData = async () => {
    const uid = await AsyncStorage.getItem('uid');

    try {
      const querySnapshot = await firestore()
        .collection('porto')
        .where('uid', '==', uid)
        .get();
      const newData = [];
      querySnapshot.forEach(doc => {
        newData.push(doc.data());
      });
      setPorto(newData);
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

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
        console.log(result.assets[0].fileName);

        uploadImage(result.assets[0].uri);
        // const reference = storage().ref(result.assets[0].fileName);
        //   const res = result.assets[0];
        //   setFoto64(res.base64);
      }
    });
  };

  const uploadImage = async imageUri => {
    setShowModal(true);
    const uid = await AsyncStorage.getItem('uid');
    // create a unique file name for the image
    const fileName = `${Date.now()}.jpg`;

    // create a reference to the storage location where the image will be uploaded
    const reference = storage().ref(`${uid}/${fileName}`);

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

    await firestore().collection('porto').add({
      uid: uid,
      foto: downloadURL,
    });
    Toast.show({
      type: 'success',
      text1: 'Upload Photo Success',
    });
    setShowModal(false);
    getData();

    return downloadURL;
  };
  return (
    <Box flex={1} bgColor={'#FFF2F2'} p={10}>
      <Fab
        onPress={() => {
          handleLaunchGallery();
        }}
        bgColor={'#F47C7C'}
        renderInPortal={false}
        shadow={2}
        size="sm"
        icon={<FontAwesomeIcon name={'plus'} size={20} color={'#FFF'} />}
      />
      <Modal isOpen={showModal}>
        <Modal.Content maxWidth="400px">
          <Modal.Body>
            <VStack space={3} alignItems={'center'}>
              <Spinner color={'#F47C7C'} />
              <Text>Uploading Photo. Please wait.</Text>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <HStack space={10} alignItems={'center'} alignContent={'center'}>
        <TouchableOpacity
          style={{marginTop: 10}}
          onPress={() => navigation.goBack()}>
          <IoniconsIcon name="arrow-back-circle" color={'#F47C7C'} size={40} />
        </TouchableOpacity>
        <Heading size={'xl'}>Portofolio</Heading>
      </HStack>

      <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
      <ListPorto data={porto} />
    </Box>
  );
}
