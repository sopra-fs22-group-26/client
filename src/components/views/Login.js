import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";


const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        type={props.type}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func
};

/**
 * Handles the login process
 * Upon successful login, the user's id, name and token are stored to localStorage.
 * @param props
 * @returns {JSX.Element}
 */
const Login = props => {
  const history = useHistory();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({username, password});
      const response = await api.post('/auth/login', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem('id', user.id);
      localStorage.setItem('username', user.username);
      /*
      // login does not return name of user yet
      if (user.name) {
        localStorage.setItem('name', user.name);
      }
      */

      // Login successfully worked --> navigate to the dashboard
      history.push(`/game`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer className="centered">
      <div className="login container">
        <div className="login header">Login</div>
        <div className="login form">
          <FormField
            label="Username:"
            value={username}
            onChange={un => setUsername(un)}
          />
          <FormField
            label="Password:"
            value={password}
            type="password"
            onChange={pw => setPassword(pw)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="316px"
              onClick={() => doLogin()}
            >
              Submit
            </Button>
            <div className="login link-container">
              <p>Are you a new user? <a href="/register">Sign up here</a></p>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Login;
