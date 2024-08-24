import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {AppScreenParamsList} from './App';
import { rnBiometrics } from '../stores/rn-biometrics';

export const AuthScreen: React.FunctionComponent<Props> = props => {
  const {navigation} = props;

  React.useEffect(() => {
    // For testing purpose only
    rnBiometrics.isSensorAvailable().then(({available, biometryType, error}) =>
      console.log({
        available,
        biometryType,
        error,
      }),
    );
  }, []);

  const login = async () => {
    try {
      const {success, error} = await rnBiometrics.simplePrompt({
        promptMessage: 'Log in with Biometrics',
      });
      if (error) {
        throw new Error(error);
      }
      if (success) {
        console.log('Successful biometrics provided');
        navigation.navigate('TransactionList');
      } else {
        console.log('User cancelled biometric prompt');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button mode="contained" onPress={login}>
        Login
      </Button>
    </ScrollView>
  );
};

type Props = NativeStackScreenProps<AppScreenParamsList, 'Auth'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
