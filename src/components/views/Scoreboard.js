import {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import 'styles/views/Scoreboard.scss';
import React from "react";
import Select from "react-select";



const Scoreboard = () => {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [names, setNames] = useState(null);
  const [scores, setScores] = useState(null);
  const [usernames, setUsernames] = useState(null);


  // Get all users to define options for assignee and reporter
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users`);

        let tempUsers = response.data;
        let tempScores;
        let tempNames;
        let tempUsernames;

        // sort users by score in descending order
        tempUsers = tempUsers.sort((a, b) => b.score - a.score);
        setUsers(tempUsers);
        console.log('User list:', tempUsers);
        /** 
        // Should already be in the right order
        setScores(tempScores = tempUsers.map(x => x.score));
        console.log('Score list:', tempScores);

        // Should already be in the right order
        setNames(tempNames = tempUsers.map(x => x.name));
        console.log('Name list:', tempNames);

        // Should already be in the right order
        setUsernames(tempUsernames = tempUsers.map(x => x.username));
        console.log('Username list:', tempUsernames);
        */
      }
      catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }
    fetchData();
  }, []); 

  let numbering = [];
  let rank = 0;
  for(let i = 0; i < users.length; i++) {
    rank++;
    numbering.push(rank);
  }

  const nameList = users.map(x => 
    <div className="score-board name-entry">{x.name}:</div>
  );

  const scoreList = users.map(x =>
    <div className="score-board score-entry">{x.score}</div>
  );

  const ranking = numbering.map(x =>
    <div className="score-board name-entry">{x}.</div>
  );

  return (
      <BaseContainer>
        <div className="base-container left-frame"></div>
        <div className="base-container main-frame">
          <div className="score-board container">
            <div className="score-board header">
              Scoreboard
            </div>
            <div className="score-board scores-container">
              <div>{ranking}</div>
              <div>{nameList}</div>
              <div>{scoreList}</div>
            </div>
          </div>
        </div>
      </BaseContainer>
  );
}

export default Scoreboard;