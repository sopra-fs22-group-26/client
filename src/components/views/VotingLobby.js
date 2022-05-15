import {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {ParticipantName} from 'components/ui/ParticipantName';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Task from 'models/Task';
import 'styles/views/VotingLobby.scss';
import React from "react";
import Select from "react-select";
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
    const [estimateThreshold, setEstimateThreshold] = useState(null);
    const [participants, setParticipants] = useState(null);
    const [tempParticipants,setTempParticipants] = useState(null);
    const [meetingId, setMeetingId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [creatorId, setCreatorId] = useState(null);
    const [pollStatus, setPollStatus] = useState(null);
    const [voteInput, setVoteInput] = useState(null);

    // Get all users to define options for invitees
    useEffect(() => {
        async function fetchData() {
            try {
                const meetingId = localStorage.getItem("meetingId");
                setMeetingId(meetingId);
                const response = await api.get(`/poll-meetings/${meetingId}`);
                console.log(response.data);
                const estimateThreshold = response.data.estimateThreshold;
                setEstimateThreshold(estimateThreshold);
                const participants = response.data.participants;
                setParticipants(participants);
                console.log(participants);
                const userId = localStorage.getItem("id");
                setUserId(userId);
                const creatorId = response.data.creatorId;
                setCreatorId(creatorId);
                const pollStatus = response.data.status;
                setPollStatus(pollStatus);

                let tempParticipants = participants.map(participant => {
                        const participantName = participant.user.username;
                        return participantName;
                    });
                console.log(typeof tempParticipants);
                console.log(tempParticipants);
                setTempParticipants(tempParticipants);

                if(pollStatus=="ENDED"){
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

            const response = await api.put(`/poll-meetings/${meetingId}?action=vote`, requestBody);

        } catch (error) {
            alert(`Something went wrong during the creation: \n${handleError(error)}`);
        }
    }

    const startPoll = async () => {
        try {
            const requestBody = JSON.stringify({status: "VOTING"});

            const response = await api.put(`/poll-meetings/${meetingId}`, requestBody);

        } catch (error) {
            alert(`Something went wrong during the creation: \n${handleError(error)}`);
        }
    }

    const endPoll = async () => {
        try {
            const requestBody = JSON.stringify({status: "ENDED"});

            const response = await api.put(`/poll-meetings/${meetingId}`, requestBody);
            history.push("/dashboard");
        } catch (error) {
            alert(`Something went wrong during the creation: \n${handleError(error)}`);
        }
    }

    function getVote(participant){
        console.log(participant);
        for(let i=0;i< participants.length;i++){
            console.log(participants[i]);
            if(participants[i]["user"].name==participant || participants[i]["user"].username==participant){
                return participants[i]["vote"];
            }
        }
    }

    let content_left = <div>participants name</div>;
    if(tempParticipants!==null){
        if (tempParticipants.length > 0){
            const half = Math.ceil(tempParticipants.length / 2)
            const participants_left = [];
            for (let i = 0; i < half; i++) {
                participants_left.push(tempParticipants[i]);
            }
            console.log(participants_left);
            console.log(participants_left[1]!="1");
            content_left =
                    participants_left.map(participant => (
                        [   <ParticipantName>
                                {participant}
                            </ParticipantName>,
                            <FormField
                                className = "waiting-lobby participant-container participant-left form"
                                type = "number"
                                min = "0"
                                max = {estimateThreshold}
                                value = {participant==localStorage.getItem("username")? voteInput : getVote(participant)}
                                width = "80px"
                                align = "right"
                                placeholder = "h"
                                disabled={participant!=localStorage.getItem("username")&&pollStatus!="VOTING"}
                                onChange={e => {
                                    const voteInput = e;
                                    setVoteInput(voteInput);
                                    sendVote(e);
                                }}
                            />
                        ]));
        }
    }

    let content_right = <div>participants name</div>
    if(tempParticipants!==null) {
        if(tempParticipants.length > 0) {
            const half = Math.ceil(tempParticipants.length / 2)
            const participants_right = [];
            for (let i = half; i<tempParticipants.length; i++){
                participants_right.push(tempParticipants[i])};
            content_right =
                participants_right.map(participant => (
                    [   <FormField
                            className = "waiting-lobby participant-container participant-left form"
                            type = "number"
                            min = "0"
                            max = {estimateThreshold}
                            value = {participant==localStorage.getItem("username")? voteInput : getVote(participant)}
                            width = "80px"
                            align = "right"
                            placeholder = "h"
                            disabled={participant!=localStorage.getItem("username")&&pollStatus!="VOTING"}
                            onChange={e => {
                                const voteInput = e;
                                setVoteInput(voteInput);
                                sendVote(e);
                            }}
                        />,
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
                        <br></br> Then the poll will close.
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
                        <div className="voting-lobby participant-container participant-right">
                            <div className="voting-lobby participant-container participant-right name">
                                {content_right}
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
                            disabled={localStorage.getItem("id")!=creatorId}
                            onClick = { () => endPoll()}>
                            End and Confirm estimate
                        </Button>
                    </div>

                </div>
            </div>
        </BaseContainer>
    );
}

export default VotingLobby;