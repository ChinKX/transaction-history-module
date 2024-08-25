import * as React from 'react';
import {
  SectionList,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ActivityIndicator, IconButton, Text} from 'react-native-paper';
import {AppScreenParamsList} from './App';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Transaction, useTransactionStore} from '../stores/transaction';
import {useAuthStore} from '../stores/auth';
import {FixedPositionedError} from './shared/fixed-positioned-error';

export const TransactionListScreen: React.FunctionComponent<Props> = props => {
  const {navigation} = props;
  const insets = useSafeAreaInsets();
  const [, {simpleAuthenticate, setLastActivity}] = useAuthStore();
  const {getTransactions} = useTransactionStore();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isAmountVisible, setIsAmountVisible] = React.useState(false);
  const [lastRefreshed, setLastRefreshed] = React.useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  React.useEffect(() => {
    getData();
  }, [lastRefreshed]);

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(undefined), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getData = async () => {
    try {
      setIsRefreshing(true);
      const transactions = await getTransactions();
      setTransactions(transactions);
      setIsRefreshing(false);
    } catch (error) {
      setIsRefreshing(false);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unknown error');
      }
    }
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
      const result = await simpleAuthenticate();
      if (result.type === 'success') {
        setIsAmountVisible(true);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unknown error');
      }
    }
  };

  return (
    <React.Fragment>
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
        ListEmptyComponent={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        }
        stickySectionHeadersEnabled={false}
        onRefresh={refreshData}
        refreshing={isRefreshing}
        onTouchStart={setLastActivity}
        onScroll={setLastActivity}
      />
      <FixedPositionedError error={error} />
    </React.Fragment>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
