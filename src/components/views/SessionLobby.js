import {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Task from 'models/Task';
import 'styles/views/SessionLobby.scss';
import React from "react";
import Select from "react-select";

const SessionLobby = () => {

    return (
        <BaseContainer>
            <div className="base-container left-frame">
            </div>
            <div className="base-container main-frame">
                <div className="session-lobby container">
                    <div className="session-lobby header1">
                        Estimate Poll Session Lobby
                    </div>
                    <div className="session-lobby header2">
                        Invite people with whom you want to play a fun round of "Estimate the Duration"!
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
}

export default SessionLobby;