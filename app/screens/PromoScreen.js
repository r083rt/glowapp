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
import {Dimensions} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import {ListMua, ListFilter} from '../components';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {TouchableOpacity} from 'react-native-gesture-handler';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import numeral from 'numeral';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Promo({navigation, route}) {
  const promo = route.params.promo;
  const _width = Dimensions.get('screen').width;
  const _height = Dimensions.get('screen').height;

  return (
    <Box flex={1} bgColor={'#FFF2F2'}>
      <Box w={'100%'} h={_height * 0.3}>
        <Image
          source={{uri: promo.gambar}}
          style={{
            height: _height * 0.3,
            resizeMode: 'cover',
          }}
        />
      </Box>
      <Box p={4} w={_width}>
        <Heading>{promo.judul}</Heading>
        <Text>{promo.keterangan}</Text>
      </Box>
    </Box>
  );
}
