import {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {PollSessionMonitor} from "components/ui/PollSessionMonitor";
import 'styles/views/Scoreboard.scss';
import React from "react";
import {EstimateTotals} from "../ui/EstimateTotals";
import {Button} from "../ui/Button";
import {isInCurrentWeek} from "../../helpers/dateFuncs";
import {AuthUtil} from "../../helpers/authUtil";


const Scoreboard = () => {
  const [users, setUsers] = useState([]);
  const [estimate, setEstimate] = useState({currentWeek: 0, total: 0});
  const history = useHistory();

  // Get all users to define options for assignee and reporter
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')}
        });

        const id = localStorage.getItem("id");
        let [r_users, r_assignedTasks] =
            await Promise.all([
              api.get(`/users/`,{
                headers: {
                  Authorization: 'Bearer ' + localStorage.getItem('token')}
              }),
              api.get(`/tasks/assignee/${id}`, {
                headers: {
                  Authorization: 'Bearer ' + localStorage.getItem('token')}
              })
            ]);

        let tempUsers = r_users.data;

        // sort users by score in descending order
        tempUsers = tempUsers.sort((a, b) => b.score - a.score);
        setUsers(tempUsers);
        console.log('User list:', tempUsers);

        // Calculate Total Estimates for current user
        let estimates = {currentWeek: 0, total: 0};
        estimates.total = r_assignedTasks.data.reduce((acc, t) => acc + t.estimate, 0);
        estimates.currentWeek = r_assignedTasks.data.filter(t => isInCurrentWeek(new Date(t.dueDate))).reduce((acc, t) => acc + t.estimate, 0);
        setEstimate(estimates);
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
          <EstimateTotals
              currentWeek={estimate.currentWeek}
              total={estimate.total}
          />
          <Button
              onClick = { () => history.push('/creationform')}
          >
            Create new task
          </Button>
        </div>
      </BaseContainer>
  );
}

export default Scoreboard;