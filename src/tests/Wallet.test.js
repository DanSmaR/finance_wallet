import React from "react";
import '@testing-library/jest-dom';
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Wallet from '../pages/Wallet';
import { renderWithRedux, renderWithRouterAndRedux } from "./helpers/renderWith";
import { emailValid, initialState, initialEntries, totalExpenseRounded, emptyInitialStateAfterLogin } from "./helpers/constants";
import mockData from "./helpers/mockData";

describe('Testing the Wallet page', () => {
  describe('Testing the header of the page', () => {
    beforeEach(async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockData),
      });

      renderWithRouterAndRedux(<Wallet />, {
        initialState,
        initialEntries,
      });

      await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    });

    afterEach(() => jest.clearAllMocks());

    it('should appear the email of the user in the screen', async () => {
      expect(screen.getByTestId('email-field')).toHaveTextContent(emailValid);
    });

    it('should appear the total expense value in BRL currency', () => {
      expect(screen.getByTestId('total-field')).toHaveTextContent(totalExpenseRounded);
    });
  });

  describe('Testing the form of the wallet page', () => {
    const getValueInput = () => screen.getByRole('spinbutton', {
      name: /valor:/i
    });

    const getExpenseDescription = () => screen.getByRole('textbox', {
      name: /descrição:/i
    });

    const getSubmitBtn = () => screen.getByRole('button', {
      name: /adicionar despesa/i
    })

    describe('Testing the user inputs', () => {
      beforeEach(async () => {
        global.fetch = jest.fn().mockResolvedValue({
          json: jest.fn().mockResolvedValue(mockData),
        });
  
        renderWithRouterAndRedux(<Wallet />, {
          initialState,
          initialEntries,
        });
  
        await waitFor(() => expect(global.fetch).toHaveBeenCalled());
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });
  
      it('should be able to type a number in the "Valor" input', () => {
        userEvent.type(getValueInput(), '100');
        expect(getValueInput()).toHaveValue(100);
      });
  
      it('should be able to type the expense description', () => {
        userEvent.type(getExpenseDescription(), 'pizza');
        expect(getExpenseDescription()).toHaveValue('pizza');
      });
  
      it('should be able to choose the currency', () => {
        userEvent.selectOptions(screen.getByRole('combobox', {
          name: /moeda/i
        }), ['EUR']);
        expect(screen.getByRole('option', {
          name: 'EUR'
        }).selected).toBeTruthy();
      });
  
      it('should be able to choose the payment method', () => {
        userEvent.selectOptions(screen.getByRole('combobox', {
          name: /Método de Pagamento/i
        }), ['Cartão de crédito']);
        expect(screen.getByRole('option', {
          name: 'Cartão de crédito'
        }).selected).toBeTruthy();
      });
  
      it('should be able to choose the expense category', () => {
        userEvent.selectOptions(screen.getByRole('combobox', {
          name: /Categoria/i
        }), ['Transporte']);
        expect(screen.getByRole('option', {
          name: 'Transporte'
        }).selected).toBeTruthy();
      });
    });

    describe('Testing the submit button', () => {
      beforeEach(async () => {
        global.fetch = jest.fn().mockResolvedValue({
          json: jest.fn().mockResolvedValue(mockData),
        });
  
        renderWithRouterAndRedux(<Wallet />, {
          initialState,
          initialEntries,
        });
  
        await waitFor(() => expect(global.fetch).toHaveBeenCalled());
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should the fetch API have not been called when the submit button is clicked with empty values', async () => {
        userEvent.click(getSubmitBtn());
        await waitFor(() => {
          expect(global.fetch).not.toHaveBeenCalledTimes(2);
        });
      });

      it('should the fetch Api been called when submitting a button with the form filled in', async () => {
        userEvent.type(getValueInput(), '100');
        userEvent.type(getExpenseDescription(), 'trip');
        userEvent.selectOptions(screen.getByRole('combobox', {
          name: /moeda/i
        }), ['EUR']);
        userEvent.selectOptions(screen.getByRole('combobox', {
          name: /Método de Pagamento/i
        }), ['Cartão de crédito']);
        userEvent.selectOptions(screen.getByRole('combobox', {
          name: /Categoria/i
        }), ['Transporte']);
        userEvent.click(getSubmitBtn());
        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledTimes(2);
        });
      });
    });

    describe('Testing the failure request response', () => {
      beforeEach(async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Request Failure'));
        renderWithRedux(<Wallet />, {
          emptyInitialStateAfterLogin,
        });
      
        await waitFor(() => expect(global.fetch).toHaveBeenCalled());
      });
      
      afterEach(() => {
        jest.clearAllMocks();
      });
  
      it('should show the error message in case of failure request when loading the form', async () => {
        expect(screen.getByRole('heading', { name: /request failure/i })).toBeInTheDocument();
        // screen.logTestingPlaygroundURL();
      });
    });
  });
});
