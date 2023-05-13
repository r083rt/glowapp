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
import {ListMua, ListPromo} from '../components';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {TouchableOpacity} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import numeral from 'numeral';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashBoard({navigation, route}) {
  const _width = Dimensions.get('screen').width;
  const _height = Dimensions.get('screen').height;
  const [loading, setLoading] = useState(true); // Set loading to true on component mount

  const [activeSlide, setActiveSlide] = useState(0);
  const [promos, setPromos] = useState([]);
  const [motm, setMOTM] = useState(null);
  const [muas, setMUAS] = useState([]);
  const [search, setSearch] = useState([]);
  const [tips, setTips] = useState([]);
  const user = route.params.user;

  useEffect(() => {
    const getMUA = async () => {
      try {
        const querySnapshot = await firestore().collection('mua').get();
        const newData = [];
        querySnapshot.forEach(doc => {
          newData.push(doc.data());
        });
        setMUAS(newData);
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
        setMOTM(newData[0]);
      } catch (error) {
        console.log('Error getting documents: ', error);
      }
    };
    const getPromo = async () => {
      try {
        const querySnapshot = await firestore().collection('promo').get();
        const newData = [];
        querySnapshot.forEach(doc => {
          newData.push(doc.data().gambar);
        });
        setPromos(newData);
      } catch (error) {
        console.log('Error getting documents: ', error);
      }
    };
    getPromo();
    getMOTM();
    getMUA();
  }, []);

  const handleChooseMUA = e => {
    navigation.navigate('MUAProfile', {
      data: e,
      coin: user.coin,
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
        <Input
          InputLeftElement={
            <FontAwesomeIcon
              color={'#EF9F9F'}
              name="search"
              size={17}
              style={{marginLeft: 10}}
            />
          }
          type="Input"
          mb={5}
          borderRadius={10}
          placeholder="Search Make Up Artists"
          placeholderTextColor={'#EF9F9F'}
          borderColor={'#EF9F9F'}
          focusOutlineColor={'#F47C7C'}
          backgroundColor={'#FFFFFF'}
          isRequired
          size={'sm'}
          onChangeText={value => {}}
        />

        <Carousel
          autoplayInterval={3000}
          autoplay
          loop
          data={promos}
          renderItem={({item}) => (
            <Image
              borderRadius={10}
              source={{uri: item}}
              style={{width: _width * 0.9, height: 200}}
            />
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
                      width: _width * 0.3,
                      height: _width * 0.35,
                      resizeMode: 'cover',
                    }}
                  />
                </Box>
                <VStack space={3}>
                  <Heading size={'lg'}>{motm.nama}</Heading>
                  <Text w={220} numberOfLines={3} fontSize={13}>
                    {motm.keterangan}
                  </Text>
                  <TouchableOpacity onPress={() => {}}>
                    <Text fontWeight={500}>Lihat Profile</Text>
                  </TouchableOpacity>
                </VStack>
              </HStack>
            </>
          )}
        </Box>
        <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
        <Box w={_width} mb={20}>
          {muas === null ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <>
              <Heading size={'md'}>Makeup Artis</Heading>
              <Box h={3} />
              <ListMua data={muas} onPressItem={handleChooseMUA} />
            </>
          )}
        </Box>
        <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
      </VStack>
    </ScrollView>
  );
}
