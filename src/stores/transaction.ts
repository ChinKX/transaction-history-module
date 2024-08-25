import {faker} from '@faker-js/faker';

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  type: 'Credit' | 'Debit';
};

export const useTransactionStore = () => {
  // Simulate network request
  const getTransactions = async (): Promise<Transaction[]> =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(
          Array.from({length: 20}).map<Transaction>(() => ({
            id: faker.string.alphanumeric(),
            description: faker.finance.transactionDescription(),
            amount: parseFloat(faker.finance.amount()),
            date: faker.date.recent(),
            type: faker.helpers.arrayElement(['Credit', 'Debit']),
          })),
        );
      }, 2000);
    });

  return {getTransactions} as const;
};
