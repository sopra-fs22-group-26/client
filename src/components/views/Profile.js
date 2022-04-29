import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {Button} from "components/ui/Button";
import 'styles/views/Dashboard.scss';
import 'styles/views/Login.scss';
import User from "models/User";
import editIcon from "images/task_edit_icon.svg";


const Profile = () => {

    const history = useHistory();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(null);
    const [emailAddress, setEmailAddress] = useState(null);
    const [name, setName] = useState(null);
    const [birthDate, setBirthDate] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const id = localStorage.getItem("id");
                const response = await api.get(`/users/${id}`);

                // Get the returned user and update the state.
                setUser(response.data);
                setUsername(response.data.username);
                setName(response.data.name);
                setEmailAddress(response.data.emailAddress);
                setBirthDate(response.data.birthDate);

                //set new username for logout
                const user = new User(response.data);
                //localStorage.setItem('username', user.username);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the profile: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the profile! See the console for details.");
            }
        }
        fetchData();
    }, []);

    // Create content
    let content =
        <div className="dashboard task-area">
            <div className="nothing">--- no profile for current view ---</div>
        </div>

    if (user) {
        content =
            <div className="login container">
                <div className="login header">My Profile</div>
                <div className="login form">
                    <div className="login field">
                        <label className="login label">Name:</label>
                        <div className="login value-display">{name ? name : "-"}</div>
                    </div>
                    <div className="login field">
                        <label className="login label">Username:</label>
                        <div className="login value-display">{username}</div>
                    </div>
                    <div className="login field">
                        <label className="login label">E-Mail Address:</label>
                        <div className="login value-display">{emailAddress}</div>
                    </div>
                    <div className="login field">
                        <label className="login label">Birthdate:</label>
                        <div className="login value-display">{birthDate ? new Date(birthDate).toLocaleString('ch-DE', {dateStyle: 'medium'}) : "-"}</div>
                    </div>
                    <div className="login button-container edit-button">
                        <div onClick={() => history.push("/editProfile")} >
                            <img src={editIcon} alt="Edit task" />
                        </div>
                    </div>
                </div>
            </div>

        ;
    }

    // Combine contents and display dashboard
    return (
        <BaseContainer>
            <div className="base-container left-frame" />
            <div className="base-container main-frame">
                {content}
            </div>
            <div className="base-container right-frame">
                <div className="dashboard poll-session-frame">
                    <h3>Estimate Poll Sessions</h3>
                    <p>(Placeholder)</p>
                </div>
                <Button
                    onClick = { () => history.push('/creationform')}
                >
                    Create new task
                </Button>
            </div>
        </BaseContainer>
    );
}

export default Profile;