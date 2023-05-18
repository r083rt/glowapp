import React, {memo} from 'react';
import {Text, HStack, VStack, Box, Divider, Button, Image} from 'native-base';
import {TouchableOpacity, FlatList} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
const ListMua = ({onPressItem, onChat, data}) => {
  const renderItem = ({item, index}) => {
    const rate = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(parseInt(item.rate));
    const styles = item.style.toString();

    return (
      <Box w={'100%'}>
        <HStack space={4} w={'100%'}>
          <TouchableOpacity
            onPress={() => {
              onPressItem(item);
            }}>
            <Image
              borderRadius={10}
              source={{uri: item.foto}}
              w={100}
              h={100}
              mr={5}
            />
          </TouchableOpacity>
          <VStack>
            <HStack justifyContent={'space-between'}>
              <Text fontWeight={'bold'} fontSize={20}>
                {item.nama}
              </Text>
            </HStack>
            <HStack space={3} alignItems={'center'}>
              <FontAwesomeIcon name={'coins'} color={'#F47C7C'} />
              <Text color={'#F47C7C'}>{rate}</Text>
            </HStack>
            <Text fontSize={12} fontWeight={'bold'}>
              {item.kategori}
            </Text>
            <Text fontSize={12}>{styles}</Text>
            <Button
              mt={3}
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
                onChat(item);
              }}>
              {'Chat ' + item.nama}
            </Button>
          </VStack>
        </HStack>

        <Divider my={4} bgColor={'#EF9F9F'} opacity={0.3} />
      </Box>
    );
  };

  return (
    <FlatList
      // showsHorizontalScrollIndicator={false}
      // horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.uid}
    />
  );
};

export default memo(ListMua);
