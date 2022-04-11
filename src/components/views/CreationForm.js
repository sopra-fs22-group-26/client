import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Task from 'models/Task';



const FormField = props => {
  return (
    <div className="creation form">
      <label>
        {props.label}
      </label>
      <input
      className =""
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );  
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

const CreationForm = () => {
  const history = useHistory();
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [priority, setPriority] = useState(null);
  //const [assignee, setAssignee] = useState(null);
  //const [reporter, setReporter] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [location, setLocation] = useState(null);
  const [estimate, setEstimate] = useState(null);


  const saveTask = async () => {
    try {
      const requestBody = JSON.stringify({title, description, priority, dueDate, location, estimate});
      const response = await api.post('/tasks', requestBody);

      // Get the returned task  and update a new object.
      const task = new Task(response.data);

      // Store the token into the local storage.
      //localStorage.setItem('token', user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/dashboard`);
    } catch (error) {
      alert(`Something went wrong during the creation: \n${handleError(error)}`);
    }
  };

  return (
    <div>Creation Form</div>
  );
}

export default CreationForm;