import {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import 'styles/views/CreationForm.scss';
import React from "react";
import Select from "react-select";

// Define input text field component
const FormField = props => {
  return (
      <div className="creation-form field">
        <label className= 'creation-form label'>
          {props.label}
        </label>
        <input
            type = {props.type}
            min = {props.min}
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

// Define native html selection component
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

// Define REACT selection component
const ReactSelection = props => {
  return (
      <div className="creation-form field">
        <label className='creation-form label react-select'>
          {props.label}
        </label>
        <Select
            isClearable
            className="react-select-container"
            classNamePrefix="react-select"
            options={props.options}
            onChange={e => props.onChange(e ? e.value : null)}
            getOptionValue={(option) => option.value}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
            })}
        />
      </div>
  );
};
ReactSelection.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func
};


// Output form
const CreationForm = () => {
  const history = useHistory();
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [priority, setPriority] = useState("NONE");
  const [assignee, setAssignee] = useState(null);
  const [reporter, setReporter] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [location, setLocation] = useState(null);
  const [estimate, setEstimate] = useState(0);
  const [users, setUsers] = useState(null);


  // Get all users to define options for assignee and reporter
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users`);

        let tempUsers = response.data.map(user => {
          let userOption = {};
          userOption["label"] = (user.name ? user.name : user.username);
          userOption["value"] = user.id;
          return userOption;
        });

        // sort options alphabetically
        tempUsers = tempUsers.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase());
        setUsers(tempUsers);
        console.log('User list:', tempUsers);
      }
      catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }
    fetchData();
  }, []);


  /**
   * Save task
   * @returns {Promise<void>}
   */
  const saveTask = async () => {
    try {
      const requestBody = JSON.stringify({title, description, priority, dueDate, location, estimate, assignee, reporter});

      const response = await api.post('/tasks', requestBody);

      // After succesful creation of a new task navigate to /dashboard
      history.push(`/dashboard`);

    } catch (error) {
      alert(`Something went wrong during the creation: \n${handleError(error)}`);
    }
  };

  return (
      <BaseContainer>
        <div className="base-container left-frame">
        </div>
        <div className="base-container main-frame">
          <div id="form-container" className = "creation-form container">
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
                <ReactSelection
                    label="Assignee:"
                    options={users}
                    onChange={a => setAssignee(a)}
                />
                <ReactSelection
                    label="Reporter:"
                    options={users}
                    onChange={r => setReporter(r)}
                />
                <Selection
                    label="Priority:"
                    value={priority}
                    onChange={p => {setPriority(p);
                      document.getElementById("form-container").className = "creation-form container task_priority_" + p.toLowerCase()}}
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
                    label = "Estimate (h):"
                    type = "number"
                    min = "0"
                    width = "80px"
                    align = "right"
                    placeholder = "h"
                    value={estimate}
                    onChange={e => setEstimate(e)}
                />
                <Button
                    disabled={!(title && description && dueDate && estimate !== "")}
                    onClick = { () => {history.push('/sessionlobby'); saveTask();}}>
                    Start Estimate Poll Session
                </Button>
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
                  disabled={!(title && description && dueDate && estimate !== "")}
                  onClick={() => saveTask()}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
        <div className="base-container main-frame right-frame">
        </div>
      </BaseContainer>
  );
}

export default CreationForm;