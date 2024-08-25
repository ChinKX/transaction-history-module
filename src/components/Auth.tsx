import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {AppScreenParamsList} from './App';
import {rnBiometrics, useAuthStore} from '../stores/auth';

export const AuthScreen: React.FunctionComponent<Props> = () => {
  const [, {authenticate}] = useAuthStore();

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
      await authenticate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text
        variant="titleLarge"
        style={{
          textAlign: 'center',
          marginBottom: 48,
        }}>
        Login using biometrics to view transactions
      </Text>
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
