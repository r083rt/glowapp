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
} from 'native-base';
import {Image, Dimensions} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import {ListPorto} from '../components';

export default function MUAProfile({navigation, route}) {
  const _width = Dimensions.get('screen').width;
  const _height = Dimensions.get('screen').height;
  const data = route.params.data;
  const [porto, setPorto] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('porto')
      .where('uid', '==', route.params.data.uid)
      .onSnapshot(querySnapshot => {
        const p = [];
        querySnapshot.forEach(documentSnapshot => {
          p.push(documentSnapshot.data());
        });
        setPorto(p);
        setLoading(false);
      });
    return unsubscribe;
  }, [porto, setPorto]);

  return (
    <Box flex={1}>
      <ScrollView flex={1} p={10} bgColor={'#FFF2F2'}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
            <TouchableOpacity>
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
          <ListPorto data={porto} />
        )}
      </ScrollView>
      <Button
        m={5}
        backgroundColor={'#F47C7C'}
        borderRadius={10}
        size={'md'}
        _text={{fontWeight: 'extrabold'}}
        isLoadingText={'Harap Tunggu ...'}>
        Book Appointment
      </Button>
    </Box>
  );
}
