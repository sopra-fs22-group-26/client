import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {Button} from "components/ui/Button";
import {Task} from "components/ui/Task"
import 'styles/views/Dashboard.scss';

const Dashboard = () => {
  const params = useParams();
  // Temporary functions to manipulate tasks
  // => need to be implemented!
  function doTaskDelete(task_id) {
   const response = api.delete(`/tasks/`+task_id);
   history.push('/dashboard');
  }
  function doTaskCalendarExport(task_id) {
    alert("Export calendar event for task with id " + task_id + "\n(Not implemented yet...)");
  }
  function doTaskComplete(task_id) {
    alert("Complete task with id " + task_id + "\n(Not implemented yet...)");
  }
  function doTaskEdit(task_id) {
    history.push('/editform/'+task_id);
  }

  // Functions will be passed to task child component (for reference)
  const myTaskFunctions = {
    "completeTask": doTaskComplete,
    "editTask": doTaskEdit,
    "deleteTask": doTaskDelete,
    "exportCalendar": doTaskCalendarExport
  }

  const history = useHistory();
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/tasks');

        // Get the returned tasks and update the state.
        setTasks(response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(`Something went wrong while fetching the tasks: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the tasks! See the console for details.");
      }
    }
    fetchData();
  }, []);

  // Create content
  let content = <div className="nothing">--- no tasks for current view ---</div>;

  if (tasks) {
    content = tasks.map(task => (
        <Task props={task} key={task.id} taskFunctions={myTaskFunctions}/>
    ));
  }

  // Combine contents and display dashboard
  return (
      <BaseContainer>
        <div className="base-container left-frame">
          [left menu]
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
