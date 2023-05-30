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
const ListAppointment = ({onPressItem, data, onCancelItem}) => {
  const renderItem = ({item, index}) => {
    return (
      <Box>
        <Text>{item.data.tanggal + ' ' + item.data.jam}</Text>

        <HStack justifyContent={'space-between'}>
          <VStack space={1}>
            <Text fontWeight="bold">{item.data.mua_name}</Text>
            <Text>{item.data.kategori}</Text>
            <Text>{item.data.status_pekerjaan}</Text>
          </VStack>
        </HStack>
        <Button.Group mt={5}>
          <Button
            h={38}
            _text={{fontWeight: 'bold'}}
            size={'xs'}
            width={100}
            leftIcon={<IoniconsIcon size={20} name="close" color={'#FFF'} />}
            backgroundColor={'#F47C7C'}
            onPress={() => {
              onCancelItem(item.id);
            }}>
            Batal
          </Button>
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
              onPressItem(item.data);
            }}>
            Chat
          </Button>
        </Button.Group>
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

export default ListAppointment;
