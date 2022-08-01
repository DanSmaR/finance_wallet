// Esse reducer será responsável por tratar as informações da pessoa usuária
import { actionTypes } from '../actions';

const INITIAL_STATE = {
  email: '',
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case actionTypes.LOGIN:
    return {
      email: action.payload,
    };

  default:
    return state;
  }
};

export default userReducer;
