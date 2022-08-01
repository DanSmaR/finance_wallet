import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteExpense, enableEditExpense } from '../redux/actions';
import { fixNumber, tableHeaderList } from '../utils';

class Table extends Component {
  render() {
    const { expenseList, onDelete, onEnableEditing, errorRequest } = this.props;
    return (
      <div>
        <table>
          <thead>
            <tr>
              {tableHeaderList.map((title, index) => (
                <th key={ index }>{title}</th>
              ))}
            </tr>
          </thead>
          {expenseList.length !== 0 && (
            <tbody>
              {expenseList.map(
                ({ id, description, tag, method, value, currency,
                  exchangeRates: {
                    [currency]: { name: currencyName, ask } },
                }) => (
                  <tr key={ id } data-testid="expenses-table-row">
                    <td>{description}</td>
                    <td>{tag}</td>
                    <td>{method}</td>
                    <td>{fixNumber(value)}</td>
                    <td>{currencyName}</td>
                    <td>{fixNumber(ask)}</td>
                    <td>{fixNumber(value * ask)}</td>
                    <td>Real</td>
                    <td>
                      <span>
                        <button
                          type="button"
                          data-testid="edit-btn"
                          onClick={ () => onEnableEditing(id) }
                        >
                          Editar
                        </button>
                      </span>
                      <span>
                        <button
                          type="button"
                          data-testid="delete-btn"
                          onClick={ () => onDelete(id) }
                        >
                          Excluir
                        </button>
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          )}
        </table>
        {
          errorRequest && (
            <div>
              <h2>{ errorRequest }</h2>
              <p>Falha no carregamento dos dados.</p>
              <p>Preencha novamente o formulário. Tente adicionar a despesa novamente.</p>
            </div>
          )
        }
      </div>
    );
  }
}

Table.propTypes = {
  expenseList: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEnableEditing: PropTypes.func.isRequired,
  errorRequest: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  expenseList: state.wallet.expenses,
  errorRequest: state.wallet.error,
});

const mapDispatchToProps = (dispatch) => ({
  onDelete: (id) => dispatch(deleteExpense(id)),
  onEnableEditing: (id) => dispatch(enableEditExpense(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Table);
