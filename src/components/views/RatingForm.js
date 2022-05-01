import {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import 'styles/ui/TaskDetails.scss';
import React from "react";

import Rating from '@mui/lab/Rating';


/**
 * Define component for Task details with rating option
 * @param props
 * @param score => get state from parent
 * @param setScore => sets state of parent
 * @param rateTask => sets state of parent
 * @returns {JSX.Element}
 * @constructor
 */
const Task = ({props, score, setScore, rateTask, history}) => {
    return (
        <div className={"task-details-container task_priority_" + props.priority.toLowerCase()}>
            <div className="task-header">{props.title}</div>
            <div className="task-content">
                <div className="task-content top-container">
                    <div className="task-content task-description">
                        {props.description}
                    </div>
                </div>
                <div className="task-content top-container">
                    <div className="task-content comments">
                        <div className="comments-title">{props.nofComments ? props.nofComments : "No"} comments</div>
                    </div>
                </div>
                <div className="task-content bottom-container">
                    <div className="task-content bottom-container task-attributes">
                        <div><span className="label">Priority:</span> {props.priority.toLowerCase()}</div>
                        <div><span className="label">Assignee:</span> {props.assignee_name ? props.assignee_name : notDefined}</div>
                        <div><span className="label">Reporter:</span> {props.reporter_name ? props.reporter_name : notDefined}</div>
                        <div><span className="label">Due date:</span> {new Date(props.dueDate).toLocaleString('ch-DE', {dateStyle: 'medium'})}</div>
                        <div><span className="label">Location:</span> {props.location ? props.location : notDefined}</div>
                    </div>
                    <div className="task-content bottom-container elements-right">
                        <div><span className="label">Estimate:</span> {props.estimate}h</div>
                        <Rating
                            name="Rating Label"
                            size="large"
                            value={score}
                            onChange={(event, newValue) => {
                                setScore(newValue);
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="creation-form footer">
                <Button
                    className="menu-button"
                    onClick={() => history.push(`/reports`)}
                >
                    Cancel
                </Button>
                <Button
                    className="menu-button default"
                    disabled={(score < 1)}
                    onClick={() => rateTask()}
                >
                    Rate with {score}/5
                </Button>
            </div>
        </div>
    )
};

const notDefined = (<span className="not-specified">not specified</span>);

// Output component
const RateForm = () => {
    const params = useParams();
    const history = useHistory();
    const [assignee, setAssignee] = useState(null);
    const [reporter, setReporter] = useState(null);
    const [score, setScore] = useState(0);

    const [task, setTask] = useState(null);

    // Get all users to define options for assignee and reporter
    useEffect(() => {
        async function fetchData() {
            try {
                let [r_task, r_users] = await Promise.all([api.get(`/tasks/${params["task_id"]}`),
                    api.get('/users')]);

                // Get the returned tasks and update the states.
                let taskResponse = r_task.data;

                // Get all users and replace assignee and reporter ids with user names
                let userArray = r_users.data.map(user => [user.id, (user.name ? user.name : user.username)]);
                const userDictionary = Object.fromEntries(userArray);
                taskResponse.assignee_name = taskResponse.assignee ? userDictionary[taskResponse.assignee] : null;
                taskResponse.reporter_name = taskResponse.reporter ? userDictionary[taskResponse.reporter] : null;

                setAssignee(taskResponse.assignee);
                setReporter(taskResponse.reporter);
                setTask(taskResponse);
            }
            catch (error) {
                console.error(`Something went wrong while fetching the data: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the data! See the console for details.");
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

            await Promise.all([
                api.put(`/tasks/${params["task_id"]}`, taskRequestBody),
                api.put('/users/' + assignee, userRequestBody)
            ]);

            // After successful rating of a  task navigate to /reports
            history.push(`/reports`);

        } catch (error) {
            console.error(`Something went wrong during the rating: \n${handleError(error)}`);
            console.error("Details:", error);
            alert(`Something went wrong during the rating: \n${handleError(error)}`);
        }
    };

    // If all data is loaded from server, composite task details and rating form
    let content = <div className="nothing"> loading task info</div>;

    if(task) {
        content = (
            <Task
                props={task}
                key={task.id}
                score={score}
                setScore={(s) => setScore(s)}
                rateTask={rateTask}
                history={history}
            />
        );
    }

    // Display page content
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

export default RateForm;