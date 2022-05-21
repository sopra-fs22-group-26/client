import {React, useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {ParticipantName} from 'components/ui/ParticipantName';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import 'styles/views/VotingLobby.scss';
import {Button} from "../ui/Button";

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
                max = {props.max}
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

const VotingLobby = () => {
    const history = useHistory();
    const params = useParams();
    const [estimateThreshold, setEstimateThreshold] = useState(null);
    const [participants, setParticipants] = useState(null);
    const [tempParticipants,setTempParticipants] = useState(null);
    const [meetingId, setMeetingId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [creatorId, setCreatorId] = useState(null);
    const [pollStatus, setPollStatus] = useState(null);
    const [voteInput, setVoteInput] = useState(null);
    const [averageEstimate, setAverageEstimate] = useState(null);
    const [participantMeName, setParticipantMeName] = useState(null);

    // Get all users to define options for invitees
    useEffect(() => {
        async function fetchData() {
            try {
                setMeetingId(params["meetingId"]);
                const response = await api.get(`/poll-meetings/${params["meetingId"]}`);

                setEstimateThreshold(response.data.estimateThreshold);

                const participantsData = response.data.participants;
                setParticipants(participantsData);

                setUserId(localStorage.getItem("id"));

                const responseCreatorId = response.data.creatorId;
                setCreatorId(responseCreatorId);

                const responsePollStatus = response.data.status;
                setPollStatus(responsePollStatus);

                setAverageEstimate(response.data.averageEstimate);

                let participantMe = participantsData.filter(participant => {
                    let id = participant.user.id;
                    if(String(id) === localStorage.getItem("id")){
                        return participant;
                    }
                });
                console.log(participantMe);

                let meName = participantMe.map(participant => {
                    return participant.user.username;
                })
                console.log(meName);
                setParticipantMeName(meName);

                let tempParticipantsFiltered = participantsData.filter(participant => {
                    let id = participant.user.id;
                    if(String(id) !== localStorage.getItem("id")){
                        return participant;
                    }
                });
                console.log("filtered",tempParticipantsFiltered);

                let tempParts = tempParticipantsFiltered.map(participant => {
                    return participant.user.username;
                    });

                console.log(tempParts);
                setTempParticipants(tempParts);

                if(responsePollStatus === "ENDED" && localStorage.getItem("id") != responseCreatorId){
                    history.push("/dashboard");
                }
            }
            catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();

        // Update data regularly
        const interval = setInterval(()=>{
            fetchData()
        },3000);
        return() => clearInterval(interval);
    }, [setTempParticipants]);


    const sendVote = async (vote) => {
        try {
            const requestBody = JSON.stringify({userId, vote});

            await api.put(`/poll-meetings/${meetingId}?action=vote`, requestBody);

        } catch (error) {
            alert(`Something went wrong during the creation: \n${handleError(error)}`);
        }
    }

    const startPoll = async () => {
        try {
            const requestBody = JSON.stringify({status: "VOTING"});

            await api.put(`/poll-meetings/${meetingId}`, requestBody);

        } catch (error) {
            alert(`Something went wrong during the creation: \n${handleError(error)}`);
        }
    }

    const endPoll = async () => {
        try {
            const requestBody = JSON.stringify({status: "ENDED"});

            await api.put(`/poll-meetings/${meetingId}`, requestBody);

        } catch (error) {
            alert(`Something went wrong during the creation: \n${handleError(error)}`);
        }
    }

    const leave = async () => {
        try {
            await api.delete(`/poll-meetings/${meetingId}`);

            history.push("/dashboard");
        } catch (error) {
            alert(`Something went wrong during the creation: \n${handleError(error)}`);
        }
    }

    function getVote(participant){
        for(const p of participants) {
            if (p["user"].name === participant || p["user"].username === participant) {
                return p["vote"];
            }
        }
    }

    let voter = <div>me</div>;
    if(participantMeName!==null){
        console.log(participantMeName);
        voter =
        [<ParticipantName>
            {participantMeName}
        </ParticipantName>,
            <FormField
                className = "voting-lobby participant-container participant-right vote-container"
                type = "number"
                min = "0"
                max = {estimateThreshold}
                value = {participantMeName == localStorage.getItem("username") ? voteInput : getVote(participantMeName)}
                width = "65px"
                align = "right"
                placeholder = "h"
                padding = "0.5px"
                disabled={participantMeName != localStorage.getItem("username") && pollStatus != "VOTING"}
                onChange={e => {
                    setVoteInput(e);
                    sendVote(e);
                }}
            />];
    }

    let content_left = <div>participants name</div>;
    if(tempParticipants!==null){
        if (tempParticipants.length > 0){
            const half = Math.ceil(tempParticipants.length / 2)
            const participants_left = [];
            for (let i = 0; i < half; i++) {
                participants_left.push(tempParticipants[i]);
            }
            content_left =
                    participants_left.map(participant => (
                        [   <ParticipantName>
                                {participant}
                            </ParticipantName>,
                            <div className="voting-lobby participant-container participant-left vote-container">
                                {getVote(participant)}
                            </div>
                        ]));
        }
    }

    let content_right = <div>participants name</div>
    if(tempParticipants!==null) {
        if(tempParticipants.length > 0) {
            const half = Math.ceil(tempParticipants.length / 2)
            const participants_right = [];
            for (let i = half; i<tempParticipants.length; i++){
                participants_right.push(tempParticipants[i])
            }
            content_right =
                participants_right.map(participant => (
                    [   <div className="voting-lobby participant-container participant-right vote-container">
                        {getVote(participant)}
                        </div>,
                        <ParticipantName>
                            {participant}
                        </ParticipantName>
                    ]));
        }
    }

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
                        Give your estimate. You have 60 seconds to enter a number between 0 to {estimateThreshold} hours.
                        <br/> Then the poll will close.
                    </div>
                    <div className="voting-lobby midtext">
                        The average is ...
                    </div>
                    <div className="voting-lobby participant-container">
                        <div className="voting-lobby participant-container participant-left">
                            <div className="voting-lobby participant-container participant-left name">
                                {content_left}
                            </div>
                        </div>
                        <div className="voting-lobby participant-container averageEstimate-container">
                            {averageEstimate}
                        </div>
                        <div className="voting-lobby participant-container participant-right">
                            <div className="voting-lobby participant-container participant-right name">
                                {content_right}
                                {voter}
                            </div>
                        </div>
                    </div>
                    <div className="voting-lobby footer">
                        <Button
                            disabled={localStorage.getItem("id")!=creatorId || pollStatus != "OPEN"}
                            onClick = { () => startPoll()}>
                            Start voting
                        </Button>
                        <Button
                            disabled={localStorage.getItem("id")!=creatorId || pollStatus=="ENDED"}
                            onClick = { () => endPoll()}>
                            End and confirm estimate
                        </Button>
                        <Button
                            disabled={localStorage.getItem("id")!=creatorId || pollStatus!="ENDED"}
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