import {React, useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {ParticipantName} from 'components/ui/ParticipantName';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import 'styles/views/VotingLobby.scss';
import {Button} from "../ui/Button";
import {AuthUtil} from "helpers/authUtil";

// Define input text field component
const FormField = props => {
    return (
        <div className="voting-lobby field">
            <input
                type = {props.type}
                min = {props.min}
                max = {props.max}
                className = "voting-lobby input"
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
    onChange: PropTypes.func,
};


const ParticipantColumn = props => {
    return (
        <div className={`voting-lobby participant-container ${props.className} name-vote`}>
            <ParticipantName className={props.status.toLowerCase()}>
                {props.username}
            </ParticipantName>
            <div className={`voting-lobby participant-container ${props.className} vote-container ${props.status.toLowerCase()}`}>
                {props.vote}
            </div>
        </div>
    );
}


const VotingLobby = () => {
    const history = useHistory();
    const params = useParams();
    const [estimateThreshold, setEstimateThreshold] = useState(null);
    const [meetingId, setMeetingId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [creatorId, setCreatorId] = useState(null);
    const [pollStatus, setPollStatus] = useState(null);
    const [voteInput, setVoteInput] = useState(null);
    const [averageEstimate, setAverageEstimate] = useState(null);
    const [participants, setParticipants] = useState(null);
    const [otherParticipants,setOtherParticipants] = useState(null);
    const [participantMeName, setParticipantMeName] = useState(null);

    // Get all users to define options for invitees
    useEffect(() => {
        async function fetchData() {
            try {
                setMeetingId(params["meetingId"]);
                const response = await api.get(`/poll-meetings/${params["meetingId"]}`,
                    { headers:{ Authorization: 'Bearer ' + localStorage.getItem('token')}});

                setEstimateThreshold(response.data.estimateThreshold);

                const participantsData = response.data.participants;
                setParticipants(participantsData);

                setUserId(localStorage.getItem("id"));

                const responseCreatorId = response.data.creatorId;
                setCreatorId(responseCreatorId);

                const responsePollStatus = response.data.status;
                setPollStatus(responsePollStatus);

                let avgEstimate = response.data.averageEstimate;
                setAverageEstimate(avgEstimate);

                // Extract information of current user
                let participantMe = participantsData.filter(
                    participant => String(participant.user.id) === localStorage.getItem("id"));
                let meName = participantMe.map(participant => {
                    return participant.user.username;
                })
                setParticipantMeName(meName);

                // Filter other participants
                let participantsFiltered = participantsData.filter(
                    participant => String(participant.user.id) !== localStorage.getItem("id"));
                setOtherParticipants(participantsFiltered);

                if(responsePollStatus === "ENDED" && localStorage.getItem("id") != responseCreatorId){
                    alert(`The voting has ended with an estimate of ${avgEstimate}.\n` +
                        `You can leave the session now.\n` +
                        `Thanks for joining!`);
                    history.push("/dashboard");
                }
            }
            catch (error) {
                if (error.response.status === 401) {
                    await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
                    setTimeout(fetchData, 200);
                } else {
                    console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                    console.error("Details:", error);
                    alert("Something went wrong while fetching the users! See the console for details.");
                }
            }
        }
        fetchData();

        // Update data regularly
        const interval = setInterval(()=>{
            fetchData()
        },1500);
        return() => clearInterval(interval);
    }, []);


    const sendVote = async (vote) => {
        try {
            const requestBody = JSON.stringify({userId, vote});

            await api.put(`/poll-meetings/${meetingId}?action=vote`, requestBody,
                { headers:{ Authorization: 'Bearer ' + localStorage.getItem('token')}});

        } catch (error) {
            if (error.response.status === 401) {
                await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
                setTimeout(sendVote, 200);
            } else {
                alert(`Something went wrong during the creation: \n${handleError(error)}`);
            }
        }
    }

    const startPoll = async () => {
        try {
            const requestBody = JSON.stringify({status: "VOTING"});

            await api.put(`/poll-meetings/${meetingId}`, requestBody,
                { headers:{ Authorization: 'Bearer ' + localStorage.getItem('token')}});
        } catch (error) {
            if (error.response.status === 401) {
                await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
                setTimeout(startPoll, 200);
            } else {
                alert(`Something went wrong during the creation: \n${handleError(error)}`);
            }
        }
    }

    const endPoll = async () => {
        try {
            const requestBody = JSON.stringify({status: "ENDED"});

            await api.put(`/poll-meetings/${meetingId}`, requestBody,
                { headers:{ Authorization: 'Bearer ' + localStorage.getItem('token')}});
        } catch (error) {
            if (error.response.status === 401) {
                await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
                setTimeout(endPoll, 200);
            } else {
                alert(`Something went wrong during the creation: \n${handleError(error)}`);
            }
        }
    }

    const leave = async () => {
        try {
            await api.delete(`/poll-meetings/${meetingId}`,
                { headers:{ Authorization: 'Bearer ' + localStorage.getItem('token')}});
            history.push("/dashboard");
        } catch (error) {
            if (error.response.status === 401) {
                await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
                setTimeout(leave, 200);
            } else {
                alert(`Something went wrong during the creation: \n${handleError(error)}`);
            }
        }
    }

    function getVote(participant){
        for(const p of participants) {
            if (p["user"].username === participant) {
                return p["vote"];
            }
        }
    }

    let voter = <div>me</div>;
    if(participantMeName !== null){
        voter =
            [<div className="voting-lobby participant-container participant-right name-vote">
                <ParticipantName>
                    {participantMeName}
                </ParticipantName>
                <div className="voting-lobby participant-container participant-right input-container">
                    <FormField
                        className = "voting-lobby input"
                        type = "number"
                        min = "0"
                        max = {estimateThreshold}
                        value = {participantMeName == localStorage.getItem("username")? voteInput : getVote(participantMeName)}
                        width = "100%"
                        align = "right"
                        placeholder = "h"
                        onChange={e => {
                            setVoteInput(e);
                            sendVote(e);
                        }}
                    />
                </div>
            </div>
            ];
    }

    // Create voter columns
    let content_left = [];
    let content_right = [];

    if(otherParticipants !== null){
        if (otherParticipants.length > 0){
            const half = Math.ceil(otherParticipants.length / 2)

            for (let i = 0; i < half; i++) {
                content_left.push(
                    <ParticipantColumn
                        className="participant-left"
                        status={otherParticipants[i].status}
                        username={otherParticipants[i].user.username}
                        vote={getVote(otherParticipants[i].user.username)}
                    />
                );
            }
            for (let i = half; i < otherParticipants.length; i++) {
                content_right.push(
                    <ParticipantColumn
                        className="participant-right"
                        status={otherParticipants[i].status}
                        username={otherParticipants[i].user.username}
                        vote={getVote(otherParticipants[i].user.username)}
                    />
                );
            }
        }
    }

    // Define estimate slider
    const slider_color = "#FFB30E";
    let slider_height = 100 * Math.min(1, averageEstimate / estimateThreshold);

    return (
        <BaseContainer>
            <div className="base-container left-frame">
            </div>
            <div className="base-container main-frame">
                <div className="voting-lobby container">
                    <div className="voting-lobby header1">
                        Estimate Poll Session
                    </div>
                    <div className="voting-lobby header2">
                        Give your estimate. You have 60 seconds to enter a number between 0 to {estimateThreshold} hours.<br/>
                        Then the poll will close.
                    </div>
                    <div className="voting-lobby midtext">
                        The average is ...
                    </div>
                    <div className="voting-lobby participant-container">
                        <div className="voting-lobby participant-container participant-left">
                            {content_left}
                        </div>
                        <div
                            className="voting-lobby participant-container averageEstimate-container"
                            style={{background: `linear-gradient(to top, ${slider_color} ${slider_height}%, white ${slider_height}% )`}}
                        >
                            {averageEstimate}
                        </div>
                        <div className="voting-lobby participant-container participant-right">
                            {content_right}
                            {voter}
                        </div>
                    </div>
                    <div className="voting-lobby footer">
                        <Button
                            disabled={localStorage.getItem("id") != creatorId || pollStatus != "OPEN"}
                            onClick = { () => startPoll()}>
                            Start voting
                        </Button>
                        <Button
                            disabled={localStorage.getItem("id") != creatorId || pollStatus == "ENDED"}
                            onClick = { () => endPoll()}>
                            End and confirm estimate
                        </Button>
                        <Button
                            disabled={localStorage.getItem("id") != creatorId || pollStatus != "ENDED"}
                            onClick = { () => leave()}>
                            Leave the session
                        </Button>
                    </div>

                </div>
            </div>
        </BaseContainer>
    );
}

export default VotingLobby;