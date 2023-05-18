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
const ListAppointment = ({onPressItem, data}) => {
  const renderItem = ({item, index}) => {
    return (
      <Box>
        <Text>{item.tanggal + ' ' + item.jam}</Text>

        <HStack justifyContent={'space-between'}>
          <VStack space={1}>
            <Text fontWeight="bold">{item.mua_name}</Text>
            <Text>{item.kategori}</Text>
            <Text>{item.status_pekerjaan}</Text>
          </VStack>

          <Button
            h={38}
            _text={{fontWeight: 'bold'}}
            size={'xs'}
            width={100}
            leftIcon={
              <IoniconsIcon
                size={20}
                name="chatbox-ellipses-outline"
                color={'#FFF'}
              />
            }
            backgroundColor={'#F47C7C'}
            onPress={() => {
              onPressItem(item);
            }}>
            Chat
          </Button>
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

export default ListAppointment;
