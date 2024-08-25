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
import {Transaction} from '../stores/transaction';
import {TransactionDetailScreen} from './Transaction-detail';
import {useAuthStore} from '../stores/auth';
import {IconButton} from 'react-native-paper';

export type AppScreenParamsList = {
  Auth: undefined;
  TransactionList: undefined;
  TransactionDetail: {
    transaction: Transaction;
  };
};

const Stack = createNativeStackNavigator<AppScreenParamsList>();

const App: React.FunctionComponent = () => {
  const [authState, {logout}] = useAuthStore();

  return (
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
  );
};

export default App;
