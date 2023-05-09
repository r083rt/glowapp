import React from 'react';
import {Text, HStack, VStack, Box, Button, Image} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';

const ListMua = ({onPressItem, data}) => {
  const renderItem = ({item, index}) => {
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

          <Text fontWeight={'bold'} fontSize={18} mt={2}>
            {item.nama}
          </Text>
          <Text>{item.kategori}</Text>
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
