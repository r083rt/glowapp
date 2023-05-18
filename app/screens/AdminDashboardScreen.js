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
import {ListBooking, ListTopupAdmin, ListFilter, ListMua} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboard({navigation, route}) {
  const _width = Dimensions.get('screen').width;
  const _height = Dimensions.get('screen').height;
  const [trxID, setTrxID] = useState('');
  const [showModalTopup, setShowModalTopup] = useState(false);
  const [topups, setTopups] = useState([]);
  const [topupInfo, setTopupInfo] = useState({});
  const [booking, setBooking] = useState([]);
  const user = route.params.user;
  const [motm, setMOTM] = useState(null);
  const [muas, setMUAS] = useState([]);
  const [filterKategori, setFilterKategori] = useState('');
  const [filterType, setFilterType] = useState('');
  const handleKategori = async e => {
    const querySnapshot = await firestore()
      .collection('mua')
      .where('kategori', '==', e.label)
      .get();

    const newData = [];
    querySnapshot.forEach(doc => {
      newData.push(doc.data());
    });
    setMUAS(newData);
    setFilterKategori(e);
  };
  const getMUA = async () => {
    try {
      const querySnapshot = await firestore().collection('mua').get();
      const newData = [];
      querySnapshot.forEach(doc => {
        newData.push(doc.data());
      });

      setMUAS(newData);
      setFilterKategori('');
      setFilterType('');
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  };
  const getMOTM = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('mua')
        .where('motm', '==', true)
        .get();
      const newData = [];
      querySnapshot.forEach(doc => {
        newData.push(doc.data());
      });
      console.log(newData[0]);
      setMOTM(newData[0]);
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  };

  const getTopup = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('transaction')
        .where('dikonfirmasi', '==', false)
        .get();
      const newData = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        newData.push({uid: doc.id, ...data});
      });
      setTopups(newData);
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  };
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
  useEffect(() => {
    getMUA();
    getMOTM();
    getBooking();
    getTopup();
  }, []);

  const handleConfirm = async () => {
    topupcoin = parseInt(topupInfo.jumlah) / 1000;

    var coin = 0;
    const docRef = firestore().collection('users').doc(topupInfo.customer_id);

    await firestore().collection('transaction').doc(topupInfo.uid).update({
      dikonfirmasi: true,
    });

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

  const handleChatWith = async e => {
    const nama = user.nama;
    const uid = await AsyncStorage.getItem('uid');
    console.log({
      chatId: e.uid + uid,
      receiverId: e.uid,
      receiverName: e.nama,
      senderId: uid,
      senderName: nama,
    });
    navigation.navigate('Chat', {
      chatId: e.uid + uid,
      receiverId: e.uid,
      receiverName: e.nama,
      senderId: uid,
      senderName: nama,
    });
  };

  const handleSort = async sortType => {
    try {
      const querySnapshot = await firestore()
        .collection('mua')
        .orderBy('rate', sortType)
        .get();
      const newData = [];
      querySnapshot.forEach(doc => {
        newData.push(doc.data());
      });

      setMUAS(newData);
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  };

  const handleFilter = async style => {
    const querySnapshot = await firestore()
      .collection('mua')
      .where('style', 'array-contains', style)
      .get();

    const newData = [];
    querySnapshot.forEach(doc => {
      newData.push(doc.data());
    });
    setMUAS(newData);
  };

  const handleChooseMUA = e => {
    navigation.navigate('MUAProfile', {
      data: e,
      coin: user.coin,
    });
  };

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
        <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
        <Heading size={'md'}>MUA of The Month</Heading>
        {motm === null ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <HStack space={3} w={_width * 0.8}>
              <Box w={_width * 0.3} h={_width * 0.3}>
                <Image
                  source={{uri: motm.foto}}
                  borderRadius={10}
                  style={{
                    width: _width * 0.25,
                    height: _width * 0.25,
                    resizeMode: 'cover',
                  }}
                />
              </Box>
              <VStack space={3}>
                <Heading size={'lg'}>{motm.nama}</Heading>
                <Text w={220} numberOfLines={3} fontSize={13}>
                  {motm.keterangan}
                </Text>
              </VStack>
            </HStack>
          </>
        )}
        <HStack justifyContent={'space-between'} w={'90%'}>
          <Heading size={'md'}>Pilih Jenis Makeup</Heading>
        </HStack>
        <ListFilter
          setFilterKategori={filterKategori}
          onPressItem={handleKategori}
        />
        <Divider bgColor={'#EF9F9F'} opacity={0.3} />
        <Box w={_width} mb={20}>
          {muas === null ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <>
              <Button.Group my={3}>
                <Button
                  shadow={2}
                  bgColor={'#FFF'}
                  color={'#F47C7C'}
                  _text={{color: '#F47C7C', fontWeight: 'bold'}}
                  minW={100}
                  leftIcon={
                    <FontAwesomeIcon
                      name="sort-amount-down-alt"
                      size={20}
                      color={'#F47C7C'}
                    />
                  }
                  borderRadius={30}
                  onPress={() => setFilterType('rate')}>
                  Sort
                </Button>
                <Button
                  shadow={2}
                  bgColor={'#FFF'}
                  color={'#F47C7C'}
                  _text={{color: '#F47C7C', fontWeight: 'bold'}}
                  leftIcon={
                    <FontAwesomeIcon
                      name="filter"
                      size={20}
                      color={'#F47C7C'}
                    />
                  }
                  minW={100}
                  borderRadius={30}
                  onPress={() => setFilterType('style')}>
                  Filter
                </Button>
                <Button
                  shadow={2}
                  bgColor={'#FFF'}
                  color={'#F47C7C'}
                  _text={{color: '#F47C7C', fontWeight: 'bold'}}
                  leftIcon={
                    <FontAwesomeIcon name="times" size={20} color={'#F47C7C'} />
                  }
                  minW={100}
                  borderRadius={30}
                  onPress={getMUA}>
                  Reset
                </Button>
              </Button.Group>

              {filterType === 'rate' ? (
                <HStack space={2} mb={3}>
                  <Box p={2} px={3} bgColor={'#FFF'} borderRadius={30}>
                    <TouchableOpacity
                      onPress={() => {
                        handleSort('asc');
                      }}>
                      <Text color={'#F47C7C'}>Rate Terendah</Text>
                    </TouchableOpacity>
                  </Box>
                  <Box p={2} px={3} bgColor={'#FFF'} borderRadius={30}>
                    <TouchableOpacity
                      onPress={() => {
                        handleSort('desc');
                      }}>
                      <Text color={'#F47C7C'}>Rate Tertinggi</Text>
                    </TouchableOpacity>
                  </Box>
                </HStack>
              ) : null}

              {filterType === 'style' ? (
                <HStack space={2} mb={3}>
                  <Box p={2} px={3} bgColor={'#FFF'} borderRadius={30}>
                    <TouchableOpacity
                      onPress={() => {
                        handleFilter('Natural');
                      }}>
                      <Text color={'#F47C7C'}>Natural</Text>
                    </TouchableOpacity>
                  </Box>
                  <Box p={2} px={3} bgColor={'#FFF'} borderRadius={30}>
                    <TouchableOpacity
                      onPress={() => {
                        handleFilter('Bold');
                      }}>
                      <Text color={'#F47C7C'}>Bold</Text>
                    </TouchableOpacity>
                  </Box>
                  <Box p={2} px={3} bgColor={'#FFF'} borderRadius={30}>
                    <TouchableOpacity
                      onPress={() => {
                        handleFilter('Korean');
                      }}>
                      <Text color={'#F47C7C'}>Korean</Text>
                    </TouchableOpacity>
                  </Box>
                  <Box p={2} px={3} bgColor={'#FFF'} borderRadius={30}>
                    <TouchableOpacity
                      onPress={() => {
                        handleFilter('Western');
                      }}>
                      <Text color={'#F47C7C'}>Western</Text>
                    </TouchableOpacity>
                  </Box>
                </HStack>
              ) : null}

              <ListMua
                data={muas}
                onChat={handleChatWith}
                onPressItem={handleChooseMUA}
              />
            </>
          )}
        </Box>
      </VStack>
    </ScrollView>
  );
}
