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
const ListTopup = ({onPressItem, data}) => {
  const renderItem = ({item, index}) => {
    const jumlah = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(parseInt(item.jumlah));
    return (
      <Box>
        <Text>{item.tanggal}</Text>
        <HStack justifyContent={'space-between'} mt={2}>
          <VStack>
            <Text fontWeight="bold">{item.jumlah / 1000} coin</Text>
            <Text>{jumlah}</Text>
          </VStack>

          <Text>
            {item.dikonfirmasi == false ? 'Waiting confimation' : 'Confirmed'}
          </Text>
        </HStack>

        <Divider my={2} bgColor={'#EF9F9F'} opacity={0.3} />
      </Box>
    );
  };

  return (
    <FlatList
      ListEmptyComponent={() => {
        return (
          <Box w={'100%'}>
            <Text textAlign={'center'}>Belum ada topup status</Text>
          </Box>
        );
      }}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.customer_id + item.jumlah.toString()}
    />
  );
};

export default ListTopup;
