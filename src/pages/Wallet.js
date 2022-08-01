import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import WalletForm from '../components/WalletForm';
import { fetchCurrencies } from '../redux/actions';
import Loading from '../components/Loading';
import Table from '../components/Table';

class Wallet extends React.Component {
  componentDidMount() {
    const { fetch } = this.props;
    fetch();
  }

  render() {
    const { isRequesting, errorRequest, isFirstFetchPageDone } = this.props;
    if (errorRequest && !isFirstFetchPageDone) {
      return (
        <div>
          <h2>{ errorRequest }</h2>
          <p>Falha no carregamento dos dados.</p>
          <p>Volte para o Login e entre novamente.</p>
        </div>
      );
    }
    return (
      <div>
        <Header />
        {
          isRequesting ? <Loading /> : <WalletForm />
        }
        <Table />
      </div>
    );
  }
}

Wallet.propTypes = {
  fetch: PropTypes.func.isRequired,
  isRequesting: PropTypes.bool.isRequired,
  isFirstFetchPageDone: PropTypes.bool.isRequired,
  errorRequest: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  fetch: () => dispatch(fetchCurrencies()),
});

const mapStateToProps = (state) => ({
  isRequesting: state.wallet.isLoading,
  isFirstFetchPageDone: state.wallet.isFirstPageFetchDone,
  errorRequest: state.wallet.error,
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
