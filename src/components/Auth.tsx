import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {AppScreenParamsList} from './App';
import {rnBiometrics, useAuthStore} from '../stores/auth';
import {FixedPositionedError} from './shared/fixed-positioned-error';

export const AuthScreen: React.FunctionComponent<Props> = () => {
  const [, {authenticate}] = useAuthStore();
  const [error, setError] = React.useState<string | undefined>();

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
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unknown error');
      }
    }
  };

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(undefined), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
      <FixedPositionedError error={error} />
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
