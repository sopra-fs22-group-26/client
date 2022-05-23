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
                placeholder={props.placeholder ? props.placeholder : "enter here.."}
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
    placeholder: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func
};

/**
 * Handles the signup process
 * Upon successful registration, the user's id, name and token are stored to localStorage.
 * @param props
 * @returns {JSX.Element}
 */
const Signup = () => {
    const history = useHistory();
    const [name, setName] = useState(null);
    const [username, setUsername] = useState(null);
    const [emailAddress, setEmailAddress] = useState(null);
    const [password, setPassword] = useState(null);
    const [password2, setPassword2] = useState(null);

    // Handle the registration process.
    // Upon succssful registration, the user is logged-in automatically.
    const doRegister = async () => {
        try {
            const requestBody = JSON.stringify({name, username, emailAddress, password});
            await api.post('/register', requestBody);
            // Registration successfully worked --> do auto-login
            doAutoLogin();
        } catch (error) {
            alert(`Something went wrong during signup: \n${handleError(error)}`);
        }
    };

    // After registration, the user is automatically logged-in, using the provided credentials
    const doAutoLogin = async () => {
        try {
            const requestBody = JSON.stringify({username, password});
            const response = await api.post('/auth/login', requestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store user info the local storage.
            localStorage.setItem('token', user.token);
            localStorage.setItem('refreshToken', user.refreshToken);
            localStorage.setItem('id', user.id);
            localStorage.setItem('username', user.username);
            if (user.name) {
                localStorage.setItem('name', user.name);
            }

            // Login successfully worked --> navigate to the dashboard
            history.push(`/dashboard`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };


    return (
        <BaseContainer className="single-frame centered">
            <div className="login container">
                <div className="login header">Sign up</div>
                <div className="login form">
                    <FormField
                        label="Name*:"
                        placeholder="your full name..."
                        value={name}
                        onChange={n => setName(n)}
                    />
                    <FormField
                        label="Username:"
                        placeholder="choose username..."
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    <FormField
                        label="E-mail address:"
                        value={emailAddress}
                        type="email"
                        onChange={e => setEmailAddress(e)}
                    />
                    <FormField
                        label="Password:"
                        value={password}
                        type="password"
                        onChange={pw => setPassword(pw)}
                    />
                    <FormField
                        label="Retype password:"
                        value={password2}
                        type="password"
                        onChange={pw => setPassword2(pw)}
                    />
                    <div className="login remark">(*optional)</div>
                    <div className="login button-container">
                        <Button
                            disabled={!username || !emailAddress || !password || password != password2}
                            width="316px"
                            onClick={() => doRegister()}
                        >
                            Submit
                        </Button>
                        <div className="login link-container">
                            <p>Already registered? <a href="/login">Log in here</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

export default Signup;
