import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {Button} from "components/ui/Button";
import 'styles/views/Dashboard.scss';
import 'styles/views/Login.scss';
import User from "../../models/User";




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
                setEmailAddress(response.data.emailAddress);
                setName(response.data.name);
                setBirthDate(response.data.birthDate);


                //set new username for logout
                const user = new User(response.data);
                localStorage.setItem('username', user.username);

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
    let content = <div className="nothing">--- no profile for current view ---</div>;

    if (user) {
        content =
            <div className="login container">
                <h1>{name}'s Profile:</h1>
                <h3>Name: {name}</h3>
                <h3>Username: {username}</h3>
                <h3>E-Mail Address: {emailAddress}</h3>
                <h3>Birth Date: {birthDate}</h3>
                <Button  className="menu-button"
                    onClick={ () => history.push("/editProfile")}
                >
                    Edit Profile
                </Button>
            </div>

        ;
    }

    // Combine contents and display dashboard
    return (
        <BaseContainer>
            <div className="base-container left-frame">
                [left menu(?)]
            </div>
            <div className="base-container main-frame">
                <div className="dashboard task-area">
                    {content}
                </div>
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