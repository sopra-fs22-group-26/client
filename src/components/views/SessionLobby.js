import {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import 'styles/views/SessionLobby.scss';
import React from "react";
import Select from "react-select";

// Define input text field component
const FormField = props => {
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
            />
        </div>
    );
};
FormField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    width: PropTypes.string,
    align: PropTypes.string,
    onChange: PropTypes.func
};

// Define REACT selection component
const ReactSelection = props => {
    return (
        <div className="creation-form field">
            <label className='creation-form label react-select'>
                {props.label}
            </label>
            <Select
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
                options={props.options}
                onChange={e => props.onChange(e ? e.value : null)}
                getOptionValue={(option) => option.value}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                })}
            />
        </div>
    );
};


const SessionLobby = () => {
    const history = useHistory();
    const [users, setUsers] = useState(null);
    const [participants, setParticipants] = useState(null);
    const [estimateThreshold, setThreshold] = useState(null);

    // Get all users to define options for invitees
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/users`);

                let tempUsers = response.data.map(user => {
                    let userOption = {};
                    userOption["label"] = (user.name ? user.name : user.username);
                    userOption["value"] = user.id;
                    return userOption;
                });

                // sort options alphabetically
                tempUsers = tempUsers.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase());
                setUsers(tempUsers);
                console.log('User list:', tempUsers);
            }
            catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();
    }, []);


    const startSession = async () => {
        try {
            const creatorId = localStorage.getItem("id");
            const taskId = localStorage.getItem("taskId");
            const requestBody = JSON.stringify({creatorId, taskId, estimateThreshold, participants});

            // const response = await api.post('/poll-meetings', requestBody);

            // After successful creation of a new poll navigate to /waitinglobby
            history.push('/waitinglobby');

        } catch (error) {
            alert(`Something went wrong during the creation: \n${handleError(error)}`);
        }
    }

    return (
        <BaseContainer>
            <div className="base-container left-frame">
            </div>
            <div className="base-container main-frame">
                <div className="session-lobby container">
                    <div className="session-lobby header1">
                        Estimate Poll Session Lobby
                    </div>
                    <div className="session-lobby header2">
                        Invite people with whom you want to play a fun round of "Estimate the Duration"!
                    </div>
                    <div id="form-container" className="creation-form container">
                        <div className="creation-form attributes-container attributes-column">
                            <ReactSelection
                                label="Search:"
                                options={users}
                                onChange={a => setParticipants(a)}
                            />
                        </div>
                        <div className="creation-form attributes-container attributes-column rightalign">
                            <FormField
                                label = "Set Threshold (h):"
                                type = "number"
                                min = "0"
                                width = "80px"
                                align = "right"
                                placeholder = "h"
                                value={estimateThreshold}
                                onChange={e => setThreshold(e)}
                            />
                        </div>
                    </div>
                    <div className="session-lobby footer">
                        <Button
                            className="menu-button"
                            onClick={() => startSession()}
                        >
                            Start the session
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}

export default SessionLobby;