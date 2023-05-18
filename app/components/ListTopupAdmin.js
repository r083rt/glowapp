import React from 'react';
import {
  Text,
  HStack,
  VStack,
  Box,
  Button,
  Image,
  Heading,
  Divider,
} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
const ListTopupAdmin = ({onPressItem, data}) => {
  const renderItem = ({item, index}) => {
    const koin = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(parseInt(item.jumlah) / 1000);
    const jumlah = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(parseInt(item.jumlah));
    return (
      <Box bgColor={'#FFF'} p={2} mb={3} borderRadius={10} mr={4}>
        <TouchableOpacity
          onPress={() => {
            onPressItem(item);
          }}>
          <HStack justifyContent={'space-between'} mt={2}>
            <Text fontWeight={'bold'} fontSize={20}>
              {item.nama}
            </Text>
            <Text>{moment(item.tanggal).format('DD MMM YYYY')}</Text>
          </HStack>
          <HStack justifyContent={'space-between'}>
            <VStack>
              <Text fontWeight="bold">{koin} coin</Text>
              <Text>Rp {jumlah}</Text>
              <Text>{item.pembayaran}</Text>
            </VStack>

            <Text fontWeight={'bold'}>
              {item.dikonfirmasi == false ? 'Waiting confimation' : 'Confirmed'}
            </Text>
          </HStack>
        </TouchableOpacity>
      </Box>
    );
  };

  return (
    <FlatList
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.customer_id + item.jumlah.toString()}
    />
  );
};

export default ListTopupAdmin;
