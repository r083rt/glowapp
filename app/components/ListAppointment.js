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
const ListAppointment = ({onPressItem, data}) => {
  const renderItem = ({item, index}) => {
    return (
      <Box>
        <Text>{item.tanggal + ' ' + item.jam}</Text>

        <HStack justifyContent={'space-between'}>
          <Text fontWeight="bold">{item.mua_name}</Text>
          <Text>{item.kategori}</Text>
        </HStack>
        <Text>{item.status_pekerjaan}</Text>
        <Divider my={2} bgColor={'#EF9F9F'} opacity={0.3} />
      </Box>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id + item.tanggal + item.jam}
    />
  );
};

export default ListAppointment;
