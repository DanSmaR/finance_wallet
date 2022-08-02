import React from "react";
import '@testing-library/jest-dom';
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Wallet from "../pages/Wallet";
import { renderWithRedux } from "./helpers/renderWith";
import { initialState, emptyInitialStateAfterLogin, tableHeaderList, expectedTableRows, newExpenseInputs, newExpensePrinted } from "./helpers/constants";
import mockData from "./helpers/mockData";

const getButtons = (name) => screen.getAllByRole('button', { name: name });

const getValorInput = () => screen.getByRole('spinbutton', { name: /valor:/i });

const getDescriçãoInput = () => screen.getByRole('textbox', { name: /descrição:/i });

const getSelectInput = (name) => screen.getByRole('combobox', { name: name });

const getSelectedOption = (value) => screen.getByRole('option', { name: value }).selected;

function fillInFormInputs({ value, description, currency, method, tag }) {
  userEvent.type(getValorInput(), value);
  userEvent.type(getDescriçãoInput(), description);
  userEvent.selectOptions(getSelectInput(/moeda/i), [currency]);
  userEvent.selectOptions(getSelectInput(/Método de Pagamento/i), [method]);
  userEvent.selectOptions(getSelectInput(/Categoria/i), [tag]);
}

describe('Testing the table component and functionalities', () => {
  describe('Testing the table content with expenses already added', () => {
    beforeEach(async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockData),
      });
    
      renderWithRedux(<Wallet />, {
        initialState,
      });
    
      await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    });
    
    afterEach(() => {
      jest.clearAllMocks();
    });

    it(`should the table have headers with the following fields name: 
    Descrição, Tag, Método de pagamento, Valor, Moeda, Câmbio utilizado, 
    Valor convertido e Moeda de conversão, Editar/Excluir` , () => {
      tableHeaderList.forEach((item) => {
        expect(screen.getByRole('columnheader', { name: item })).toBeInTheDocument();
      });
    });

    it('should the table display all the expenses data', () => {
      expect(screen.getAllByTestId('expenses-table-row')).toHaveLength(2);
      expectedTableRows.forEach((row) => {
        row.forEach((content) => {
          expect(screen.getByRole('cell', { name: content })).toBeInTheDocument();
        });
      });
      expect(screen.getAllByRole('cell', { name: 'Real' })).toHaveLength(2);
    });

    it('should the table have two buttons for delete and two for edit the expenses', () => {
      expect(getButtons(/excluir/i)).toHaveLength(2);
      expect(getButtons(/editar/i)).toHaveLength(2);
    });
  });

  describe('Testing the delete and editing actions', () => {
    beforeEach(async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockData),
      });
    
      renderWithRedux(<Wallet />, {
        initialState,
      });
    
      await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    });
    
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should delete an expense when click on the "excluir" button', () => {
      userEvent.click(getButtons(/excluir/i)[0]);
      // screen.logTestingPlaygroundURL();
      expect(screen.getAllByTestId('expenses-table-row')).toHaveLength(1);
    });

    it('should the input forms filled in with the values of the expense to be edited when the button "editar" is clicked', () => {
      userEvent.click(getButtons(/editar/i)[0]);
      expect(getValorInput()).toHaveValue(10);
      expect(getDescriçãoInput()).toHaveValue('Dez dólares');
      expect(screen.getByRole('option', { name: 'USD' }).selected).toBeTruthy();
      expect(screen.getByRole('option', { name: 'Cartão de débito' }).selected).toBeTruthy();
      expect(screen.getByRole('option', { name: 'Trabalho' }).selected).toBeTruthy();
    });

    it('should the submit button change to "Editar despesa" when the "Editar" button is clicked', () => {
      userEvent.click(getButtons(/editar/i)[0]);
      expect(getButtons(/editar despesa/i)[0]).toBeInTheDocument();
    });

    it('should the expense be changed when the button "Editar despesa" is fired', () => {
      userEvent.click(getButtons(/editar/i)[0]);
      fillInFormInputs(newExpenseInputs);
      userEvent.click(getButtons(/editar despesa/i)[0]);
      Object.values(newExpensePrinted).forEach((value) => {
        expect(screen.getByRole('cell', { name: value })).toBeInTheDocument();
      })
    });

    it('shouldn\'t the expense be changed when the one of the inputs is empty and the "Editar despesa" button is clicked', () => {
      userEvent.click(getButtons(/editar/i)[0]);
      userEvent.type(getValorInput(), '');
      userEvent.type(getDescriçãoInput(), '');
      userEvent.click(getButtons(/editar despesa/i)[0]);
      Object.values(newExpensePrinted).forEach((value) => {
        expect(screen.queryByRole('cell', { name: value })).not.toBeInTheDocument();
      })
    });
  });

  describe('Testing the failure request response', () => {
    beforeEach(async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockData),
      }).mockRejectedValue(new Error('Request Failure'))
    
      renderWithRedux(<Wallet />, {
        emptyInitialStateAfterLogin,
      });
    
      await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    });
    
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should show the error message in case of failure request when adding new expense', async () => {
      fillInFormInputs(newExpenseInputs);
      userEvent.click(getButtons(/adicionar despesa/i)[0]);
      await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
      expect(screen.getByRole('heading', { name: /request failure/i })).toBeInTheDocument();
      // screen.logTestingPlaygroundURL();
    });
  });
});
