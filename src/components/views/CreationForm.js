import {React, useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import 'styles/views/CreationForm.scss';
import Select from "react-select";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import moment from "moment";
import {AuthUtil} from "helpers/authUtil";

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

// Define selection component
const PrioritySelector = props => {
    return (
        <select value={props.value} onChange={e => props.onChange(e.target.value)}>
            <option value="NONE">none</option>
            <option value="LOW">low</option>
            <option value="MEDIUM">medium</option>
            <option value="HIGH">high</option>
        </select>
    );
};
PrioritySelector.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};

const PrivacySwitch = props => {
    return (
        <FormControlLabel
            control={<Switch />}
            label="Private Task"
            labelPlacement="start"
            onChange={e => props.onChange(e.target.checked)}
        />
    )
};
PrivacySwitch.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};

// Define REACT selection component
const ReactSelection = props => {
    return (
        <div className="creation-form field">
            <label className='creation-form label react-select'>
                {props.label}:
            </label>
            <Select
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
                options={props.options}
                isDisabled={props.isDisabled}
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
    isDisabled: PropTypes.bool
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
    const [privateFlag, setPrivateFlag] = useState(false);
    const [location, setLocation] = useState(null);
    const [estimate, setEstimate] = useState(0);
    const [users, setUsers] = useState(null);
    const [assigneeBackup, setAssigneeBackup] = useState(null);
    const [reporterBackup, setReporterBackup] = useState(null);
    const [holidays, setHolidays] = useState(null);


    // Define class for task container, depending on priority and privateFlag
    function changePriority(newPriority) {
        document.getElementById("form-container").className =
            "creation-form container task_priority_"
            + newPriority.toLowerCase()
            + (privateFlag ? " private" : "");
    }
    // Define class for task container, depending on priority and privateFlag
    // and set input fields for assignee and reporter according to privacy.
    // Store former values for switching back to non-private.
    function changePrivacy(newPrivacy) {
        document.getElementById("form-container").className =
            "creation-form container task_priority_"
            + priority.toLowerCase()
            + (newPrivacy ? " private" : "");
        if (newPrivacy){
            setAssigneeBackup(assignee);
            setReporterBackup(reporter);
            setAssignee(localStorage.getItem("id"));
            setReporter(null);
        }
        else {
            setAssignee(assigneeBackup);
            setReporter(reporterBackup);
        }
    }

    // Get all users to define options for assignee and reporter
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/users`,
                    { headers:{ Authorization: 'Bearer ' + localStorage.getItem('token')}});

                //get calender holidays
                const holidays = await fetch("https://www.googleapis.com/calendar/v3/calendars/en.ch%23holiday%40group.v.calendar.google.com/events?key=AIzaSyDr53V_g_IctWuuNYyq10yiAqyJXWsIOU4").then((response) => {
                    return response.json()});

                setHolidays(holidays);


                let tempUsers = response.data.map(user => {
                    let userOption = {};
                    userOption["label"] = (user.name ? user.name : user.username);
                    userOption["value"] = user.id;
                    return userOption;
                });

                // sort options alphabetically
                tempUsers = tempUsers.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase());
                setUsers(tempUsers);
            }
            catch (error) {
                if (error.response.status === 401) {
                    await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
                    setTimeout(fetchData, 200);
                } else {
                    console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                    console.error("Details:", error);
                    alert("Something went wrong while fetching the users! See the console for details.");
                }
            }
        }
        fetchData();
    }, []);


    /**
     * Save task and go to new location
     */
    const saveTaskAndRedirect = async (targetLocation) => {
        try {
            const creatorId = localStorage.getItem("id");
            const requestBody = JSON.stringify({creatorId, title, description, priority, dueDate, location,
                estimate, assignee, reporter, privateFlag});

            const response = await api.post('/tasks', requestBody,
                { headers:{Authorization: 'Bearer ' + localStorage.getItem('token')}});

            // After succesful creation of a new task navigate to targetLocation
            localStorage.setItem("taskId", response.data.taskId)
            history.push(targetLocation);
        } catch (error) {
            if (error.response.status === 401) {
                await AuthUtil.refreshToken(localStorage.getItem('refreshToken'));
                setTimeout(saveTaskAndRedirect, 200, targetLocation);
            } else {
                alert(`Something went wrong during the creation: \n${handleError(error)}`);
            }
        }
    };

    /**
     * Notify user when dueDate is set on a national Holiday
     */

    function handleDate(date){
        for (let i = 0; i<holidays.items.length;i++){
            if (holidays.items[i]["start"]["date"] === date){
                alert("Attention! This date is national holiday: " + holidays.items[i]["summary"]);
                setDueDate(date);
            }
            else{
                setDueDate(date);
            }
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
                                min={moment().format("YYYY-MM-DD")}
                                onChange = {dd => handleDate(dd)}
                            />
                            <ReactSelection
                                label="Assignee"
                                options={users}
                                isDisabled={privateFlag}
                                onChange={a => setAssignee(a)}
                            />
                            <ReactSelection
                                label="Reporter"
                                options={users}
                                isDisabled={privateFlag}
                                onChange={r => setReporter(r)}
                            />
                            <div className="creation-form field">
                                <label className= 'creation-form label'>Priority:</label>
                                <div className="double-content">
                                    <PrioritySelector
                                        label="Priority:"
                                        value={priority}
                                        onChange={prio => {setPriority(prio); changePriority(prio)}}
                                    />
                                    <PrivacySwitch
                                        onChange={pf => {setPrivateFlag(pf); changePrivacy(pf)}}
                                    />
                                </div>

                            </div>
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
                                disabled={!(title && dueDate && estimate !== "")
                                    || (reporter && !assignee) || (estimate < 0) || privateFlag }
                                onClick = { () => saveTaskAndRedirect("/sessionlobby")}>
                                Start Estimate<br/>Poll Session
                            </Button>
                        </div>
                    </div>
                    <div className="creation-form footer">
                        <Button
                            className="menu-button"
                            onClick={() => history.goBack()}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="menu-button default"
                            disabled={!(title && dueDate && estimate !== "")
                                || (reporter && !assignee) || (estimate < 0) }
                            onClick={() => saveTaskAndRedirect("/dashboard")}
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