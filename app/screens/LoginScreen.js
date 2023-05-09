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
  Heading,
} from 'native-base';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
export default function Login({navigation}) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async res => {
        const uid = res.user.uid;

        const user = await firestore().collection('users').doc(uid).get();

        const nama = user.data().nama;
        Toast.show({
          type: 'success',
          text1: 'Login Success',
          text2: 'Welcome back, ' + nama,
        });
        navigation.replace('Dashboard', {
          user: user,
        });
        // console.log(nama);
        // console.log('Loggin success!');
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
          GLOW APP
        </Heading>
        <FormControl isRequired>
          <Stack mx="4" space={2}>
            <Text color={'#F47C7C'}>EMAIL</Text>
            <Input
              type="Input"
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
            <Button
              backgroundColor={'#F47C7C'}
              borderRadius={10}
              onPress={handleLogin}
              size={'md'}
              isLoading={isLoading}
              _text={{fontWeight: 'extrabold'}}
              isLoadingText={'Harap Tunggu ...'}>
              SIGN IN
            </Button>
            <Spacer />
            <Text textAlign={'center'} color={'#F47C7C'}>
              Don’t have an account ?{' '}
              <Text fontWeight={'bold'}>Regiter Account</Text> disini
            </Text>
            <Text textAlign={'center'} fontWeight={'bold'} color={'#F47C7C'}>
              Forget Password
            </Text>
          </Stack>
        </FormControl>
      </Center>
    </Box>
  );
}
