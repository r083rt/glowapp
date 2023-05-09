import React from 'react';
import {Text, HStack, VStack, Box, Button, Image} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';

const ListTips = ({onView, data}) => {
  const renderItem = ({item, index}) => {
    return (
      <HStack space={3}>
        <TouchableOpacity onPress={() => {}}>
          <Image
            borderRadius={10}
            source={{uri: item.foto}}
            w={150}
            h={220}
            mr={5}
          />

          <Text fontWeight={'bold'} fontSize={18} mt={2}>
            {item.judul}
          </Text>
          <Text numberOfLines={3}>{item.isi}</Text>
          <Text>Selengkapnya</Text>
        </TouchableOpacity>
      </HStack>
    );
  };

  return (
    <FlatList
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

export default ListTips;
