import React from 'react';
import {Text, HStack, VStack, Box, Button, Image} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
const ListMua = ({onPressItem, data}) => {
  const renderItem = ({item, index}) => {
    const rate = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(parseInt(item.rate));
    return (
      <VStack space={3}>
        <TouchableOpacity
          onPress={() => {
            onPressItem(item);
          }}>
          <Image
            borderRadius={10}
            source={{uri: item.foto}}
            w={150}
            h={190}
            mr={5}
          />

          <Text fontWeight={'bold'} fontSize={20} mt={2}>
            {item.nama}
          </Text>
          <Text fontWeight={'bold'}>{item.kategori}</Text>
          <HStack space={3} mt={2}>
            <FontAwesomeIcon name={'coins'} color={'#F47C7C'} />
            <Text color={'#F47C7C'} fontWeight={'bold'}>
              {rate}
            </Text>
          </HStack>
        </TouchableOpacity>
      </VStack>
    );
  };

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.uid}
    />
  );
};

export default ListMua;
