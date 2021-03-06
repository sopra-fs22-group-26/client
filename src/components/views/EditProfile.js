import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import moment from "moment";
import {AuthUtil} from "helpers/authUtil";
import ErrorMessage from "../ui/ErrorMessage";
import isEmail from "validator/es/lib/isEmail";

const FormField = props => {
    let inputClassName = "creation-form input";
    if (props.error) {
        inputClassName += " error";
    }
    if(props.type != "date"){
        return (
            <div className="creation-form field">
                <label className= 'creation-form label'>
                    {props.label}
                </label>
                <input
                    className ={inputClassName}
                    type = {props.type}
                    min = {props.min}
                    placeholder = {props.placeholder}
                    value = {props.value}
                    onChange = {e => props.onChange(e.target.value)}
                    style={{width: props.width, textAlign: props.align}}
                />
            </div>
        );}
    else{
        return (
            <div className="creation-form field">
                <label className= 'creation-form label'>
                    {props.label}
                </label>
                <input
                    type = {props.type}
                    min = {props.min}
                    className = "creation-form input"
                    placeholder = {props.placeholder}
                    value = {props.value}
                    onChange = {e => props.onChange(e.target.value)}
                    style={{width: props.width, textAlign: props.align}}
                    max={moment().format("YYYY-MM-DD")}
                />
            </div>
        );
    }
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func
};
const EditProfile = () => {

    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [emailAddress, setEmailAddress] = useState(null);
    const [name, setName] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    const [password, setPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [passwordNew2, setPasswordNew2] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);



    useEffect(() => {
        async function fetchData() {
            try {
                const id = localStorage.getItem("id");
                const response = await api.get(`/users/${id}`,
                    { headers:{ Authorization: 'Bearer ' + localStorage.getItem('token')}});

                // Get the returned user and update the state.
                setName(response.data.name);
                setUsername(response.data.username);
                setEmailAddress(response.data.emailAddress);
                setBirthDate(response.data.birthDate);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                if (error.response.status === 401) {
                    await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
                    setTimeout(fetchData, 200);
                } else {
                    console.error(`Something went wrong while fetching the profile: \n${handleError(error)}`);
                    console.error("Details:", error);
                    alert("Something went wrong while fetching the profile! See the console for details.");
                }
            }
        }
        fetchData();
    }, []);

    const doUpdate = async () => {
        try {
            const id = localStorage.getItem('id');
            const requestBody = JSON.stringify({id, name, username, emailAddress, birthDate, password, newPassword});
            await api.put(`/users/${id}`, requestBody,
                { headers:{ Authorization: 'Bearer ' + localStorage.getItem('token')}});

            localStorage.setItem('username', username);
            if (name) {
                localStorage.setItem('name', name);
            }
            else {
                localStorage.removeItem('name');
            }
            await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));

            //alert("Your profile has been successfully edited!")
            history.push(`/profile`);
        } catch (error) {
            if (error.response.status === 401) {
                await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
                setTimeout(doUpdate, 200);
            } else {
                setErrorMessage(error.response.data.message);
            }
        }
    };

    return (
        <BaseContainer className="single-frame">
            <div className="login container">
                <div className="login header">Edit Profile</div>
                <div className="login form">
                    <FormField
                        label="Name:"
                        placeholder="choose name..."
                        value={name}
                        onChange={n => setName(n)}
                    />
                    <FormField
                        label="Username:"
                        placeholder="choose username..."
                        value={username}
                        onChange={un => {setUsername(un); setErrorMessage(null)}}
                    />
                    <FormField
                        label="E-mail address:"
                        value={emailAddress}
                        type = "email"
                        error={emailAddress != null && !isEmail(emailAddress)}
                        onChange={e => {setEmailAddress(e); setErrorMessage(null)}}
                    />
                    <FormField
                        label="Birth Date:"
                        value={birthDate}
                        type="date"
                        onChange={e => setBirthDate(e)}
                    />

                    <div className="login section-title">Change password:</div>

                    <FormField
                        label="Current Password:"
                        value={password}
                        type="password"
                        onChange={e => setPassword(e)}
                    />
                    <FormField
                        label="New Password:"
                        value={newPassword}
                        type="password"
                        onChange={e => setNewPassword(e)}

                    />
                    <FormField
                        label="Retype new Password:"
                        value={passwordNew2}
                        type="password"
                        error={passwordNew2 != null && passwordNew2 !== "" && newPassword !== passwordNew2}
                        onChange = {e => setPasswordNew2(e)}

                    />
                    <ErrorMessage message={errorMessage} />
                    <div className="login button-container multi-button">
                        <Button
                            className="menu-button"
                            onClick={() => history.push(`/profile`)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="menu-button default"
                            disabled={!username || (newPassword !== passwordNew2) || (newPassword && !password)
                                || !emailAddress || !isEmail(emailAddress)}
                            onClick={() => doUpdate()}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

export default EditProfile;