import {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Task from 'models/Task';
import 'styles/views/WaitingLobby.scss';
import React from "react";
import Select from "react-select";
import {ParticipantName} from "../ui/ParticipantName";

const WaitingLobby = () => {


    const history = useHistory();
    const [estimateThreshold, setEstimateThreshold] = useState(null);
    const [participants, setParticipants] = useState(null);

    const participants_left = participants[]

    let content_left = participants_left.map(participant => {
        <ParticipantName username={participant.username}/>
    })

    let content_right = participants_right.map(participant => {
        <ParticipantName username={participant.username}/>
    })

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
            }
            catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();
    }, []);


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
                         enter a number<br></br> between given 0 to {estimateThreshold} hours. Then the poll will close.
                    </div>
                    <div className="waiting-lobby participant-container">
                        <div className="participants left-frame">
                            <div className="waiting-lobby participant-area">
                                {/*{content_left}*/}
                            </div>
                        </div>
                        <div className="participants right-frame">
                            <div className="waiting-lobby participant-area">
                                {/*{content_right}*/}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </BaseContainer>
    );
}

export default WaitingLobby;