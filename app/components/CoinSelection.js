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
            onSelectValue(100);
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
            100
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
      <Input
        placeholder="nominal lainnya"
        keyboardType="numeric"
        mt={5}
        onChangeText={value => {
          onSelectValue(value);
        }}
      />
      <Box p={2} mt={4}>
        <Text fontStyle={'italic'}>Note : 1 Coin = Rp 1.000</Text>
      </Box>
    </>
  );
};

export default CoinSelection;
