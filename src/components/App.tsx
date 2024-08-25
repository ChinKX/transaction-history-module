/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthScreen} from './Auth';
import {TransactionListScreen} from './Transaction-list';
import {Transaction} from '../stores/transaction';
import {TransactionDetailScreen} from './Transaction-detail';
import {useAuthStore} from '../stores/auth';
import {IconButton} from 'react-native-paper';
import {BlurView} from '@react-native-community/blur';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

export type AppScreenParamsList = {
  Auth: undefined;
  TransactionList: undefined;
  TransactionDetail: {
    transaction: Transaction;
  };
};

const Stack = createNativeStackNavigator<AppScreenParamsList>();

const App: React.FunctionComponent = () => {
  const [authState, {setLastActivity, logout}] = useAuthStore();

  const pan = Gesture.Pan().onTouchesDown(() => {
    console.log('onTouchesDown');
    setLastActivity();
  });

  return (
    <React.Fragment>
      <GestureDetector gesture={pan}>
        <Stack.Navigator>
          {authState.status === 'unauthenticated' ? (
            <Stack.Screen name="Auth" component={AuthScreen} />
          ) : (
            <React.Fragment>
              <Stack.Screen
                name="TransactionList"
                component={TransactionListScreen}
                options={{
                  headerRight: () => (
                    <IconButton icon="logout" size={18} onPress={logout} />
                  ),
                }}
              />
              <Stack.Screen
                name="TransactionDetail"
                component={TransactionDetailScreen}
              />
            </React.Fragment>
          )}
        </Stack.Navigator>
      </GestureDetector>
      {authState.status === 'inactive' && (
        <TouchableWithoutFeedback onPress={setLastActivity}>
          <View style={styles.absolute}>
            <BlurView
              style={styles.blurView}
              blurType="light"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 100,
  },
  blurView: {
    flex: 1,
  },
});

export default App;
