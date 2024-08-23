import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {AppScreenParamsList} from './App';

export const TransactionListScreen: React.FunctionComponent<Props> = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Transaction list screen</Text>
    </ScrollView>
  );
};

type Props = NativeStackScreenProps<AppScreenParamsList, 'TransactionList'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
