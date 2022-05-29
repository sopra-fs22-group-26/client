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
    const [participants, setParticipants] = useState(null);
    const [taskTitle, setTaskTitle] = useState(null);

    // Get all users to define options for invitees
    useEffect(() => {
        async function fetchData() {
            try {
                const meetingId = params["meetingId"];
                const response = await api.get(`/poll-meetings/${meetingId}`,
                    { headers:{ Authorization: 'Bearer ' + localStorage.getItem('token')}});

                setEstimateThreshold(response.data.estimateThreshold);
                setTaskTitle(response.data.task.title);

                const participantsData = response.data.participants;
                setParticipants(participantsData);

                const pollStatus = response.data.status;
                if(pollStatus==="VOTING"){
                    history.push(`/votinglobby/${meetingId}`);
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
        },1700);
        return() => clearInterval(interval);
    }, []);

    let content_left = <div>Loading participants...</div>;
    let content_right = <div>participants name</div>

    // Create left and right columns of participants
    if(participants !== null && participants.length > 0){
        const half = Math.ceil(participants.length / 2)
        const participants_left = [];
        const participants_right = [];
        for (let i = 0; i < half; i++) {
            participants_left.push(
                <ParticipantName className={participants[i].status.toLowerCase()}>
                    {participants[i].user.username}
                </ParticipantName>
            );
        }
        for (let i = half; i < participants.length; i++){
            participants_right.push(
                <ParticipantName className={participants[i].status.toLowerCase()}>
                    {participants[i].user.username}
                </ParticipantName>
            )
        }
        content_left = participants_left;
        content_right = participants_right;
    }

    return (
        <BaseContainer>
            <div className="base-container left-frame">
            </div>
            <div className="base-container main-frame">
                <div className="waiting-lobby container">
                    <div className="waiting-lobby header1">
                        Estimate Poll Waiting Lobby for "{taskTitle}"
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