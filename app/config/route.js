import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Splash from '../screens/SplashScreen';
import Login from '../screens/LoginScreen';
import Dashboard from '../screens/DashboardScreen';
import MUAProfile from '../screens/MUAProfileScreen';

import RegisterUser from '../screens/RegisterUserScreen';
import UserProfile from '../screens/UserProfileScreen';

import MUADashboard from '../screens/MUADashboardScreen';
import MUAPorto from '../screens/MUAPortoScreen';
import AdminDashboard from '../screens/AdminDashboardScreen';

import Chat from '../screens/ChatScreen';

import Payment from '../screens/PaymentScreen';

//MUA
import MUAHome from '../screens/mua/MUAHomeScreen';
import MUAChat from '../screens/MUAChatScreen';
import MUADetails from '../screens/MUADetailScreen';

import PromoDetail from '../screens/PromoScreen';

//Customer

//Admin

const Stack = createStackNavigator();

function MainStackNavigator({navigation, route}) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterUser"
          component={RegisterUser}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MUADashboard"
          component={MUADashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MUAPorto"
          component={MUAPorto}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MUAProfile"
          component={MUAProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PromoDetail"
          component={PromoDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MUAChat"
          component={MUAChat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MUADetails"
          component={MUADetails}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainStackNavigator;
