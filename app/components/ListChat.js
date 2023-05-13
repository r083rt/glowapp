import React from 'react';
import {Text, HStack, VStack, Box, Button, Image} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
const ListChat = ({onPressItem, data}) => {
  const renderItem = ({item, index}) => {
    return (
      <VStack
        // w={100}
        shadow={2}
        space={3}
        bgColor={'#FFF'}
        mb={2}
        px={6}
        py={3}
        mr={3}
        borderRadius={10}>
        <TouchableOpacity
          onPress={() => {
            onPressItem(item);
          }}>
          <Box w={'100%'}>
            <Text fontWeight={'bold'} fontSize={18}>
              {item.name}
            </Text>
            <Text>
              {moment(item.createdAt.toDate()).format('DD MMM YYYY HH:mm:ss')}
            </Text>
          </Box>
        </TouchableOpacity>
      </VStack>
    );
  };

  return (
    <FlatList
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.createdAt}
    />
  );
};

export default ListChat;
