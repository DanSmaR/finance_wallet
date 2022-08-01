import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import currencyLogo from '../images/currency-exchange.png';
import { fixNumber } from '../utils';

function Header({ email, expenses }) {
  function getTotalExpense() {
    const totalExpense = expenses
      .reduce((total, { value, currency, exchangeRates: { [currency]: { ask } } }) => (
        total + (value * ask)
      ), 0);

    return fixNumber(totalExpense);
  }

  return (
    <div>
      <img src={ currencyLogo } alt="currency-exchange" width="100px" />
      <div className="user-info">
        <p>
          Email:
          { ' ' }
          <span data-testid="email-field">{ email }</span>
        </p>
        <p>
          Despesa Total:
          { ' ' }
          R$
          <span data-testid="total-field">{ getTotalExpense() }</span>
          { ' ' }
          <span data-testid="header-currency-field">BRL</span>
        </p>
      </div>
    </div>
  );
}

Header.propTypes = {
  email: PropTypes.string.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => ({
  email: state.user.email,
  expenses: state.wallet.expenses,
});

export default connect(mapStateToProps)(Header);
