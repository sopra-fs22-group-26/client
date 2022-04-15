import {useEffect, useState, useMemo} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Task from 'models/Task';
import 'styles/views/CreationForm.scss';
import React from "react";


// Define input text field component
const FormField = props => {
  return (
      <div className="creation-form field">
        <label className= 'creation-form label'>
          {props.label}
        </label>
        <input
            type = {props.type}
            className = "creation-form input"
            placeholder = {props.placeholder}
            value = {props.value}
            onChange = {e => props.onChange(e.target.value)}
            style={{width: props.width, textAlign: props.align}}
        />
      </div>
  );
};
FormField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  width: PropTypes.string,
  align: PropTypes.string,
  onChange: PropTypes.func
};

// Define input selection component
const Selection = props => {
  return (
      <div className="creation-form field">
        <label className= 'creation-form label'>
          {props.label}
        </label>
        <select value={props.value} onChange={e => props.onChange(e.target.value)}>
          <option value="NONE">none</option>
          <option value="LOW">low</option>
          <option value="MEDIUM">medium</option>
          <option value="HIGH">high</option>
        </select>
      </div>
  );
};
Selection.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};


// Output form
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
          <div className="creation-form header">
            <input
                className="creation-form input"
                placeholder="Task title"
                value = {title}
                onChange = {t => setTitle(t.target.value)}
            />
          </div>
          <div className="creation-form description-container">
          <textarea
              rows="4"
              placeholder="Task description"
              onChange = {d => setDescription(d.target.value)}
          />
          </div>
          <div className="creation-form attributes-container">
            <div className="creation-form attributes-container attributes-column">
              <FormField
                  label = "Due date:"
                  type = "date"
                  placeholder = "Select date"
                  value = {dueDate}
                  onChange = {dd => setDueDate(dd)}
              />
              <Selection
                  label="Priority:"
                  value={priority}
                  onChange={p => setPriority(p)}
              />
              <FormField
                  label = "Location:"
                  placeholder = "Set location..."
                  value={location}
                  onChange={l => setLocation(l)}
              />
            </div>
            <div className="creation-form attributes-container attributes-column rightalign">
              <FormField
                  label = "Estimate:"
                  type = "number"
                  width = "80px"
                  align = "right"
                  placeholder = "h"
                  value={estimate}
                  onChange={e => setEstimate(e)}
              />
            </div>
          </div>
          <div className="creation-form footer">
            <Button
                className="menu-button"
                onClick={() => history.push(`/dashboard`)}
            >
              Cancel
            </Button>
            <Button
                className="menu-button default"
                disabled={!title}
                onClick={() => saveTask()}
            >
              Save
            </Button>
          </div>
        </div>
      </BaseContainer>
  );
}

export default CreationForm;