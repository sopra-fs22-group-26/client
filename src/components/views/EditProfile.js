import React, {useEffect, useState} from 'react';
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
const EditProfile = props => {

    const history = useHistory();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(null);
    const [emailAddress, setEmailAddress] = useState(null);
    const [name, setName] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    const [password, setPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [passwordNew2, setPasswordNew2] = useState(null);



    useEffect(() => {
        async function fetchData() {
            try {
                const id = localStorage.getItem("id");
                const response = await api.get(`/users/${id}`);

                // Get the returned user and update the state.
                setUser(response.data);
                setUsername(response.data.username);
                setEmailAddress(response.data.emailAddress);
                setName(response.data.name);
                setBirthDate(response.data.birthDate);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the tasks: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the tasks! See the console for details.");
            }
        }
        fetchData();
    }, []);

    const doUpdate = async () => {
        try {
            const id = localStorage.getItem('id');
            const requestBody = JSON.stringify({id, name, username, emailAddress, birthDate, password, newPassword});
            const response = await api.put(`/users/${id}`, requestBody);
            //set new username for logout
            localStorage.setItem('username', user.username);

            history.push(`/profile`);
            alert("Your profile has been successfully edited!")
        } catch (error) {
            alert(`Something went wrong during edit: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer className="single-frame centered">
            <div className="login container">
                <div className="login header">Edit {name}'s Profile</div>
                <div className="login form">
                    <FormField
                        label="Name:"
                        value={name}
                        disabled={name}
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
                        type = "email"
                        onChange={e => setEmailAddress(e)}
                    />
                    <FormField
                        label="Birth Date:"
                        value={birthDate}
                        type="date"
                        onChange={e => setBirthDate(e)}
                    />
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
                        onChange = {e => setPasswordNew2(e)}

                    />
                    <div className="login button-container">
                        <Button
                            disabled={newPassword != passwordNew2}
                            width="316px"
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