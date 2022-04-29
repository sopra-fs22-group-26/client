import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
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

// Define native html input selection component
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
const ReactSelection = (props) => {
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
                defaultValue={props.defaultValue}
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
    onChange: PropTypes.func,
    defaultValue: PropTypes.object
};

// Output form
const EditForm = () => {
    const history = useHistory();
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [priority, setPriority] = useState("NONE");
    const [assignee, setAssignee] = useState(null);
    const [reporter, setReporter] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [location, setLocation] = useState(null);
    const [estimate, setEstimate] = useState(null);
    const [task, setTask] = useState(null);

    const [users, setUsers] = useState(null);
    const [firstAssignee, setFirstAssignee] = useState("");
    const [firstReporter, setFirstReporter] = useState(null);

    const params = useParams();

    const saveEdit = async () => {
        try {
            const requestBody = JSON.stringify({title, description, priority, dueDate, location, estimate, assignee, reporter});
            const editResponse = await api.put(`/tasks/${params["task_id"]}`, requestBody);

            // After succesful edit of a task navigate to /dashboard
            history.push(`/dashboard`);
        } catch (error) {
            alert(`Something went wrong during edit: \n${handleError(error)}`);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                let [r_task, r_users] = await Promise.all([api.get(`/tasks/${params["task_id"]}`), api.get('/users')]);

                // Get the returned tasks and update the states.
                let taskResponse = r_task.data;
                setTask(taskResponse);
                setTitle(taskResponse.title);
                setDescription(taskResponse.description);
                setPriority(taskResponse.priority ? taskResponse.priority : "NONE");
                setDueDate(new Date(taskResponse.dueDate).toISOString().split('T')[0]);
                setLocation(taskResponse.location);
                setEstimate(taskResponse.estimate);

                // Get all users to define options for assignee and reporter
                let tempUsers = r_users.data.map(user => {
                    let userOption = {};
                    userOption["label"] = (user.name ? user.name : user.username);
                    userOption["value"] = user.id;

                    // Assign assignee and reporter if they match
                    if (user.id === taskResponse.assignee) {
                        setFirstAssignee(userOption);
                        setAssignee(user.id);
                    }
                    if (user.id === taskResponse.reporter) {
                        setFirstReporter(userOption)
                        setReporter(user.id);
                    }
                    return userOption;
                });

                // sort options alphabetically
                tempUsers = tempUsers.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase());
                setUsers(tempUsers);

                // See here to get more data.
                console.log(r_task);
                console.log(r_users);
            } catch (error) {
                console.error(`Something went wrong while fetching the data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the data! See the console for details.");
            }
        }
        fetchData();
    }, []);

    let content = <div className="nothing"> loading task info</div>;

    if(task && users) {
        content =
            <div id="form-container" className={"creation-form container task_priority_" + task.priority.toLowerCase()}>
                <div className="creation-form header">
                    <input
                        className="creation-form input"
                        placeholder={task.title}
                        value={title}
                        onChange={t => setTitle(t.target.value)}
                    />
                </div>
                <div className="creation-form description-container">
          <textarea
              rows="4"
              placeholder="Task description"
              defaultValue={description}
              onChange={d => setDescription(d.target.value)}
          />
                </div>
                <div className="creation-form attributes-container">
                    <div className="creation-form attributes-container attributes-column">
                        <FormField
                            label="Due date:"
                            type="date"
                            placeholder="Select date"
                            value={dueDate}
                            onChange={dd => setDueDate(dd)}
                        />
                        <ReactSelection
                            label="Assignee:"
                            defaultValue={firstAssignee}
                            options={users}
                            onChange={a => setAssignee(a)}
                        />
                        <ReactSelection
                            label="Reporter:"
                            defaultValue={firstReporter}
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
                            label="Location:"
                            placeholder="Set location..."
                            value={location}
                            onChange={l => setLocation(l)}
                        />
                    </div>
                    <div className="creation-form attributes-container attributes-column rightalign">
                        <FormField
                            label="Estimate (h):"
                            type="number"
                            width="80px"
                            align="right"
                            placeholder="h"
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
                        disabled={!(title && description && dueDate && estimate !== "")}
                        onClick={() => saveEdit()}
                    >
                        Save
                    </Button>
                </div>
            </div>;
    }

    return (
        <BaseContainer>
            <div className="base-container left-frame">
            </div>
            <div className="base-container main-frame">
                {content}
            </div>
            <div className="base-container main-frame right-frame">
            </div>
        </BaseContainer>
    );
}

export default EditForm;