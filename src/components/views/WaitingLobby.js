import {React, useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {ParticipantName} from 'components/ui/ParticipantName';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import 'styles/views/WaitingLobby.scss';
import {Default} from 'react-spinners-css';
import {AuthUtil} from "helpers/authUtil";


const WaitingLobby = () => {
    const history = useHistory();
    const params = useParams();
    const [estimateThreshold, setEstimateThreshold] = useState(null);
    const [tempParticipants,setTempParticipants] = useState(null);

    // Get all users to define options for invitees
    useEffect(() => {
        async function fetchData() {
            try {
                const meetingId = params["meetingId"];
                const response = await api.get(`/poll-meetings/${meetingId}`,
                    { headers:{ Authorization: 'Bearer ' + localStorage.getItem('token')}});

                setEstimateThreshold(response.data.estimateThreshold);

                const participants = response.data.participants;
                let tempParts = participants.map(participant => {
                    return participant.user.username;
                });
                setTempParticipants(tempParts);

                const pollStatus = response.data.status;
                if(pollStatus==="VOTING"){
                    history.push(`/votinglobby/${meetingId}`);
                }
            }
            catch (error) {
                if (error.response.status === 401) {
                    await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
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
        },1700);
        return() => clearInterval(interval);
    }, [setTempParticipants]);

    let content_left = <div>participants name</div>;
    if(tempParticipants!==null){
        if (tempParticipants.length > 0){
            const half = Math.ceil(tempParticipants.length / 2)
            const participants_left = [];
            for (let i = 0; i < half; i++) {
                participants_left.push(tempParticipants[i]);
            }
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
                participants_right.push(tempParticipants[i])
            }
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
                         enter a number<br/> between 0 to {estimateThreshold} hours. Then the poll will close.
                    </div>
                    <div className="waiting-lobby midtext">
                        Waiting for start
                    </div>
                    <div className="waiting-lobby participant-container">
                        <div className="waiting-lobby participant-container participant-left">
                            {content_left}
                        </div>
                        <div className="waiting-lobby participant-container spinner">
                            <Default color="black"/>
                        </div>
                        <div className="waiting-lobby participant-container participant-right">
                            {content_right}
                        </div>
                    </div>
                    <div className="waiting-lobby footer"/>

                </div>
            </div>
        </BaseContainer>
    );
}

export default WaitingLobby;