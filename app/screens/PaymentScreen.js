import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  HStack,
  Heading,
  VStack,
  Center,
  Avatar,
  Button,
  Input,
  Spinner,
  FlatList,
  Divider,
  IconButton,
  ScrollView,
  Modal,
  TextField,
  Actionsheet,
  useDisclose,
} from 'native-base';

import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import {Image, Dimensions, TouchableOpacity} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {ListAppointment} from '../components';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import numeral from 'numeral';

export default function Payment({navigation, route}) {
  const [isLoading, setIsLoading] = useState(true);
  const {isOpen, onOpen, onClose} = useDisclose();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [payment, setPayment] = useState([]);
  const selectedCoin = route.params.coin;
  const [disc, setDisc] = useState(0);
  const [total, setTotal] = useState('');
  const nominal = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
  }).format(parseInt(route.params.coin));

  useEffect(() => {
    console.log(parseInt(route.params.coin) * 1000);
    const tot = parseInt(route.params.coin) * 1000;
    let discount = 0;
    if (selectedCoin === 1000) {
      discount = tot * 0.03;
    } else if (selectedCoin === 1500) {
      discount = tot * 0.05;
    } else if (selectedCoin === 2000) {
      discount = tot * 0.07;
    }
    setDisc(
      new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
      }).format(parseInt(discount)),
    );
    setTotal(
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(parseInt(route.params.coin) * 1000 - discount),
    );
    const getPaymentType = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('payment_type')
          .get();
        const newData = [];
        querySnapshot.forEach(doc => {
          newData.push(doc.data());
        });

        setPayment(newData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log('Error getting documents: ', error);
      }
    };
    getPaymentType();
  }, []);

  const handlePayment = async () => {
    if (selectedPayment != '') {
      const uid = await AsyncStorage.getItem('uid');
      const nama = await AsyncStorage.getItem('nama');

      const trxID = uid + moment('DDMMYYHHmm');
      try {
        setIsLoading(true);
        await firestore()
          .collection('transaction')
          .add({
            tanggal: moment().format('YYYY-MM-DD'),
            id: trxID,
            customer_id: uid,
            nama: nama,
            jenis: 'topup',
            jumlah: parseInt(route.params.coin) * 1000,
            dikonfirmasi: false,
            pembayaran: selectedPayment,
          });

        Toast.show({
          type: 'success',
          text1: 'Please wait for Admin to confirm your topup.',
          text2: 'Your transaction ID is ' + trxID,
        });
        setIsLoading(false);
        navigation.goBack();
      } catch (error) {
        setIsLoading(false);
        console.error('Error adding document: ', error);
      }
    } else {
      onOpen();
    }
  };
  return (
    <Box flex={1} bgColor={'#FFF2F2'} p={5}>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          {payment.map(p => {
            return (
              <Actionsheet.Item>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedPayment(p.nama);
                    onClose();
                  }}>
                  <HStack space={3}>
                    <Image
                      source={{uri: p.logo}}
                      borderRadius={10}
                      style={{
                        width: 50,
                        height: 30,
                        resizeMode: 'contain',
                      }}
                    />
                    <Text fontSize={15} fontWeight={'bold'}>
                      {p.nama}
                    </Text>
                  </HStack>
                </TouchableOpacity>
              </Actionsheet.Item>
            );
          })}
        </Actionsheet.Content>
      </Actionsheet>
      <Center flex={1}>
        <Heading mb={10}>Coin Topup Summary</Heading>
        <HStack space={4} justifyContent={'center'} alignItems={'center'}>
          <FontAwesomeIcon name={'coins'} size={26} color={'#F47C7C'} />
          <Heading>{nominal}</Heading>
        </HStack>
        {disc != 0 ? (
          <>
            <Text mt={10}>Discount</Text>
            <Heading>{disc}</Heading>
          </>
        ) : null}
        <Text mt={10}>Total Payment</Text>
        <Heading size="xl" mb={10}>
          {total}
        </Heading>
        {selectedPayment != '' ? (
          <>
            <Text mt={10}>Selected Payment Method</Text>
            <Heading size="md" mb={4}>
              {selectedPayment}
            </Heading>
            <Button
              h={30}
              p={1}
              px={3}
              borderRadius={10}
              onPress={onOpen}
              backgroundColor={'#F47C7C'}>
              Change payment
            </Button>
          </>
        ) : null}
      </Center>
      <Button
        m={5}
        isLoading={isLoading}
        isLoadingText="Please wait"
        backgroundColor={'#F47C7C'}
        borderRadius={10}
        onPress={() => {
          handlePayment();
        }}
        size={'md'}
        _text={{fontWeight: 'extrabold'}}>
        {selectedPayment != '' ? 'Pay' : 'Select Payment Method'}
      </Button>
    </Box>
  );
}
