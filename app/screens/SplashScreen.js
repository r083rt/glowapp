import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Box, Center, Text, Image} from 'native-base';
import auth from '@react-native-firebase/auth';
export default function Splash({navigation}) {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      console.log('user : ', user);
      if (user) {
        navigation.replace('Dashboard');
      } else {
        navigation.replace('Login');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Box flex={1} bgColor={'#FFFFFF'}>
      <Center flex={1}>
        <Image
          alt={'glow_app'}
          width={220}
          height={220}
          source={require('../assets/logo.png')}
        />
      </Center>
    </Box>
  );
}
