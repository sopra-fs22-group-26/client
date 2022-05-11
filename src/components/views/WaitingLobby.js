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
    //
    // let content_left = invitees_left.map(invitee => {
    //     <ParticipantName username={invitee.username}/>
    // })
    //
    // let content_right = invitees_right.map(invitee => {
    //     <ParticipantName username={invitee.username}/>
    // })

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
                         enter a number<br></br> between given 1 to 24 hours. Then the poll will close.
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