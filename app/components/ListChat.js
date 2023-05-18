import React from 'react';
import {Text, HStack, VStack, Box, Button, Image} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
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
        <Box w={'100%'}>
          <Text fontSize={10}>
            {moment(item.createdAt.toDate()).format('DD MMM YYYY HH:mm:ss')}
          </Text>
          <Text fontWeight={'bold'} fontSize={18}>
            {item.name}
          </Text>

          <Button
            _text={{fontWeight: 'bold'}}
            size={'xs'}
            width={100}
            leftIcon={
              <IoniconsIcon
                size={15}
                name="chatbox-ellipses-outline"
                color={'#FFF'}
              />
            }
            backgroundColor={'#F47C7C'}
            onPress={() => {
              onPressItem(item);
            }}>
            {'Chat ' + item.name}
          </Button>
        </Box>
      </VStack>
    );
  };

  return (
    <FlatList
      ListEmptyComponent={() => {
        return (
          <Box w={'100%'}>
            <Text textAlign={'center'}>Belum ada pesan baru</Text>
          </Box>
        );
      }}
      showsHorizontalScrollIndicator={false}
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.createdAt}
    />
  );
};

export default ListChat;
