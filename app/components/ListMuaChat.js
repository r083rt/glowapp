import React from 'react';
import {Text, HStack, VStack, Box, Button, Image} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';

const ListMuaChat = ({onPressItem, data}) => {
  const renderItem = ({item, index}) => {
    const rate = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(parseInt(item.rate));
    return (
      <Box p={5} borderRadius={10} bgColor={'#FFF'} mb={3}>
        <TouchableOpacity
          onPress={() => {
            onPressItem(item);
          }}>
          <HStack space={1} alignItems={'center'}>
            <Image
              borderRadius={70}
              source={{uri: item.foto}}
              w={60}
              h={60}
              mr={5}
            />
            <VStack>
              <Text fontWeight={'bold'} fontSize={20} mt={2}>
                {item.nama}
              </Text>
              <Text>{item.kategori} Makeup Artist</Text>
            </VStack>
          </HStack>
        </TouchableOpacity>
      </Box>
    );
  };

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.uid}
    />
  );
};

export default ListMuaChat;
