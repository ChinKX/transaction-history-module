/**
 * @format
 */
import * as React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/components/App';
import {name as appName} from './app.json';
import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/stores/auth';

const Main = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <PaperProvider>
            <App />
          </PaperProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

AppRegistry.registerComponent(appName, () => Main);
