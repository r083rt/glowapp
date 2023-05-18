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
  Modal,
} from 'native-base';
import Toast from 'react-native-toast-message';
import auth, {sendPasswordResetEmail} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
export default function Login({navigation}) {
  const [password, setPassword] = useState('123456');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogin = () => {
    if (email === '' || password === '') {
      Toast.show({
        type: 'error',
        text1: 'Attention',
        text2: 'Email and Password must not be empty',
      });
      return;
    }
    setIsLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async res => {
        const uid = res.user.uid;

        const user = await firestore().collection('users').doc(uid).get();

        const role = user.data().role;

        const nama = user.data().nama;
        const dataUID = ['uid', uid];
        const dataNama = ['nama', nama];
        await AsyncStorage.multiSet([dataUID, dataNama]);

        Toast.show({
          type: 'success',
          text1: 'Login Success',
          text2: 'Welcome back, ' + nama,
        });
        setIsLoading(false);
        if (role === 'pelanggan') {
          navigation.replace('Dashboard', {
            user: user.data(),
          });
        } else if (role === 'mua') {
          const mua = await firestore().collection('mua').doc(uid).get();
          navigation.replace('MUADashboard', {
            user: mua.data(),
          });
        } else if (role === 'admin') {
          navigation.replace('AdminDashboard', {
            user: user.data(),
          });
        }

        // console.log(nama);
        // console.log('Loggin success!');
      })
      .catch(error => {
        setIsLoading(false);
        if (error.code === 'auth/user-not-found') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'User not found!',
          });
        }

        if (error.code === 'auth/email-already-in-use') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'That email address is already in use!',
          });
          console.log('That email address is already in use!');
        }
        if (error.code === 'auth/wrong-password') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Wrong Password!',
          });
        }

        if (error.code === 'auth/invalid-email') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'That email address is invalid!',
          });
        }

        console.error(error);
      });
  };

  function handleResetPassword() {
    auth()
      .sendPasswordResetEmail(email)
      .then(
        Toast.show({
          type: 'success',
          text1: 'Reset Password Success',
          text2: 'Please check your inbox for the reset link.',
        }),
      );
  }

  return (
    <Box flex={1} bgColor={'#FFF'}>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Reset Password</Modal.Header>
          <Modal.Body>
            <Input
              onChangeText={text => setEmail(text)}
              placeholder="Type your email."
            />
            <Text fontSize={10} fontStyle={'italic'}>
              We will send the reset link to your email.
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                _text={{color: '#F47C7C'}}
                // colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}>
                Cancel
              </Button>
              <Button
                backgroundColor={'#F47C7C'}
                onPress={() => {
                  setShowModal(false);
                  handleResetPassword();
                }}>
                Reset
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
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
              isLoadingText={'Please wait ...'}>
              SIGN IN
            </Button>
            <Spacer />
            <TouchableOpacity
              onPress={() => navigation.navigate('RegisterUser')}>
              <Text textAlign={'center'} fontWeight={'bold'} color={'#F47C7C'}>
                Don't have an account ? Register now.
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Text textAlign={'center'} fontWeight={'bold'} color={'#F47C7C'}>
                Reset Password
              </Text>
            </TouchableOpacity>
          </Stack>
        </FormControl>
      </Center>
    </Box>
  );
}
