import {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import 'styles/views/CreationForm.scss';
import React from "react";

import Rating from '@mui/lab/Rating';




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


// Output form
const RateForm = () => {
    const params = useParams();
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
    const [score, setScore] = useState(null);


    // Get all users to define options for assignee and reporter
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/tasks/${params["task_id"]}`);

                setTitle(response.data.title);
                setDescription(response.data.description);
                setPriority(response.data.priority);
                setAssignee(response.data.assignee);
                setReporter(response.data.reporter);
                setDueDate(response.data.dueDate);
                setLocation(response.data.location);
                setEstimate(response.data.estimate);
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
     * Rate Task
     * @returns {Promise<void>}
     */
    const rateTask = async () => {
        try {
            const taskRequestBody = JSON.stringify({score, assignee, reporter, status:"REPORTED"})
            const userRequestBody = JSON.stringify( {score});

            await api.put(`/tasks/${params["task_id"]}`, taskRequestBody);
            await api.put('/users/' + assignee, userRequestBody);

            // After successful rating of a  task navigate to /reports
            history.push(`/reports`);

        } catch (error) {
            alert(`Something went wrong during the rating: \n${handleError(error)}`);
        }
    };



    return (
        <BaseContainer>
            <div className="base-container left-frame">
            </div>
            <div className="base-container main-frame">
                <div id="form-container" className = "creation-form container">
                    <div className="creation-form header">
                        <div>{title}</div>
                    </div>
                    <div className="creation-form description-container">
                        <div>
                            {description}
                        </div>
                    </div>
                    <div className="creation-form attributes-container">
                        <div className="creation-form attributes-container attributes-column">
                            <div className="creation-form attributes-container attributes-column">Due Date:  {dueDate}</div>

                            <div className="creation-form attributes-container attributes-column">Assignee: {assignee}</div>
                            <div className="creation-form attributes-container attributes-column">Reporter: {reporter}</div>
                            <div className="creation-form attributes-container attributes-column">Priority: {priority}</div>
                            <div className="creation-form attributes-container attributes-column">Location: {location}</div>
                        </div>
                        <div className="creation-form attributes-container attributes-column rightalign">
                            <div className="creation-form attributes-container attributes-column">Estimate: {estimate}</div>
                            <div>
                                <Rating
                                    name="Rating Label"
                                    value={score}
                                    size="large"
                                    onChange={(event, newValue) => {
                                        setScore(newValue);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="creation-form footer">
                        <Button
                            className="menu-button default"
                            disabled={(score == null)}
                            onClick={() => rateTask()}
                        >
                            Rate with {score}/5
                        </Button>
                    </div>
                </div>
            </div>
            <div className="base-container main-frame right-frame">
            </div>
        </BaseContainer>
    );
}

export default RateForm;