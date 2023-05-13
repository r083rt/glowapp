import React from 'react';
import {Text, HStack, VStack, Box, Button, Image} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';

const ListPorto = ({onPressItem, data}) => {
  const renderItem = ({item, index}) => {
    return (
      <VStack space={3} justifyContent={'space-between'} alignItems={'center'}>
        <TouchableOpacity
          onPress={() => {
            onPressItem(item);
          }}>
          <Image
            borderRadius={10}
            source={{uri: item.data.foto}}
            w={100}
            h={130}
            mr={3}
            mb={5}
          />
        </TouchableOpacity>
      </VStack>
    );
  };

  return (
    <FlatList
      numColumns={3}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

export default ListPorto;
