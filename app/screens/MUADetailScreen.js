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
  Stack,
  Radio,
  Select,
  TextArea,
  Checkbox,
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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
export default function MUADetails({navigation, route}) {
  const [kategori, setKategori] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [alamat, setAlamat] = useState('');
  const [rate, setRate] = useState(0);
  const [style, setStyle] = useState([]);
  const [availCoin, setAvailCoin] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const _width = Dimensions.get('screen').width;
  const _height = Dimensions.get('screen').height;
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile();
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
        changePhoto(result.assets[0].uri);
      }
    });
  };

  const getPendingCoin = async () => {
    const uid = await AsyncStorage.getItem('uid');
  };

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

  const changePhoto = async imageUri => {
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

    await firestore().collection('mua').doc(uid).update({
      foto: downloadURL,
    });
    getProfile();
    Toast.show({
      type: 'success',
      text1: 'Update Photo Success',
    });

    // getData();

    return downloadURL;
  };

  const handleEdit = async e => {
    if (editMode == false) {
      setEditMode(true);
    } else {
      const uid = await AsyncStorage.getItem('uid');
      await firestore()
        .collection('mua')
        .doc(uid)
        .update({
          keterangan: keterangan != '' ? keterangan : user.keterangan,
          kategori: kategori != '' ? kategori : user.kategori,
          alamat: alamat != '' ? alamat : user.alamat,
          rate: rate != 0 ? rate : user.rate,
          style: style.length > 0 ? style : user.style,
        });

      Toast.show({
        type: 'success',
        text1: 'Update Profile Success',
      });
      navigation.goBack();
    }
  };

  return (
    <Box flex={1} bgColor={'#FFF2F2'}>
      {user != null ? (
        <>
          <ScrollView flex={1} bgColor={'#FFF2F2'}>
            <Box w={'100%'} h={_height * 0.3}>
              {user.foto != '' ? (
                <TouchableOpacity onPress={handleLaunchGallery}>
                  <Image
                    source={{uri: user.foto}}
                    style={{
                      //   width: _width * 0.3,
                      height: _height * 0.3,
                      resizeMode: 'cover',
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleLaunchGallery}>
                  <Box bgColor={'#FFF'} width={_width} height={_width * 0.5}>
                    <Center flex={1}>
                      <FontAwesomeIcon
                        name="camera"
                        color={'#F47C7C'}
                        size={40}
                      />
                    </Center>
                  </Box>
                </TouchableOpacity>
              )}
            </Box>

            {editMode == false ? (
              <Box p={10} w={'100%'}>
                <Text fontWeight={'bold'}>Biodata</Text>
                <Text mb={5}>{user.keterangan}</Text>
                <Text fontWeight={'bold'}>Alamat</Text>
                <Text mb={5}>{user.alamat}</Text>
                <Text fontWeight={'bold'}>Rate</Text>
                <Text mb={5}>{user.rate} Coin</Text>
                <HStack justifyContent={'space-between'}>
                  <VStack>
                    <Text fontWeight={'bold'}>Jenis Makeup</Text>
                    <Text mb={5}>{user.kategori}</Text>
                  </VStack>
                  <VStack>
                    <Text fontWeight={'bold'}>Style</Text>
                    <Text mb={5}>{user.style.toString()}</Text>
                  </VStack>
                </HStack>
                <Text fontWeight={'bold'}>Coin</Text>
                <Text mb={5}>{user.coin}</Text>
              </Box>
            ) : (
              <Box p={10} w={'100%'}>
                <Text fontWeight={'bold'}>Biodata</Text>
                <TextArea
                  mb={5}
                  multiline
                  onChangeText={text => setKeterangan(text)}>
                  {user.keterangan}
                </TextArea>
                <Text fontWeight={'bold'}>Alamat</Text>
                <Input mb={5} onChangeText={text => setAlamat(text)}>
                  {user.alamat}
                </Input>
                <Text fontWeight={'bold'}>Rate</Text>
                <Input
                  mb={5}
                  keyboardType="numeric"
                  onChangeText={text => setRate(text)}>
                  {user.rate}
                </Input>
                <HStack justifyContent={'space-between'}>
                  <VStack>
                    <Text fontWeight={'bold'}>Jenis Makeup</Text>
                    <Select
                      selectedValue={kategori === '' ? user.kategori : kategori}
                      minWidth={150}
                      accessibilityLabel="Pilih Kategori"
                      placeholder="Pilih Kategori"
                      _selectedItem={{
                        bg: '#F47C7C',
                      }}
                      mt={1}
                      onValueChange={itemValue => setKategori(itemValue)}>
                      <Select.Item label="Wedding" value="Wedding" />
                      <Select.Item label="Graduation" value="Graduation" />
                      <Select.Item label="Event" value="Event" />
                      <Select.Item label="Daily" value="Daily" />
                    </Select>
                  </VStack>
                  <VStack>
                    <Text fontWeight={'bold'}>Style</Text>
                    <Checkbox.Group
                      colorScheme={'warning'}
                      onChange={setStyle}
                      value={style.length === 0 ? user.style : style}
                      accessibilityLabel="pilih style">
                      <Checkbox value="Natural" mb={2}>
                        Natural
                      </Checkbox>
                      <Checkbox value="Bold" mb={2}>
                        Bold
                      </Checkbox>
                      <Checkbox value="Korean" mb={2}>
                        Korean
                      </Checkbox>
                      <Checkbox value="Western" mb={2}>
                        Western
                      </Checkbox>
                    </Checkbox.Group>
                  </VStack>
                </HStack>
              </Box>
            )}
          </ScrollView>
          <Button.Group justifyContent={'space-between'}>
            <Button
              m={2}
              w={'45%'}
              onPress={handleEdit}
              backgroundColor={'#F47C7C'}
              borderRadius={5}
              size={'md'}
              _text={{fontWeight: 'extrabold'}}>
              {editMode == true ? 'Save' : 'Edit'}
            </Button>
            <Button
              m={2}
              w={'45%'}
              onPress={() =>
                auth()
                  .signOut()
                  .then(() => navigation.replace('Splash'))
              }
              backgroundColor={'#F47C7C'}
              borderRadius={5}
              size={'md'}
              _text={{fontWeight: 'extrabold'}}>
              Sign Out
            </Button>
          </Button.Group>
        </>
      ) : (
        <Center flex={1}>
          <Spinner />
        </Center>
      )}
    </Box>
  );
}
