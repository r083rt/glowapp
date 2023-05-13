import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Box, Center, Text, Image} from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
export default function Splash({navigation}) {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        const uid = user.uid;

        firestore()
          .collection('users')
          .doc(uid)
          .get()
          .then(u => {
            const role = u.data().role;
            if (role === 'pelanggan') {
              navigation.replace('Dashboard', {
                user: u.data(),
              });
            } else if (role === 'mua') {
              firestore()
                .collection('mua')
                .doc(uid)
                .get()
                .then(mua => {
                  navigation.replace('MUADashboard', {
                    user: mua.data(),
                  });
                });
            } else if (role === 'admin') {
              navigation.replace('AdminDashboard', {user: u.data()});
            }
          });
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
