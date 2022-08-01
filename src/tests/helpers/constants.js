import mockData from './mockData';

export const emailValid = 'user@email.com';
export const emailInvalidList = ['', 'user', 'user@', 'user@mail', 'user@mail.c'];
export const passwordValid = '123456';
export const passwordInvalidList = ['', '12345'];

const currenciesOptions = Object.keys(mockData).filter((key) => key !== 'USDT');

export const initialState = {
  user: {
    email: emailValid,
  },
  wallet: {
    currencies: [...currenciesOptions], // array de string
    expenses: [
      {
        id: 50,
        description: 'Dez dólares',
        value: '10',
        currency: 'USD',
        method: 'Cartão de débito',
        tag: 'Trabalho',
        exchangeRates: mockData,
      },
      {
        id: 51,
        description: 'Cinco euros',
        value: '5',
        currency: 'EUR',
        method: 'Cartão de crédito',
        tag: 'Lazer',
        exchangeRates: mockData,
      }
    ],
    editor: false, // valor booleano que indica de uma despesa está sendo editada
    idToEdit: '', // valor numérico que armazena o id da despesa que esta sendo editada
    isLoading: false,
    isFirstPageFetchDone: false,
    error: '',
  }
};

export const emptyInitialStateAfterLogin = {
  ser: {
    email: emailValid,
  },
  wallet: {
    currencies: [...currenciesOptions], // array de string
    expenses: [],
    editor: false, // valor booleano que indica de uma despesa está sendo editada
    idToEdit: '', // valor numérico que armazena o id da despesa que esta sendo editada
    isLoading: false,
    isFirstPageFetchDone: false,
    error: '',
  }
}

export const newExpenseInputs = {
  value: '90',
  description: 'Viagem',
  currency: 'CAD',
  method: 'Dinheiro',
  tag: 'Transporte',
}

export const newExpensePrinted = {
  value: '90.00',
  description: 'Viagem',
  currency: 'Dólar Canadense/Real Brasileiro',
  method: 'Dinheiro',
  tag: 'Transporte',
}

const totalExpense = initialState.wallet.expenses
  .reduce((total, { value, currency, exchangeRates: { [currency]: { ask } } }) => (
    total + (value * ask)
  ), 0);

export const totalExpenseRounded = Math.round(totalExpense * 100) / 100;

export const tableHeaderList = [
  'Descrição', 'Tag', 'Método de pagamento',
  'Valor', 'Moeda', 'Câmbio utilizado',
  'Valor convertido', 'Moeda de conversão', 'Editar/Excluir',
];

export const expectedTableRows = [
  ['Dez dólares', 'Trabalho', 'Cartão de débito', '10.00', 'Dólar Americano/Real Brasileiro', '4.75', '47.53'],
  ['Cinco euros', 'Lazer', 'Cartão de crédito', '5.00', 'Euro/Real Brasileiro', '5.13', '25.63'],
];