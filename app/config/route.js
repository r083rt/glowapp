import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Splash from '../screens/SplashScreen';
import Login from '../screens/LoginScreen';
import Dashboard from '../screens/DashboardScreen';
import MUAProfile from '../screens/MUAProfileScreen';

import MUADashboard from '../screens/MUADashboardScreen';
import MUAPorto from '../screens/MUAPortoScreen';
import AdminDashboard from '../screens/AdminDashboardScreen';

//MUA
import MUAHome from '../screens/mua/MUAHomeScreen';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainStackNavigator;
