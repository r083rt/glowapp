import React from 'react';
import {Text, HStack, VStack, Box, Button, Image} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
const ListBooking = ({onPressItem, data}) => {
  const renderItem = ({item, index}) => {
    const nominal = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(parseInt(item.nominal));
    return (
      <VStack
        shadow={2}
        space={3}
        bgColor={'#FFF'}
        mb={2}
        px={6}
        py={3}
        mr={3}
        borderRadius={10}>
        <TouchableOpacity
          onPress={() => {
            onPressItem(item);
          }}>
          <Box w={'100%'}>
            <Text fontWeight={'bold'} fontSize={18}>
              {item.nama}
            </Text>
            <HStack space={4} alignItems={'center'}>
              <FontAwesomeIcon name={'calendar'} color={'#F47C7C'} />
              <Text>
                {moment(item.tanggal).format('DD MMM YYYY')} - {item.jam}
              </Text>
            </HStack>
            <HStack space={4} alignItems={'center'}>
              <FontAwesomeIcon name={'user'} color={'#F47C7C'} />
              <Text fontWeight={'bold'}>{item.mua_name}</Text>
            </HStack>
            <HStack space={4} alignItems={'center'}>
              <FontAwesomeIcon name={'coins'} color={'#F47C7C'} />
              <Text fontWeight={'bold'}>{nominal}</Text>
            </HStack>
          </Box>
        </TouchableOpacity>
      </VStack>
    );
  };

  return (
    <FlatList
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id + item.tanggal + item.jam}
    />
  );
};

export default ListBooking;
