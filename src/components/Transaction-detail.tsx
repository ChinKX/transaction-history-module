import * as React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppScreenParamsList} from './App';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IconButton, Text} from 'react-native-paper';
import {useAuthStore} from '../stores/auth';
import {FixedPositionedError} from './shared/fixed-positioned-error';

export const TransactionDetailScreen: React.FunctionComponent<
  Props
> = props => {
  const {transaction} = props.route.params;
  const insets = useSafeAreaInsets();
  const [, {simpleAuthenticate}] = useAuthStore();
  const [isAmountVisible, setIsAmountVisible] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(undefined), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
    <ScrollView
      contentContainerStyle={{
        ...styles.container,
        paddingBottom: insets.bottom,
      }}>
      {[
        {title: 'Description', content: transaction.description},
        {title: 'Type', content: transaction.type},
        {
          title: 'Amount',
          content: (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{marginRight: 8}}>
                RM{' '}
                {isAmountVisible
                  ? transaction.amount
                  : Array.from({
                      length: transaction.amount.toString().length,
                    }).join('*')}
              </Text>
              <IconButton
                icon={!isAmountVisible ? 'eye-outline' : 'eye-off-outline'}
                size={16}
                onPress={toggleAmountVisibility}
              />
            </View>
          ),
        },
        {title: 'Date', content: transaction.date.toLocaleString()},
      ].map(({title, content}, index) => (
        <View key={index} style={styles.content}>
          <Text variant="titleMedium" style={styles.title}>
            {title}
          </Text>
          {typeof content === 'string' ? (
            <Text style={styles.description}>{content}</Text>
          ) : (
            content
          )}
        </View>
      ))}
      <FixedPositionedError error={error} />
    </ScrollView>
  );
};

type Props = NativeStackScreenProps<AppScreenParamsList, 'TransactionDetail'>;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    flexDirection: 'column',
    padding: 16,
    backgroundColor: 'white',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 8,
  },
  description: {
    flex: 1,
  },
});
