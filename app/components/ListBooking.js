import React from 'react';
import {Text, HStack, VStack, Box, Button, Image} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
const ListBooking = ({onPressItem, data}) => {
  const renderItem = ({item, index}) => {
    return (
      <VStack space={3} bgColor={'#FFF'} mb={5} px={6} py={3} borderRadius={10}>
        <TouchableOpacity
          onPress={() => {
            onPressItem(item);
          }}>
          <HStack alignContent={'space-between'}>
            <Box w={'70%'}>
              <Text fontWeight={'bold'} fontSize={18}>
                {item.nama}
              </Text>
              <HStack space={4} alignItems={'center'}>
                <FontAwesomeIcon name={'calendar'} color={'#F47C7C'} />
                <Text>{item.tanggal}</Text>
              </HStack>
              <HStack space={4} alignItems={'center'}>
                <FontAwesomeIcon name={'clock-o'} color={'#F47C7C'} />
                <Text>{item.jam}</Text>
              </HStack>
            </Box>
            <Box w={'25%'}>
              <Text fontWeight={'bold'}>Status</Text>
              <Text>{item.status_bayar}</Text>
            </Box>
          </HStack>
        </TouchableOpacity>
      </VStack>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

export default ListBooking;
