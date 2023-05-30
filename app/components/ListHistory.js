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
const ListHistory = ({data}) => {
  const renderItem = ({item, index}) => {
    return (
      <Box>
        <Text fontSize={10}>{item.data.tanggal + ' ' + item.data.jam}</Text>

        <HStack justifyContent={'space-between'}>
          <VStack space={1}>
            <Text fontWeight="bold" fontSize={15}>
              {item.data.mua_name}
            </Text>
            <Text>Kategori : {item.data.kategori}</Text>
            <Text>Status : {item.data.status_pekerjaan}</Text>
          </VStack>
        </HStack>
        {index != data.length - 1 ? (
          <Divider my={2} bgColor={'#EF9F9F'} opacity={0.3} />
        ) : null}
      </Box>
    );
  };

  return (
    <FlatList
      ListEmptyComponent={() => {
        return (
          <Box w={'100%'}>
            <Text textAlign={'center'}>- Belum ada appointment -</Text>
          </Box>
        );
      }}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id + item.tanggal + item.jam}
    />
  );
};

export default ListHistory;
