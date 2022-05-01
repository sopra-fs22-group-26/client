import {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {PollSessionMonitor} from "components/ui/PollSessionMonitor";
import 'styles/views/Scoreboard.scss';
import React from "react";


const Scoreboard = () => {
  const [users, setUsers] = useState([]);

  // Get all users to define options for assignee and reporter
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users`);

        let tempUsers = response.data;

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

    // Update data regularly
    const interval = setInterval(()=>{
      fetchData()
    },5000);
    return() => clearInterval(interval);

  }, []);

  let numbering = [];
  let rank = 0;
  for(let i = 0; i < users.length; i++) {
    rank++;
    numbering.push(rank);
  }

  const ranking = numbering.map(x =>
      <div className="score-board rank-entry">{x}.</div>
  );

  const nameList = users.map(x =>
    <div className="score-board name-entry">{x.name ? x.name : x.username}:</div>
  );

  const scoreList = users.map(x =>
    <div className="score-board score-entry">{x.score}</div>
  );

  return (
      <BaseContainer>
        <div className="base-container left-frame"></div>
        <div className="base-container main-frame centered">
          <div className="score-board container">
            <div className="score-board header">
              Scoreboard
            </div>
            <div className="score-board scores-container">
              <div className="score-board left-frame">
                <div>{ranking}</div>
                <div>{nameList}</div>
              </div>
              <div>{scoreList}</div>
            </div>
          </div>
        </div>
        <div className="base-container right-frame">
          <PollSessionMonitor />
        </div>
      </BaseContainer>
  );
}

export default Scoreboard;