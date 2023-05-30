import React from 'react';
import {Text, HStack, VStack, Box, Button, Center} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
const ListCoinRequest = ({onPressItem, data}) => {
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
        <Box w={'100%'}>
          <Text>{moment(item.tanggal).format('DD MMM YYYY')}</Text>
          <Text>{'ID : ' + item.booking_id.toUpperCase()}</Text>
          <Text fontWeight={'bold'} fontSize={18}>
            {item.mua_name}
          </Text>
          <Text fontWeight={'bold'}>{nominal + ' coin'}</Text>
        </Box>
        <Button
          _text={{fontWeight: 'bold', fontSize: 14}}
          size={'xs'}
          bgColor={'#F47C7C'}
          onPress={() => {
            onPressItem(item);
          }}>
          Cairkan
        </Button>
      </VStack>
    );
  };

  return (
    <FlatList
      ListEmptyComponent={() => {
        return (
          <Box w={'100%'}>
            <Text textAlign={'center'}>
              Belum ada permintaan pencairan coin.
            </Text>
          </Box>
        );
      }}
      showsHorizontalScrollIndicator={false}
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.uid}
    />
  );
};

export default ListCoinRequest;
