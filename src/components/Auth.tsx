import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {AppScreenParamsList} from './App';

export const AuthScreen: React.FunctionComponent<Props> = props => {
  const {navigation} = props;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('TransactionList')}>
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
