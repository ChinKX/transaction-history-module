import * as React from 'react';
import {
  SectionList,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {IconButton, Text} from 'react-native-paper';
import {faker} from '@faker-js/faker';
import {AppScreenParamsList} from './App';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {rnBiometrics} from '../stores/rn-biometrics';
import {Transaction} from '../stores/transaction';

export const TransactionListScreen: React.FunctionComponent<Props> = props => {
  const {navigation} = props;
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isAmountVisible, setIsAmountVisible] = React.useState(false);
  const [lastRefreshed, setLastRefreshed] = React.useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  React.useEffect(() => {
    getData();
  }, [lastRefreshed]);

  const getData = () => {
    setIsRefreshing(true);
    // Simulate network request
    setTimeout(() => {
      setTransactions(
        Array.from({length: 20}).map<Transaction>(() => ({
          id: faker.string.alphanumeric(),
          description: faker.finance.transactionDescription(),
          amount: parseFloat(faker.finance.amount()),
          date: faker.date.recent(),
          type: faker.helpers.arrayElement(['Credit', 'Debit']),
        })),
      );
      setIsRefreshing(false);
    }, 2000);
  };

  const groupedTransactions = React.useMemo(
    () =>
      Object.entries(
        transactions.reduce<
          Record</* transaction date */ string, Transaction[]>
        >((result, transaction) => {
          const transactionDate = transaction.date.toISOString().split('T')[0];
          return {
            ...result,
            [transactionDate]: [
              ...(result[transactionDate] || []),
              transaction,
            ],
          };
        }, {}),
      ).map(([date, transactionsData]) => ({
        title: date,
        data: transactionsData,
      })),
    [transactions],
  );

  const refreshData = async () => setLastRefreshed(Date.now());

  const toggleAmountVisibility = async () => {
    try {
      if (isAmountVisible) {
        setIsAmountVisible(false);
        return;
      }
      const {success, error} = await rnBiometrics.simplePrompt({
        promptMessage: 'View transaction amount',
      });
      if (error) {
        throw new Error(error);
      }
      if (success) {
        console.log('Successful biometrics provided');
        setIsAmountVisible(true);
      } else {
        console.log('User cancelled biometric prompt');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SectionList
      sections={groupedTransactions}
      keyExtractor={(item, index) => `${index}-${item.id}`}
      renderSectionHeader={({section: {title}}) => (
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium">{title}</Text>
        </View>
      )}
      renderItem={({item}) => (
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('TransactionDetail', {
              transaction: item,
            })
          }>
          <View style={styles.item}>
            <Text variant="titleSmall" numberOfLines={2} style={{flex: 1}}>
              {item.description}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{marginLeft: 24, marginRight: 8}}>
                RM{' '}
                {isAmountVisible
                  ? item.amount
                  : Array.from({length: item.amount.toString().length}).join(
                      '*',
                    )}
              </Text>
              <IconButton
                icon={!isAmountVisible ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                onPress={toggleAmountVisibility}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      contentContainerStyle={{
        ...styles.container,
        paddingBottom: insets.bottom,
      }}
      stickySectionHeadersEnabled={false}
      onRefresh={refreshData}
      refreshing={isRefreshing}
    />
  );
};

type Props = NativeStackScreenProps<AppScreenParamsList, 'TransactionList'>;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  sectionHeader: {
    padding: 16,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
