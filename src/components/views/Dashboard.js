import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {isInCurrentWeek} from 'helpers/dateFuncs';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {Button} from "components/ui/Button";
import {Task} from "components/ui/Task";
import {EstimateTotals} from "components/ui/EstimateTotals";
import {LeftMenuItems} from "models/LeftMenuItems";
import 'styles/views/Dashboard.scss';
import 'styles/ui/LeftMenu.scss';
import React from "react";


const MenuSection = props => {
  // Generate section with corresponding menu items
  let menuSection = [];
  let menuItems = LeftMenuItems[props.section];
  for (const item in menuItems){
    menuSection.push(props.state === menuItems[item] ?
        (<li className="selected">{menuItems[item]}</li>)
        :(<li onClick={() => props.clickAction(menuItems[item])}>{menuItems[item]}</li>));
  }
  return (
      <div>
        <h3>{props.name}</h3>
        <ul>
          {menuSection}
        </ul>
      </div>
  );
};

const Dashboard = () => {
  const params = useParams();

  /**
   * Functions to manipulate tasks:
   * - delete and complete (directly)
   * - edit (redirect to edit page)
   * - calendar export
   */

  // Delete task
  function doTaskDelete(task) {
    if (window.confirm(`Do you really want to delete the task \"${task.title}\"?`)) {
      async function deleteTask() {
        try {
          const response = await api.delete(`/tasks/${task.taskId}`);
          console.log(response);
        } catch (error) {
          console.error(`Something went wrong while deleting the task: \n${handleError(error)}`);
          console.error("Details:", error);
          alert("Something went wrong while deleting the task! See the console for details.");
        }
      }
      deleteTask();
    }
  }

  function doTaskComplete(task) {
    if (window.confirm(`Do you really want to complete the task \"${task.title}\"?`)) {
      async function completeTask() {
        try {
          const requestBody = JSON.stringify({});
          const response = await api.put(`/tasks/${task.taskId}?updateStatus=completed`, requestBody);
          console.log(response);
        } catch (error) {
          console.error(`Something went wrong while updating the task: \n${handleError(error)}`);
          console.error("Details:", error);
          alert("Something went wrong while updating the task! See the console for details.");
        }
      }
      completeTask();
    }
  }

  // Edit task
  function doTaskEdit(task) {
    history.push('/editform/' + task.taskId);
  }

  // Export calendar file for a task
  // => needs to be implemented!
  function doTaskCalendarExport(task) {
    alert("Export calendar event for task with id " + task.taskId + "\n(Not implemented yet...)");
  }

  // Functions will be passed to task child component (for reference)
  const myTaskFunctions = {
    "completeTask": doTaskComplete,
    "editTask": doTaskEdit,
    "deleteTask": doTaskDelete,
    "exportCalendar": doTaskCalendarExport,
    "taskDetails": (t) => history.push('/task/' + t.taskId)
  }

  const history = useHistory();
  const [tasks, setTasks] = useState(null);

  /**
   * Filters and sorts
   */
  const [show, setShow] = useState(LeftMenuItems.TaskShow.Active);
  const [filter, setFilter] = useState(LeftMenuItems.TaskFilter.AllTasks);
  const [sort, setSort] = useState(LeftMenuItems.TaskSort.DueDate);
  const [estimate, setEstimate] = useState({currentWeek: 0, total: 0});

  const prioritySortOrder = ["HIGH", "MEDIUM", "LOW", "NONE"];

  useEffect(() => {
    async function fetchData() {

      // Apply show filter to fetch active or completed tasks
      let url = '/tasks';
      if (show === LeftMenuItems.TaskShow.Active) {
        url += '?show=active';
      }
      else if (show === LeftMenuItems.TaskShow.Completed) {
        url += '?show=completed';
      }

      try {
        // Get all tasks and users and store them temporarily
        let [r_tasks, r_users, r_assignedTasks] =
            await Promise.all([api.get(url),
              api.get('/users'),
              api.get(`/tasks/assignee/${localStorage.getItem("id")}`)]);

        // Replace all assignee and reporter ids with users' names or usernames
        let userArray = r_users.data.map(user => [user.id, (user.name ? user.name : user.username)]);
        const userDictionary = Object.fromEntries(userArray);

        let tasks = r_tasks.data;
        tasks.forEach(task => task.assignee_name = task.assignee ? userDictionary[task.assignee] : null);
        tasks.forEach(task => task.reporter_name = task.reporter ? userDictionary[task.reporter] : null);

        // Calculate Total Estimates for current user
        let estimates = {currentWeek: 0, total: 0};
        estimates.total = r_assignedTasks.data.reduce((acc, t) => acc + t.estimate, 0);
        estimates.currentWeek = r_assignedTasks.data.filter(t => isInCurrentWeek(new Date(t.dueDate))).reduce((acc, t) => acc + t.estimate, 0);
        setEstimate(estimates);

        // Apply filter and sorts

        // Filter tasks according to the current filter state
        if (filter === LeftMenuItems.TaskFilter.MyTasks) {
          tasks = tasks.filter(a => a.assignee === parseInt(localStorage.getItem("id")));
        }

        /**
         * Sort tasks according to the current sort state
         */
        switch (sort) {
            // Sort by DueDate
          case LeftMenuItems.TaskSort.DueDate:
            tasks = tasks.sort((a, b) => {
              if (a.dueDate === b.dueDate) {
                return prioritySortOrder.indexOf(a.priority) - prioritySortOrder.indexOf(b.priority);
              }
              else {
                return a.dueDate > b.dueDate;
              }
            });
            break;

            // Sort by Priority
          case LeftMenuItems.TaskSort.Priority:
            tasks = tasks.sort((a, b) => {
              if (a.priority === b.priority) {
                return a.dueDate > b.dueDate;
              }
              else {
                return prioritySortOrder.indexOf(a.priority) - prioritySortOrder.indexOf(b.priority);
              }
            });
            break;

            // Sort by Title
          case LeftMenuItems.TaskSort.Title:
            tasks = tasks.sort((a, b) => a.title > b.title);
            break;

            // Sort by Assignee
          case LeftMenuItems.TaskSort.Assignee:
            tasks = tasks.sort((a, b) => {
              if (a.assignee_name) {
                return a.assignee_name > b.assignee_name;
              }
              else {
                return 1;
              }
            });
            break;

            // Sort by Reporter
          case LeftMenuItems.TaskSort.Reporter:
            tasks = tasks.sort((a, b) => {
              if (a.reporter_name) {
                return a.reporter_name > b.reporter_name;
              }
              else {
                return 1;
              }
            });
            break;
        }

        // Get the returned tasks and update the state.
        setTasks(tasks);

        // See here to get more data.
        console.log(r_tasks);
        console.log(r_users);
      } catch (error) {
        console.error(`Something went wrong while fetching the tasks: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the tasks! See the console for details.");
      }
    }
    fetchData();
  }, [tasks]);

  // Create content
  let content = <div className="nothing">--- no tasks for current view ---</div>;

  if (tasks && tasks.length > 0) {
    content = tasks.map(task => (
        <Task props={task} key={task.id} taskFunctions={myTaskFunctions}/>
    ));
  }

  /**
   * Combine contents and display dashboard
   */
  return (
      <BaseContainer>
        <div className="base-container left-frame">
          <div className="left-menu">
            <MenuSection
                name="Show"
                section="TaskShow"
                state={show}
                clickAction={setShow}
            />
            <MenuSection
                name="Filter"
                section="TaskFilter"
                state={filter}
                clickAction={setFilter}
            />
            <MenuSection
                name="Sort"
                section="TaskSort"
                state={sort}
                clickAction={setSort}
            />
          </div>
        </div>
        <div className="base-container main-frame">
          <div className="dashboard task-area">
            {content}
          </div>
        </div>
        <div className="base-container right-frame">
          <div className="dashboard poll-session-frame">
            <h3>Estimate Poll Sessions</h3>
            <p>(Placeholder)</p>
          </div>
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

export default Dashboard;
