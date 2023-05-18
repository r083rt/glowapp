import React from 'react';
import {
  Text,
  HStack,
  VStack,
  Box,
  Button,
  Image,
  Input,
  Heading,
} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
const CoinSelection = ({onSelectValue, data}) => {
  return (
    <>
      <HStack space={3} justifyContent={'space-between'}>
        <TouchableOpacity
          onPress={() => {
            onSelectValue(150);
          }}>
          <Box
            borderRadius={10}
            bgColor={'#FFF2F2'}
            justifyContent={'center'}
            alignItems={'center'}
            w={75}
            h={50}
            p={4}
            _text={{fontWeight: 'bold'}}>
            150
          </Box>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onSelectValue(300);
          }}>
          <Box
            borderRadius={10}
            bgColor={'#FFF2F2'}
            justifyContent={'center'}
            alignItems={'center'}
            w={75}
            h={50}
            p={4}
            _text={{fontWeight: 'bold'}}>
            300
          </Box>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onSelectValue(600);
          }}>
          <Box
            borderRadius={10}
            bgColor={'#FFF2F2'}
            justifyContent={'center'}
            alignItems={'center'}
            w={75}
            h={50}
            p={4}
            _text={{fontWeight: 'bold'}}>
            600
          </Box>
        </TouchableOpacity>
      </HStack>
      <HStack space={3} mt={5} justifyContent={'space-between'}>
        <TouchableOpacity
          onPress={() => {
            onSelectValue(1000);
          }}>
          <Box
            borderRadius={10}
            bgColor={'#FFF2F2'}
            justifyContent={'center'}
            alignItems={'center'}
            w={75}
            h={50}
            p={4}
            _text={{fontWeight: 'bold'}}>
            1000
          </Box>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onSelectValue(1500);
          }}>
          <Box
            borderRadius={10}
            bgColor={'#FFF2F2'}
            justifyContent={'center'}
            alignItems={'center'}
            w={75}
            h={50}
            p={4}
            _text={{fontWeight: 'bold'}}>
            1500
          </Box>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onSelectValue(2000);
          }}>
          <Box
            borderRadius={10}
            bgColor={'#FFF2F2'}
            justifyContent={'center'}
            alignItems={'center'}
            w={75}
            h={50}
            p={4}
            _text={{fontWeight: 'bold'}}>
            2000
          </Box>
        </TouchableOpacity>
      </HStack>

      <Box p={2} mt={4}>
        <Text fontWeight={'bold'}>Topup 1000 - Disc 3%</Text>
        <Text fontWeight={'bold'}>Topup 1500 - Disc 5%</Text>
        <Text fontWeight={'bold'}>Topup 2000 - Disc 7%</Text>
        <Text mt={4} fontStyle={'italic'}>
          Note : 1 Coin = Rp 1.000
        </Text>
      </Box>
    </>
  );
};

export default CoinSelection;
