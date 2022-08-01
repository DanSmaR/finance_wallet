// Coloque aqui suas actions
const URL = 'https://economia.awesomeapi.com.br/json/all';
let ID = 0;

export const actionTypes = {
  LOGIN: 'LOGIN',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  ENABLE_EDIT_EXPENSE: 'ENABLE_EDIT_EXPENSE',
  EDIT_EXPENSE: 'EDIT_EXPENSE',
  FETCH_CURRENCY_REQUEST: 'FETCH_CURRENCY_REQUEST',
  FETCH_CURRENCY_SUCCESS: 'FETCH_CURRENCY_SUCCESS',
  FETCH_CURRENCY_SUCCESS_EXPENSE: 'FETCH_CURRENCY_SUCCESS_EXPENSE',
  FETCH_CURRENCY_FAILURE: 'FETCH_CURRENCY_FAILURE',
};

export const executeLogin = (email) => ({
  type: actionTypes.LOGIN,
  payload: email,
});

export const deleteExpense = (id) => ({
  type: actionTypes.DELETE_EXPENSE,
  payload: id,
});

export const enableEditExpense = (id) => ({
  type: actionTypes.ENABLE_EDIT_EXPENSE,
  payload: id,
});

export const editExpense = (expenseList) => ({
  type: actionTypes.EDIT_EXPENSE,
  payload: expenseList,
});

const fetchCurrencyRequest = () => ({
  type: actionTypes.FETCH_CURRENCY_REQUEST,
});

const fetchCurrencySucess = (data) => ({
  type: actionTypes.FETCH_CURRENCY_SUCCESS,
  payload: data,
});

const fetchCurrencySucessWithExpense = (data, expense) => ({
  type: actionTypes.FETCH_CURRENCY_SUCCESS_EXPENSE,
  payload: {
    ...expense,
    exchangeRates: data,
  },
});

const fetchCurrencyFailure = (error) => ({
  type: actionTypes.FETCH_CURRENCY_FAILURE,
  payload: error.message,
});

export function fetchCurrencies(expense) {
  return (dispatch) => {
    dispatch(fetchCurrencyRequest());
    fetch(URL)
      .then((response) => response.json())
      .then((currencies) => {
        if (expense && typeof expense === 'object') {
          const expenseWithId = {
            id: ID,
            ...expense,
          };
          dispatch(fetchCurrencySucessWithExpense(currencies, expenseWithId));
          ID += 1;
          return;
        }
        dispatch(fetchCurrencySucess(currencies));
      })
      .catch((error) => {
        console.log(error.message);
        dispatch(fetchCurrencyFailure(error));
      });
  };
}
