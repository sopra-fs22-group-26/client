/**
 * Show temporary Estimate-Poll-Session Monitor on right side
 */

import "styles/ui/Button.scss"
import "styles/ui/PollSessionMonitor.scss"
import {api, handleError} from "helpers/api";
import {React, useState, useEffect} from "react";
import {Button} from "./Button";
import {useHistory} from "react-router-dom";
import {AuthUtil} from "helpers/authUtil";

/**
 * Poll-session-monitor components for invitations and running sessions
 */
const PendingInvitations = ({props}) => {
    // Generate running session element
    const history = useHistory();
    return (
        <div className="session-container invitation">
            <h4>{props.task.title}</h4>
            <p>Invited by: {props.creatorName}</p>
            <div className="button-container">
                <Button
                    className="menu-button default"
                    onClick={() => joinSession(props.meetingId, history)}
                >
                    Join
                </Button>
                <Button
                    className="menu-button"
                    onClick={() => declineInvitation(props.meetingId)}
                >
                    Decline
                </Button>
            </div>
        </div>
    );
};

const RunningSession = ({props}) => {
    // Generate running session element
    const history = useHistory();
    return (
        <div className="session-container">
            <h4>{props.task.title}</h4>
            <p>Organised by: {props.creatorName}</p>
            <div className="button-container">
                <Button
                    className="menu-button default"
                    onClick={() => joinSession(props.meetingId, history)}
                >
                    Join
                </Button>
            </div>
        </div>
    );
};

/**
 * Join a session
 */
async function joinSession(meetingId, history) {

    try {
        const requestBody = JSON.stringify({
            userId: localStorage.getItem("id")
        });
        const response = await api.put(`/poll-meetings/${meetingId}?action=join`, requestBody,
            { headers:{ Authorization: 'Bearer ' + localStorage.getItem('token')}});

        if (response != null) {
            if (String(response.data.creatorId) === localStorage.getItem("id")) {
                // navigate to Voting Lobby
                history.push(`/votinglobby/${meetingId}`);
            }
            else {
                // navigate to Waiting Lobby
                history.push(`/waitinglobby/${meetingId}`);
            }
        }
    } catch (error) {
        if (error.response.status === 401) {
            await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
        } else {
            console.error(`Something went wrong while joining the poll-session: \n${handleError(error)}`);
            alert("Something went wrong while joining the poll-session! See the console for details.");
        }
    }
}

/**
 * Decline an invitation
 */
async function declineInvitation(meetingId) {
    try {
        const requestBody = JSON.stringify({
            userId: localStorage.getItem("id")
        });
        await api.put(`/poll-meetings/${meetingId}?action=decline`, requestBody,
            { headers:{Authorization: 'Bearer ' + localStorage.getItem('token')}});
    } catch (error) {
        if (error.response.status === 401) {
            await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
        } else {
            console.error(`Something went wrong while declining the poll-session: \n${handleError(error)}`);
            alert("Something went wrong while declining the poll-session! See the console for details.");
        }
    }
}



/**
 * Fetch data for all running sessions
 */
export const PollSessionMonitor = () => {

    const [invitations, setInvitations] = useState(null);
    const [sessions, setSessions] = useState(null);

    useEffect(() => {

        // Fetch all running session
        async function getPollSessions() {
            try {
                const response = await api.get("/poll-meetings",
                    { headers: { Authorization: 'Bearer ' + localStorage.getItem('token')}});
                // Filter meetings: select only meetings with status OPEN or VOTING
                let meetings = response.data.filter(m => m.status === "OPEN" || m.status === "VOTING");

                // split meetings into invitations and runningSessions
                let pendingInvitations = [];
                let runningSessions = [];

                meetings.forEach(meeting => {
                    let invited = false;
                    meeting.participants.forEach(participant => {
                        if (participant.user.id === parseInt(localStorage.getItem("id"))
                            && participant.status === "INVITED")
                        {
                            invited = true;
                        }
                    });
                    if (invited) {
                        pendingInvitations.push(meeting);
                    }
                    else {
                        runningSessions.push(meeting);
                    }
                });
                setInvitations(pendingInvitations);
                setSessions(runningSessions);
            } catch (error) {
                if (error.response.status === 401) {
                    await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
                } else {
                    console.error(`Something went wrong while fetching the poll-sessions: \n${handleError(error)}`);
                    alert("Something went wrong while fetching the poll-sessions! See the console for details.");
                }
            }
        }

        getPollSessions();
        // Update data regularly
        const interval = setInterval(()=>{
            getPollSessions()
        },2900);
        return() => clearInterval(interval);


    },[]);

    // If there are pending invitations or running sessions, display session information.
    let monitorInvitations = <p className="no-session">No pending invitations</p>;
    let monitorRunning = <p className="no-session">No running sessions</p>;

    if (invitations && invitations.length > 0) {
        monitorInvitations = invitations.map(session => (
            <PendingInvitations props={session} />
        ));
    }

    if (sessions && sessions.length > 0) {
        monitorRunning = sessions.map(session => (
            <RunningSession props={session} />
        ));
    }

    /**
     * Display content
     */
    return (
        <div className="poll-session-monitor">
            <div className="poll-session-monitor psm-header">
                <h2>Estimate Poll Sessions</h2>
            </div>
            <div className="poll-session-monitor psm-body">
                <div className="poll-session-monitor psm-body psm-section">
                    <h3>Pending Invitations</h3>
                    <div>
                        {monitorInvitations}
                    </div>
                </div>
                <div className="poll-session-monitor psm-body psm-section">
                    <h3>Running Sessions</h3>
                    <div>
                        {monitorRunning}
                    </div>
                </div>
            </div>
        </div>
    );
}
