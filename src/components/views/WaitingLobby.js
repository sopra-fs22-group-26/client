import {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {ParticipantName} from 'components/ui/ParticipantName';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Task from 'models/Task';
import 'styles/views/WaitingLobby.scss';
import React from "react";
import Select from "react-select";

const WaitingLobby = () => {


    const history = useHistory();
    const [estimateThreshold, setEstimateThreshold] = useState(null);
    const [participants, setParticipants] = useState(null);
    const [tempParticipants,setTempParticipants] = useState(null);

    // Get all users to define options for invitees
    useEffect(() => {
        async function fetchData() {
            try {
                const meetingId = localStorage.getItem("meetingId");
                const response = await api.get(`/poll-meetings/${meetingId}`);
                console.log(response.data);
                const estimateThreshold = response.data.estimateThreshold;
                setEstimateThreshold(estimateThreshold);
                const participants = response.data.participants;
                setParticipants(participants);
                console.log(typeof participants);
                let tempParticipants = participants.map(participant => {
                        const participantName = participant.user.username;
                        return participantName;
                    });
                console.log(typeof tempParticipants);
                console.log(tempParticipants);
                setTempParticipants(tempParticipants);
                const pollStatus = response.data.status;
                if(pollStatus=="VOTING"){
                    history.push("/votinglobby");
                }
            }
            catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();
    }, [setTempParticipants]);

    let content_left = <div>participants name</div>;
    if(tempParticipants!==null){
        if (tempParticipants.length > 0){
            const half = Math.ceil(tempParticipants.length / 2)
            const participants_left = [];
            for (let i = 0; i < half; i++) {
                participants_left.push(tempParticipants[i]);
            }
            console.log(participants_left);
            console.log(typeof participants_left);
            content_left = participants_left.map(participant => (
                <ParticipantName>
                    {participant}
                </ParticipantName>));
        }
    }

    let content_right = <div>participants name</div>
    if(tempParticipants!==null) {
        if(tempParticipants.length > 0) {
            const half = Math.ceil(tempParticipants.length / 2)
            const participants_right = [];
            for (let i = half; i<tempParticipants.length; i++){
                participants_right.push(tempParticipants[i])};
            content_right = participants_right.map(participant => (
                <ParticipantName>
                    {participant}
                </ParticipantName>));
        }
    }

    return (
        <BaseContainer>
            <div className="base-container left-frame">
            </div>
            <div className="base-container main-frame">
                <div className="waiting-lobby container">
                    <div className="waiting-lobby header1">
                        Estimate Poll Session - Waiting Lobby
                    </div>
                    <div className="waiting-lobby header2">
                        Give your estimate. After the host started the poll, you have 60 seconds to
                         enter a number<br></br> between 0 to {estimateThreshold} hours. Then the poll will close.
                    </div>
                    <div className="waiting-lobby midtext">
                        Waiting for start
                    </div>
                    <div className="waiting-lobby participant-container">
                        <div className="waiting-lobby participant-container participant-left">
                            <div className="waiting-lobby participant-container participant-left name">
                                {content_left}
                            </div>
                        </div>
                        <div className="waiting-lobby participant-container participant-right">
                            <div className="waiting-lobby participant-container participant-right name">
                                {content_right}
                            </div>
                        </div>
                    </div>
                    <div className="waiting-lobby footer"/>

                </div>
            </div>
        </BaseContainer>
    );
}

export default WaitingLobby;