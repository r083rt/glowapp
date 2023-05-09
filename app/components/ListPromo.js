import React from 'react';
import {Text, HStack, VStack, Box, Button} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';

const ListPromo = ({onView, data}) => {
  const renderItem = ({item, index}) => {
    return (
      <Box
        style={{
          height: 50,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>Judul: {item.judul}</Text>
        <Text>Keterangan: {item.keterangan}</Text>
      </Box>
    );
  };

  return (
    <FlatList
      data={promos}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

export default ListPromo;
