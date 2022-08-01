import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { defaultFormInputs, paymentMethods, tagOptions } from '../utils';
import { editExpense, fetchCurrencies } from '../redux/actions';

class WalletForm extends Component {
  constructor(props) {
    super(props);
    this.valueInput = React.createRef();
    this.state = { expenseValue: defaultFormInputs.value,
      expenseDescription: defaultFormInputs.description,
      expenseCurrency: defaultFormInputs.currency,
      paymentMethod: defaultFormInputs.method,
      expenseTag: defaultFormInputs.tag };
  }

  componentDidMount() {
    this.getFocusOnFormInput(this.valueInput);
  }

  componentDidUpdate(prevProps) {
    const { idExpenseToEdit, isEditable, expensesList } = this.props;
    if (idExpenseToEdit !== prevProps.idExpenseToEdit && isEditable === true) {
      this.onFormUpdateAfterEnableEditing();
      return;
    }
    if (expensesList.length < prevProps.expensesList.length && isEditable === false) {
      this.onFormUpdateAfterSubmit();
    }
  }

  onFormUpdateAfterSubmit() {
    this.fillInFormInputs(defaultFormInputs);
  }

  onFormUpdateAfterEnableEditing() {
    const { idExpenseToEdit, expensesList } = this.props;
    const expenseToEdit = expensesList.filter(({ id }) => (id === idExpenseToEdit));
    this.fillInFormInputs(expenseToEdit[0]);
  }

  getFocusOnFormInput = (input) => input.current.focus();

  fillInFormInputs = ({ value, description, currency, method, tag }) => {
    this.setState({ expenseValue: value,
      expenseDescription: description,
      expenseCurrency: currency,
      paymentMethod: method,
      expenseTag: tag }, () => this.getFocusOnFormInput(this.valueInput));
  }

  handleInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  handleAddExpense = () => {
    const { fetch } = this.props;
    const { expenseValue, expenseDescription, expenseCurrency, paymentMethod, expenseTag,
    } = this.state;
    if (!(expenseValue && expenseDescription)) return;
    const expense = { value: expenseValue,
      currency: expenseCurrency,
      method: paymentMethod,
      tag: expenseTag,
      description: expenseDescription };
    fetch(expense);
    this.onFormUpdateAfterSubmit();
  }

  handleEditExpense = () => {
    const { expensesList, idExpenseToEdit, editExpenseList } = this.props;
    const { expenseValue, expenseDescription, expenseCurrency, paymentMethod, expenseTag,
    } = this.state;
    if (!(expenseValue && expenseDescription)) return;
    const updatedExpense = expensesList.map((expense) => {
      if (expense.id === idExpenseToEdit) {
        return { ...expense,
          value: expenseValue,
          currency: expenseCurrency,
          method: paymentMethod,
          tag: expenseTag,
          description: expenseDescription };
      }
      return expense;
    });
    editExpenseList(updatedExpense);
    this.onFormUpdateAfterSubmit();
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { isEditable } = this.props;
    if (isEditable) {
      this.handleEditExpense();
      return;
    }
    this.handleAddExpense();
  };

  render() {
    const { currencies, isEditable } = this.props;
    const { expenseValue, expenseDescription, expenseCurrency, paymentMethod, expenseTag,
    } = this.state;
    return (
      <div>
        <form onSubmit={ this.handleSubmit }>
          <p>
            <label htmlFor="expense-value">
              Valor:
              { ' ' }
              <input
                type="number"
                name="expenseValue"
                id="expense-value"
                data-testid="value-input"
                min="0"
                value={ expenseValue }
                onChange={ this.handleInputChange }
                ref={ this.valueInput }
              />
            </label>
          </p>
          <p>
            <label htmlFor="expense-description">
              Descrição:
              { ' ' }
              <input
                type="text"
                name="expenseDescription"
                id="expense-description"
                data-testid="description-input"
                value={ expenseDescription }
                onChange={ this.handleInputChange }
              />
            </label>
          </p>
          <p>
            <label htmlFor="expense-currency">
              Moeda:
              { ' ' }
              <select
                name="expenseCurrency"
                id="expense-currency"
                data-testid="currency-input"
                value={ expenseCurrency }
                onChange={ this.handleInputChange }
              >
                {
                  currencies.map((currency, index) => (
                    <option key={ index } value={ currency }>
                      { currency }
                    </option>
                  ))
                }
              </select>
            </label>
          </p>
          <p>
            <label htmlFor="payment-method">
              Método de Pagamento:
              { ' ' }
              <select
                name="paymentMethod"
                id="payment-method"
                data-testid="method-input"
                value={ paymentMethod }
                onChange={ this.handleInputChange }
              >
                {
                  paymentMethods.map((payMethod, index) => (
                    <option key={ index } value={ payMethod }>
                      { payMethod }
                    </option>
                  ))
                }
              </select>
            </label>
          </p>
          <p>
            <label htmlFor="expense-tag">
              Categoria:
              { ' ' }
              <select
                name="expenseTag"
                id="expense-tag"
                data-testid="tag-input"
                value={ expenseTag }
                onChange={ this.handleInputChange }
              >
                {
                  tagOptions.map((tagOption, index) => (
                    <option key={ index } value={ tagOption }>{ tagOption }</option>
                  ))
                }
              </select>
            </label>
          </p>
          <p>
            {
              isEditable ? <button type="submit">Editar despesa</button>
                : (<button type="submit">Adicionar despesa</button>)
            }
          </p>
        </form>
      </div>
    );
  }
}

WalletForm.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetch: PropTypes.func.isRequired,
  isEditable: PropTypes.bool.isRequired,
  idExpenseToEdit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  expensesList: PropTypes.arrayOf(PropTypes.object).isRequired,
  editExpenseList: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
  isEditable: state.wallet.editor,
  expensesList: state.wallet.expenses,
  idExpenseToEdit: state.wallet.idToEdit,
});
const mapDispatchToProps = (dispatch) => ({
  fetch: (data) => dispatch(fetchCurrencies(data)),
  editExpenseList: (list) => dispatch(editExpense(list)),
});
export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
