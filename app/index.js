import React, {useState, useEffect} from 'react';
import {NativeBaseProvider, extendTheme, Root, Box, Center} from 'native-base';
import {StatusBar, LogBox} from 'react-native';
import Navigator from './config/route';
import Toast from 'react-native-toast-message';
export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(async () => {
    // setIsLoaded(true);
  }, []);
  LogBox.ignoreAllLogs();
  const theme = extendTheme({
    components: {
      Heading: {
        baseStyle: ({colorMode}) => {
          return {
            color: colorMode === 'dark' ? '#F47C7C' : '#F47C7C',
            opacity: 0.9,
            // fontWeight: "normal",
          };
        },
      },
      Text: {
        baseStyle: ({colorMode}) => {
          return {
            color: colorMode === 'dark' ? '#F47C7C' : '#F47C7C',
            fontWeight: 'normal',
          };
        },
      },
    },
    fontConfig: {
      Poppins: {
        100: {
          normal: 'Poppins-Reguler',
          italic: 'Poppins-BookItalic',
        },
        200: {
          normal: 'Poppins-Reguler',
          italic: 'Poppins-BookItalic',
        },
        300: {
          normal: 'Poppins-Reguler',
          italic: 'Poppins-BookItalic',
        },
        400: {
          normal: 'Poppins-Reguler',
          italic: 'Poppins-Italic',
        },
        500: {
          normal: 'Poppins-Reguler',
        },
        600: {
          normal: 'Poppins-Bold',
          italic: 'Poppins-MediumItalic',
        },

        700: {
          normal: 'Poppins-Bold',
        },
        800: {
          normal: 'Poppins-ExtraBold',
          italic: 'Poppins-ExtraBoldItalic',
        },
        900: {
          normal: 'Poppins-ExtraBold',
          italic: 'Poppins-ExtraBoldItalic',
        },
      },
    },

    fonts: {
      heading: 'Poppins',
      body: 'Poppins',
      mono: 'Poppins',
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Box flex={1}>
        <Navigator />
      </Box>
      <Toast />
    </NativeBaseProvider>
  );
}
