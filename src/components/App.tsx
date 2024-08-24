/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthScreen} from './Auth';
import {TransactionListScreen} from './Transaction-list';
import { Transaction } from '../stores/transaction';
import { TransactionDetailScreen } from './Transaction-detail';

export type AppScreenParamsList = {
  Auth: undefined;
  TransactionList: undefined;
  TransactionDetail: {
    transaction: Transaction
  }
};

const Stack = createNativeStackNavigator<AppScreenParamsList>();

const App: React.FunctionComponent = () => {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="TransactionList" component={TransactionListScreen} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
    </Stack.Navigator>
  );
};

export default App;
