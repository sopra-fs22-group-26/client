import {useEffect, useState, useMemo} from 'react';
import TextField from '@material-ui/core/TextField';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Task from 'models/Task';
import 'styles/views/CreationForm.scss';



const TitleField = props => {
  return (
    <div className="creation-form title">
      <input
      className = "creation-form title-input"
      placeholder = "Task title"
      value={props.value}
      onChange={e => props.onChange(e.target.value)} 
      />
    </div>
  );  
};

const DescriptionField = props => {
  return (
    <div className="creation-form description">
      <input
      className = " creation-form description-input"
      placeholder = "Task description"
      value={props.value}
      onChange={e => props.onChange(e.target.value)} 
      />
    </div>
  );  
};

const DateField = props => {
  return (
    <div className="creation-form field">
      <label className= 'creation-form label'>
        {props.label}
      </label>
      <TextField
      className = "creation-form input"
      placeholder = "Select due date.."
      value = {props.value}
      id = "date"
      type = "date"
      onChange={e => props.onChange(e.target.value)} 
      />
    </div>
  );  
};

const PriorityField = props => {
  return (
    <div className="creation-form field">
      <label className= 'creation-form label'>
        {props.label}
      </label>
      <select value={props.value} onChange={e => props.onChange(e.target.value)}>
        <option value="NONE">NONE</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>
    </div>
  );
};

const FormField = props => {
  return (
    <div className="creation-form field">
      <label className= 'creation-form label'>
        {props.label}
      </label>
      <input
      className = "creation-form input"
      placeholder = "Select.."
      value={props.value}
      onChange={e => props.onChange(e.target.value)} 
      />
    </div>
  );  
};


TitleField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

DescriptionField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

DateField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

PriorityField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
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

      // After succesful creation of a new task navigate to /dashboard
      history.push(`/dashboard`);
    } catch (error) {
      alert(`Something went wrong during the creation: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer>
      <div className = "creation-form container">
      
        <TitleField 
          value = {title}
          onChange = {t => setTitle(t)}
        />
      
      
        <DescriptionField
            value = {description}
            onChange = {d => setDescription(d)}
        />
      
      
        <DateField
          label = "Due date:"
          value = {dueDate}
          onChange = {dd => setDueDate(dd)}
        />
        <PriorityField
          label="Priority:"
          value={priority}
          onChange={p => setPriority(p)}
        />

        <FormField
          label="Location:"
          value={location}
          onChange={l => setLocation(l)}
        />

        <FormField
          label="Estimate:"
          value={estimate}
          onChange={e => setEstimate(e)}
        />


      
      <div className = "creation-form buttons" >
        <button 
          className = "creation-form cancel-button"
          onClick = {() => history.push(`/dashboard`)}
        >
          Cancel
        </button>
        <button 
          className = "creation-form save-button"
          onClick = {() => saveTask()}
        >
          Save
        </button>
      </div>  
    </div>
    </BaseContainer>
  );
}

export default CreationForm;