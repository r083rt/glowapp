import React from 'react';
import {Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FlatList, Image, Text, VStack, Box, HStack} from 'native-base';
const _width = Dimensions.get('screen').width;
const items = [
  {
    id: 1,
    image: require('../assets/wedding.png'),
    label: 'Wedding',
  },
  {
    id: 2,
    image: require('../assets/graduation.png'),
    label: 'Graduation',
  },
  {
    id: 3,
    image: require('../assets/event.png'),
    label: 'Event',
  },
  {
    id: 4,
    image: require('../assets/daily.png'),
    label: 'Daily',
  },
];

const ListFilter = ({onPressItem, setFilterKategori}) => {
  const renderItem = ({item, index}) => {
    return (
      <Box
        mx={2}
        my={3}
        w={_width / 4}
        h={_width / 4}
        shadow={2}
        borderRadius={20}
        bgColor={setFilterKategori.label === item.label ? '#F47C7C' : '#FFF'}
        justifyContent={'center'}
        alignItems={'center'}>
        <TouchableOpacity
          onPress={() => {
            onPressItem(item);
          }}>
          <VStack justifyContent={'center'} alignItems={'center'}>
            <Image source={item.image} w={_width / 10} h={_width / 10} />
            <Text
              color={
                setFilterKategori.label === item.label ? '#FFF' : '#F47C7C'
              }>
              {item.label}
            </Text>
          </VStack>
        </TouchableOpacity>
      </Box>
    );
  };

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      horizontal
      style={{marginRight: 10, marginBottom: 10}}
    />
  );
};

export default ListFilter;
