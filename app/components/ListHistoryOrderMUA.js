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
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
const ListHistoryOrderMUA = ({data}) => {
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
        <Text fontSize={10}>{item.tanggal + ' ' + item.jam}</Text>

        <HStack justifyContent={'space-between'}>
          <VStack space={1}>
            <Text fontWeight="bold" fontSize={15}>
              {item.nama}
            </Text>
            <Text>{nominal}</Text>
          </VStack>
        </HStack>
      </VStack>
    );
  };

  return (
    <FlatList
      horizontal
      ListEmptyComponent={() => {
        return (
          <Box w={'100%'}>
            <Text textAlign={'center'}>- Belum ada history order -</Text>
          </Box>
        );
      }}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id + item.tanggal + item.jam}
    />
  );
};

export default ListHistoryOrderMUA;
