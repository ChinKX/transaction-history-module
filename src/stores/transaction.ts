export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  type: 'Credit' | 'Debit';
};
