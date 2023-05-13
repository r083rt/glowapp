import React, {useState, useEffect} from 'react';
import {
  Box,
  Center,
  Text,
  FormControl,
  Stack,
  Image,
  WarningOutlineIcon,
  Input,
  Button,
  Spacer,
  Modal,
  Heading,
} from 'native-base';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function RegisterUser({navigation}) {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  handleRegister = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(cred => {
        const uid = cred.user.uid;
        console.log('UID : ', uid);
        firestore().collection('users').doc(uid).set({
          nama: name,
          alamat: address,
          role: 'pelanggan',
          telp: phone,
          coin: 0,
          foto: '',
        });

        // Toast.show({
        //   type: 'success',
        //   text1: 'Success Create Account.',
        // });

        auth()
          .signOut()
          .then(() => navigation.replace('Splash'));
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  return (
    <Box flex={1} bgColor={'#FFF'}>
      <Center flex={1}>
        <Heading size={'xl'} style={{marginBottom: 20}} color={'#F47C7C'}>
          Registration
        </Heading>
        <FormControl isRequired>
          <Stack mx="4" space={2}>
            <Text color={'#F47C7C'}>EMAIL</Text>
            <Input
              textDecorationColor={'#F47C7C'}
              placeholder="Input Email"
              placeholderTextColor={'#EF9F9F'}
              borderColor={'#EF9F9F'}
              focusOutlineColor={'#F47C7C'}
              backgroundColor={'#FFF2F2'}
              isRequired
              size={'sm'}
              onChangeText={value => {
                setEmail(value);
              }}
            />
            <Text color={'#F47C7C'}>Password</Text>
            <Input
              // InputRightElement={}
              type="password"
              textDecorationColor={'#F47C7C'}
              focusOutlineColor={'#F47C7C'}
              placeholder="Input Password"
              borderColor={'#EF9F9F'}
              placeholderTextColor={'#EF9F9F'}
              backgroundColor={'#FFF2F2'}
              isRequired
              size={'sm'}
              onChangeText={value => {
                setPassword(value);
              }}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}>
              Atleast 6 characters are required.
            </FormControl.ErrorMessage>
            <Text color={'#F47C7C'}>Name</Text>
            <Input
              textDecorationColor={'#F47C7C'}
              placeholder="Input your name"
              placeholderTextColor={'#EF9F9F'}
              borderColor={'#EF9F9F'}
              focusOutlineColor={'#F47C7C'}
              backgroundColor={'#FFF2F2'}
              isRequired
              size={'sm'}
              onChangeText={value => {
                setName(value);
              }}
            />
            <Text color={'#F47C7C'}>Address</Text>
            <Input
              textDecorationColor={'#F47C7C'}
              placeholder="Input your address"
              placeholderTextColor={'#EF9F9F'}
              borderColor={'#EF9F9F'}
              focusOutlineColor={'#F47C7C'}
              backgroundColor={'#FFF2F2'}
              isRequired
              size={'sm'}
              onChangeText={value => {
                setAddress(value);
              }}
            />
            <Text color={'#F47C7C'}>Phone</Text>
            <Input
              textDecorationColor={'#F47C7C'}
              placeholder="Input your phone number"
              placeholderTextColor={'#EF9F9F'}
              borderColor={'#EF9F9F'}
              focusOutlineColor={'#F47C7C'}
              backgroundColor={'#FFF2F2'}
              isRequired
              size={'sm'}
              onChangeText={value => {
                setPhone(value);
              }}
            />
            <Button
              mt={10}
              backgroundColor={'#F47C7C'}
              borderRadius={5}
              onPress={handleRegister}
              size={'md'}
              isLoading={isLoading}
              _text={{fontWeight: 'extrabold'}}
              isLoadingText={'Please wait ...'}>
              Register
            </Button>
          </Stack>
        </FormControl>
      </Center>
    </Box>
  );
}
