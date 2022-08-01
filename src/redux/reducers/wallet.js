// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas

import { actionTypes } from '../actions';

const INITIAL_STATE = {
  currencies: [],
  expenses: [],
  editor: false,
  idToEdit: '',
  isLoading: false,
  isFirstPageFetchDone: false,
  error: '',
};

const walletReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case actionTypes.DELETE_EXPENSE:
    return { ...state,
      editor: false,
      idToEdit: '',
      expenses: [...state.expenses.filter((expense) => (
        expense.id !== action.payload
      ))] };
  case actionTypes.ENABLE_EDIT_EXPENSE:
    return { ...state,
      editor: true,
      idToEdit: action.payload };
  case actionTypes.EDIT_EXPENSE:
    return { ...state,
      editor: false,
      idToEdit: '',
      expenses: [...action.payload] };
  case actionTypes.FETCH_CURRENCY_REQUEST:
    return { ...state,
      isLoading: true };
  case actionTypes.FETCH_CURRENCY_SUCCESS:
    return { ...state,
      isLoading: false,
      currencies: Object.keys(action.payload)
        .filter((currency) => currency !== 'USDT'),
      isFirstPageFetchDone: true,
      error: '' };
  case actionTypes.FETCH_CURRENCY_SUCCESS_EXPENSE:
    return { ...state,
      isLoading: false,
      expenses: [...state.expenses, action.payload],
      error: '' };
  case actionTypes.FETCH_CURRENCY_FAILURE:
    return { ...state,
      isLoading: false,
      error: action.payload };
  default:
    return state;
  }
};

export default walletReducer;
