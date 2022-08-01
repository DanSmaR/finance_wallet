import React from "react";
import '@testing-library/jest-dom';
import { cleanup, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { renderWithRouterAndRedux } from "./helpers/renderWith";
import { emailValid, emailInvalidList, passwordValid, passwordInvalidList } from "./helpers/constants";
// import mockData from "./helpers/mockData";

const initialState = {
  user: {
    email: '',
  },
  wallet: {
    currencies: [], // array de string
    expenses: [],
    editor: false, // valor booleano que indica de uma despesa está sendo editada
    idToEdit: 0, // valor numérico que armazena o id da despesa que esta sendo editada
    isLoading: false,
    error: '',
  }
};

const getEmailInput = () => screen.getByRole('textbox', { name: /email/i});
const getPasswordINput = () => screen.getByLabelText(/password/i);
const getSubmitBtn = () => screen.getByRole('button', { name: /entrar/i});

describe('Testing the Login page', () => {
  describe('Testing the user Inputs', () => {
    beforeEach(() => {
      renderWithRouterAndRedux(<App />, {
        initialState,
      });
    });

    it('should be able to type your email and see what you typed', () => {
      expect(getEmailInput()).toBeInTheDocument();
      userEvent.type(getEmailInput(), emailValid);
      expect(getEmailInput()).toHaveValue(emailValid);
    });
  
    it('should be able to type a password in the password input and it should not be visible', () => {
      expect(getPasswordINput()).toBeInTheDocument();
      userEvent.type(getPasswordINput(), passwordValid);
      expect(getEmailInput()).not.toHaveValue(passwordValid);
    });
  
    it('should the button be disabled in case the user type incorret values or type nothing', () => {
      emailInvalidList.forEach((email) => {
        userEvent.type(getEmailInput(), email);
        expect(getSubmitBtn()).toBeDisabled();
      });
      passwordInvalidList.forEach((password) => {
        userEvent.type(getPasswordINput(), password);
        expect(getSubmitBtn()).toBeDisabled();
      })
    });
  });

  describe('Testing the submit and routing to next page', () => {
    // beforeEach(async () => {
    //   global.fetch = jest.fn().mockResolvedValue({
    //     json: jest.fn().mockResolvedValue(mockData),
    //   });
    // });

    // afterEach(() => jest.clearAllMocks());

    it('should be able to submit after fill in the form', async () => {
      const { history } = renderWithRouterAndRedux(<App />, {
        initialState,
      });
      
      userEvent.type(getEmailInput(), emailValid);
      userEvent.type(getPasswordINput(), passwordValid);
      userEvent.click(getSubmitBtn());
      await waitFor(() => {
        expect(history.location.pathname).toEqual('/carteira');
      });
      // screen.logTestingPlaygroundURL();
    });
  });
});