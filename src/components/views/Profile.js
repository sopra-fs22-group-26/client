import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {PollSessionMonitor} from "components/ui/PollSessionMonitor";
import {Button} from "components/ui/Button";
import 'styles/views/Dashboard.scss';
import 'styles/views/Login.scss';
import editIcon from "images/task_edit_icon.svg";
import {EstimateTotals} from "../ui/EstimateTotals";
import {isInCurrentWeek} from "../../helpers/dateFuncs";


const Profile = () => {

    const history = useHistory();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(null);
    const [emailAddress, setEmailAddress] = useState(null);
    const [name, setName] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    const [score, setScore] = useState(null);
    const [estimate, setEstimate] = useState({currentWeek: 0, total: 0});

    useEffect(() => {
        async function fetchData() {
            try {
                const id = localStorage.getItem("id");

                let [r_user, r_assignedTasks] =
                    await Promise.all([
                        api.get(`/users/${id}`),
                        api.get(`/tasks/assignee/${id}`)]);

                // Calculate Total Estimates for current user
                let estimates = {currentWeek: 0, total: 0};
                estimates.total = r_assignedTasks.data.reduce((acc, t) => acc + t.estimate, 0);
                estimates.currentWeek = r_assignedTasks.data.filter(t => isInCurrentWeek(new Date(t.dueDate))).reduce((acc, t) => acc + t.estimate, 0);
                setEstimate(estimates);

                // Get the returned user and update the state.
                setUser(r_user.data);
                setUsername(r_user.data.username);
                setName(r_user.data.name);
                setEmailAddress(r_user.data.emailAddress);
                setBirthDate(r_user.data.birthDate);
                setScore(r_user.data.score);
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
                    <div className="login field space-above">
                        <label className="login label">Task Score:</label>
                        <div className="login value-display">{score}</div>
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
                <PollSessionMonitor />
                <EstimateTotals
                    currentWeek={estimate.currentWeek}
                    total={estimate.total}
                />
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