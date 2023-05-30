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
  Image,
} from 'native-base';
import moment from 'moment';
import {Dimensions} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import {ListMua, ListFilter} from '../components';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {TouchableOpacity} from 'react-native-gesture-handler';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import numeral from 'numeral';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashBoard({navigation, route}) {
  const _width = Dimensions.get('screen').width;
  const _height = Dimensions.get('screen').height;

  const [loading, setLoading] = useState(true); // Set loading to true on component mount

  const [chatData, setChatData] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [promos, setPromos] = useState([]);
  const [motm, setMOTM] = useState(null);
  const [muas, setMUAS] = useState([]);
  const [filterKategori, setFilterKategori] = useState('');
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState([]);
  const [tips, setTips] = useState([]);
  const user = route.params.user;

  const getData = () => {
    firestore()
      .collectionGroup('messages')
      .get()
      .then(querySnapshot => {
        const data = [];
        const groupedData = {};
        const responseTimes = {};
        const responseTimePercentage = {};
        querySnapshot.forEach(doc => {
          d = doc.data();
          if (d.senderId != undefined) {
            const momentObj = moment(d.createdAt.toDate());

            // Format the moment object to the desired date string
            const dateString = momentObj.format('YYYY-MM-DD HH:mm:ss');
            data.push({
              createdAt: dateString,
              senderId: d.senderId,
              senderName: d.senderName,
              receiverId: d.receiverId,
            });

            for (let i = 0; i < data.length - 1; i++) {
              const currentMessage = data[i];
              const nextMessage = data[i + 1];

              // Check if the receiverId matches and calculate the response time
              if (currentMessage.receiverId === nextMessage.senderId) {
                const responseTime =
                  new Date(nextMessage.createdAt) -
                  new Date(currentMessage.createdAt);

                // If the receiverId is not already a key in responseTimes, initialize it with an empty array
                if (!responseTimes[nextMessage.senderId]) {
                  responseTimes[nextMessage.senderId] = [];
                }

                // Push the response time to the array
                responseTimes[nextMessage.senderId].push(responseTime);
              }
            }

            // Calculate the percentage of response times that fall within a certain timeframe
            const timeframeInMilliseconds = 60000; // Example: 1 minute

            for (const senderId in responseTimes) {
              const responseTimesArray = responseTimes[senderId];

              const withinTimeframeCount = responseTimesArray.filter(
                time => time <= timeframeInMilliseconds,
              ).length;
              const percentage =
                (withinTimeframeCount / responseTimesArray.length) * 100;

              responseTimePercentage[senderId] = percentage.toFixed(2);
            }
          }
        });

        setChatData(responseTimePercentage);
      });
  };

  useEffect(() => {
    getData();
    getPromo();
    getMOTM();
    getMUA();
  }, []);
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
    firestore()
      .collection('booking')
      .get()
      .then(querySnapshot => {
        const newData = [];
        querySnapshot.forEach(doc => {
          newData.push(doc.data());
        });

        const counts = {};
        let maxCount = 0;
        let mostBookedMuaId = null;

        for (const booking of newData) {
          const muaId = booking.mua_id;
          counts[muaId] = (counts[muaId] || 0) + 1;

          if (counts[muaId] > maxCount) {
            maxCount = counts[muaId];
            mostBookedMuaId = muaId;
          }
        }
        console.log('Most booked MUA ID:', mostBookedMuaId);
        console.log('Number of bookings:', maxCount);
        firestore()
          .collection('mua')
          .doc(mostBookedMuaId)
          .get()
          .then(documentSnapshot => {
            if (documentSnapshot.exists) {
              const data = documentSnapshot.data();
              console.log('MUA Document Snapshot:', data);
              setMOTM(data);
              // Further processing of the MUA document snapshot
            } else {
              console.log('MUA document does not exist');
            }
          })
          .catch(error => {
            console.log('Error getting MUA document:', error);
          });
      });
  };

  // const getMOTM = async () => {
  //   try {
  //     const querySnapshot = await firestore()
  //       .collection('mua')
  //       .where('motm', '==', true)
  //       .get();
  //     const newData = [];
  //     querySnapshot.forEach(doc => {
  //       newData.push(doc.data());
  //     });
  //     setMOTM(newData[0]);
  //   } catch (error) {
  //     console.log('Error getting documents: ', error);
  //   }
  // };
  const getPromo = async () => {
    try {
      const querySnapshot = await firestore().collection('promo').get();
      const newData = [];
      querySnapshot.forEach(doc => {
        newData.push(doc.data());
      });

      setPromos(newData);
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  };

  const handleChooseMUA = e => {
    navigation.navigate('MUAProfile', {
      data: e,
      coin: user.coin,
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

  const handleFilterRate = async rate => {
    if (rate == 1) {
      const querySnapshot = await firestore()
        .collection('mua')
        .orderBy('rate', 'asc')
        .startAt(0)
        .endAt(300)
        .get();

      const newData = [];
      querySnapshot.forEach(doc => {
        newData.push(doc.data());
      });
      setMUAS(newData);
    } else if (rate == 2) {
      const querySnapshot = await firestore()
        .collection('mua')
        .orderBy('rate', 'asc')
        .startAt(300)
        .endAt(500)
        .get();

      const newData = [];
      querySnapshot.forEach(doc => {
        newData.push(doc.data());
      });
      setMUAS(newData);
    } else if (rate == 3) {
      const querySnapshot = await firestore()
        .collection('mua')
        .orderBy('rate', 'asc')
        .startAt(500)
        .endAt(1500)
        .get();

      const newData = [];
      querySnapshot.forEach(doc => {
        newData.push(doc.data());
      });
      setMUAS(newData);
    } else if (rate == 4) {
      const querySnapshot = await firestore()
        .collection('mua')
        .orderBy('rate', 'asc')
        .startAt(1500)
        .endAt(2500)
        .get();

      const newData = [];
      querySnapshot.forEach(doc => {
        newData.push(doc.data());
      });
      setMUAS(newData);
    }
  };

  const handleSearch = async () => {
    const str = search;
    const capitalizedStr = str.charAt(0).toUpperCase() + str.slice(1);
    const querySnapshot = await firestore()
      .collection('mua')
      .where('nama', '==', capitalizedStr)
      .get();

    const newData = [];
    querySnapshot.forEach(doc => {
      newData.push(doc.data());
    });
    setMUAS(newData);
    setFilterKategori('');
  };

  const handleChatWith = async e => {
    const nama = user.nama;
    const uid = await AsyncStorage.getItem('uid');

    navigation.navigate('Chat', {
      chatId: e.uid + uid,
      receiverId: e.uid,
      receiverName: e.nama,
      senderId: uid,
      senderName: nama,
    });
  };

  return (
    <ScrollView flex={1} mt={10} bgColor={'#FFF2F2'}>
      <VStack space={2} px={5}>
        <HStack space={6} mt={10}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UserProfile', {
                user: user,
              });
            }}>
            {user.foto != '' ? (
              <Avatar
                w={70}
                h={70}
                bg="#F47C7C"
                source={{
                  uri: user.foto,
                }}>
                {user.nama}
              </Avatar>
            ) : (
              <Avatar
                w={70}
                h={70}
                bg="#F47C7C"
                source={require('../assets/make-up.png')}>
                {user.nama}
              </Avatar>
            )}
          </TouchableOpacity>

          <VStack space={1}>
            <Heading fontWeight={'extrabold'} size={'xl'} color={'#F47C7C'}>
              Hi, {user.nama}
            </Heading>
            <HStack space={3}>
              <FontAwesomeIcon name={'coins'} size={16} color={'#F47C7C'} />
              <Text color={'#F47C7C'} fontWeight={'bold'}>
                {numeral(user.coin).format('0,0')}
              </Text>
            </HStack>
          </VStack>
        </HStack>
        <HStack space={3}>
          <Input
            w={250}
            h={39}
            placeholder="Cari makeup artis"
            bgColor={'#FFF'}
            onChangeText={text => {
              setSearch(text);
            }}
            InputRightElement={
              <TouchableOpacity onPress={handleSearch}>
                <FontAwesomeIcon
                  name="search"
                  size={18}
                  color={'#F47C7C'}
                  style={{marginRight: 10}}
                />
              </TouchableOpacity>
            }
          />
          <Button
            h={38}
            _text={{fontWeight: 'bold'}}
            size={'xs'}
            width={100}
            leftIcon={
              <IoniconsIcon
                size={20}
                name="chatbox-ellipses-outline"
                color={'#FFF'}
              />
            }
            backgroundColor={'#F47C7C'}
            onPress={() => {
              navigation.navigate('MUAChat', {
                user: user,
              });
            }}>
            Chat
          </Button>
        </HStack>
        {search == '' ? (
          <>
            <Carousel
              autoplayInterval={3000}
              autoplay
              loop
              data={promos}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('PromoDetail', {
                      promo: item,
                    });
                  }}>
                  <Image
                    borderRadius={10}
                    source={{uri: item.gambar}}
                    style={{width: _width * 0.9, height: 200}}
                  />
                </TouchableOpacity>
              )}
              sliderWidth={_width * 0.9}
              itemWidth={_width * 0.9}
              onSnapToItem={index => setActiveSlide(index)}
            />
            <Pagination
              dotsLength={promos.length}
              activeDotIndex={activeSlide}
              dotStyle={{
                backgroundColor: '#F47C7C',
                width: 10,
                height: 10,
                borderRadius: 5,
              }}
              inactiveDotStyle={{
                backgroundColor: '#EF9F9F',
                width: 10,
                height: 10,
                borderRadius: 5,
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
            <Divider mb={4} bgColor={'#EF9F9F'} opacity={0.3} />

            <Box w={_width}>
              {motm === null ? (
                <Center>
                  <Spinner />
                </Center>
              ) : (
                <>
                  <Heading size={'md'}>MUA of The Month</Heading>
                  <Box h={3} w={_width * 0.8} />
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
                    <VStack space={1}>
                      <Heading size={'lg'}>{motm.nama}</Heading>
                      <Text w={220} numberOfLines={3} fontSize={13}>
                        {motm.keterangan}
                      </Text>
                    </VStack>
                  </HStack>
                </>
              )}
            </Box>
            <HStack justifyContent={'space-between'} w={'90%'}>
              <Heading size={'md'}>Pilih Jenis Makeup</Heading>
            </HStack>
            <ListFilter
              setFilterKategori={filterKategori}
              onPressItem={handleKategori}
            />
            <Divider bgColor={'#EF9F9F'} opacity={0.3} />
          </>
        ) : null}

        <Box w={_width} mb={20}>
          {muas === null ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Button.Group my={10}>
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
                    Filter Style
                  </Button>
                  <Button
                    shadow={2}
                    bgColor={'#FFF'}
                    color={'#F47C7C'}
                    _text={{color: '#F47C7C', fontWeight: 'bold'}}
                    leftIcon={
                      <FontAwesomeIcon
                        name="coins"
                        size={20}
                        color={'#F47C7C'}
                      />
                    }
                    minW={100}
                    borderRadius={30}
                    onPress={() => setFilterType('filterrate')}>
                    Filter Rate
                  </Button>
                  <Button
                    shadow={2}
                    bgColor={'#FFF'}
                    color={'#F47C7C'}
                    _text={{color: '#F47C7C', fontWeight: 'bold'}}
                    leftIcon={
                      <FontAwesomeIcon
                        name="times"
                        size={20}
                        color={'#F47C7C'}
                      />
                    }
                    minW={100}
                    borderRadius={30}
                    onPress={getMUA}>
                    Reset
                  </Button>
                </Button.Group>
              </ScrollView>
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

              {filterType === 'filterrate' ? (
                <HStack space={2} mb={3}>
                  <Box p={2} px={3} bgColor={'#FFF'} borderRadius={30}>
                    <TouchableOpacity
                      onPress={() => {
                        handleFilterRate(1);
                      }}>
                      <Text color={'#F47C7C'}>{'< 300'}</Text>
                    </TouchableOpacity>
                  </Box>
                  <Box p={2} px={3} bgColor={'#FFF'} borderRadius={30}>
                    <TouchableOpacity
                      onPress={() => {
                        handleFilterRate(2);
                      }}>
                      <Text color={'#F47C7C'}>{'300 - 500'}</Text>
                    </TouchableOpacity>
                  </Box>
                  <Box p={2} px={3} bgColor={'#FFF'} borderRadius={30}>
                    <TouchableOpacity
                      onPress={() => {
                        handleFilterRate(3);
                      }}>
                      <Text color={'#F47C7C'}>{'500 - 1500'}</Text>
                    </TouchableOpacity>
                  </Box>
                  <Box p={2} px={3} bgColor={'#FFF'} borderRadius={30}>
                    <TouchableOpacity
                      onPress={() => {
                        handleFilterRate(4);
                      }}>
                      <Text color={'#F47C7C'}>{'> 1500'}</Text>
                    </TouchableOpacity>
                  </Box>
                </HStack>
              ) : null}

              <ListMua
                data={muas}
                dataChat={chatData}
                onChat={handleChatWith}
                onPressItem={handleChooseMUA}
              />
            </>
          )}
        </Box>
        <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
      </VStack>
    </ScrollView>
  );
}
