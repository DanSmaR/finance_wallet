import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { executeLogin } from '../redux/actions';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userEmail: '',
      userPassword: '',
      isPasswordValid: false,
      isEmailValid: false,
      isLogged: false,
    };
  }

  setDisableSaveButton() {
    const { userEmail, userPassword } = this.state;
    const minLength = 6;
    const isPasswordValid = userPassword.length >= minLength;
    const isEmailValid = this.checkEmailIsValid(userEmail);
    this.setState({
      isEmailValid,
      isPasswordValid,
    });
  }

  handleInputChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value }, () => this.setDisableSaveButton());
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { login } = this.props;
    const { userEmail } = this.state;
    login(userEmail);
    // history.push('/carteira');
    this.setState({
      isLogged: true,
    });
  };

  checkEmailIsValid(email) {
    const MAIL_FORMAT = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    return email.match(MAIL_FORMAT);
  }

  render() {
    const {
      userEmail,
      userPassword,
      isEmailValid,
      isPasswordValid,
      isLogged,
    } = this.state;

    return (
      <div>
        {
          isLogged && <Redirect push to="/carteira" />
        }
        <form onSubmit={ this.handleSubmit }>
          <h2>Login</h2>
          <p>
            <label htmlFor="user-email">
              Email:
              { ' ' }
              <input
                type="email"
                id="user-email"
                data-testid="email-input"
                name="userEmail"
                value={ userEmail }
                onChange={ this.handleInputChange }
                placeholder="user@mail.com"
              />
            </label>
          </p>
          <p>
            <label htmlFor="user-password">
              Password:
              { ' ' }
              <input
                type="password"
                name="userPassword"
                id="user-password"
                data-testid="password-input"
                value={ userPassword }
                onChange={ this.handleInputChange }
                placeholder="Enter a password"
              />
            </label>
          </p>
          <p>
            <button
              type="submit"
              disabled={ !(isEmailValid && isPasswordValid) }
            >
              Entrar
            </button>
          </p>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  login: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  login: (value) => dispatch(executeLogin(value)),
});

export default connect(null, mapDispatchToProps)(Login);
