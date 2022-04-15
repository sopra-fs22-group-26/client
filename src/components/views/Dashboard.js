import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import editIcon from "../../images/task_edit_icon.svg"
import {CreationButton} from 'components/ui/CreationButton';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import 'styles/views/Dashboard.scss';
import {Button} from "../ui/Button";
import {Spinner} from "../ui/Spinner";


const Task = ({task}) => (
    <div className="dashboard task-container">
      <div className="dashboard task-header">{task.title}</div>
      <div className="dashboard task-content">
        <div>Description: {task.description}</div>
        <div>Priority: {task.priority}</div>
        <div>Estimate {task.estimate}h</div>
        <div>Location {task.location}</div>
      </div>
      <div className="dashboard task-footer">&nbsp;</div>
    </div>
);

const Dashboard = () => {

const CreationButton = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className = "dashboard create-button">
    {props.children}
  </button>
  );

  const history = useHistory();
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
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

  let content = ("<p>No Tasks.</p>");

  if (tasks) {
    content = (
        <div className="dashboard task-area">
          {tasks.map(task => (
              <Task task={task} key={task.id}/>
          ))}
        </div>
    );
  }


  return (
      <BaseContainer className="base-container two-frames">
        <div className="base-container main-area">
          {content}
          <button><img src={editIcon} onClick= { () => history.push('/editform')} /></button>

        </div>
        <div className="base-container right-frame">
          <div className="dashboard poll-session-frame">
            <h3>Estimate Poll Sessions</h3>
            <p>(Placeholder)</p>
          </div>
          <Button
              width = "100%"
              onClick = { () => history.push('/creationform')}
          >
            Create new task
          </Button>

        </div>
      </BaseContainer>
  );
}

export default Dashboard;
