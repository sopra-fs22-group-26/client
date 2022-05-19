import React from "react";
import "styles/ui/Task.scss";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import {ScrumbleButton} from "components/ui/ScrumbleButton";
import {RatingDisplay} from "components/ui/RatingDisplay";
import {api, handleError} from "helpers/api";
import {useHistory} from "react-router-dom";
import {icsExport} from "helpers/icsExport";

/**
 * Functions to manipulate tasks:
 * - delete and complete (directly)
 */

function doTaskComplete(task) {
    if (window.confirm(`Do you really want to complete the task \"${task.title}\"?`)) {
        async function completeTask() {
            try {
                const requestBody = JSON.stringify({
                    status: "COMPLETED",
                    assignee: task.assignee,
                    reporter: task.reporter,
                    estimate: task.estimate
                });
                const response = await api.put(`/tasks/${task.taskId}`, requestBody);
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while updating the task: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while updating the task! See the console for details.");
            }
        }
        completeTask();
    }
}

// Delete task
function doTaskDelete(task) {
    if (window.confirm(`Do you really want to delete the task \"${task.title}\"?`)) {
        async function deleteTask() {
            try {
                const response = await api.delete(`/tasks/${task.taskId}`);
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while deleting the task: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while deleting the task! See the console for details.");
            }
        }
        deleteTask();
    }
}

/**
 * Define and configure display elements
 */

// Placeholder for undefined values
const notDefined = (<span className="not-specified">not specified</span>);

// Task has edit button if task is still active
// or rating button if task has to be rated and current user is reporter.
// Rated tasks show rating.
const EditOrRating = ({props}) => {
    const history = useHistory();
    // Generate right side according to task.status
    let editOrRating = [];
    switch (props.status) {
        case "ACTIVE":
            // Show edit button
            editOrRating.push(
                <ScrumbleButton
                    type="edit"
                    onClick={(e) => {history.push('/editform/' + props.taskId); e.stopPropagation();}}
                />
            );
            break;
        case "COMPLETED":
            // If current user is reporter of this task => show rating button
            if (props.reporter && localStorage.getItem("id") && props.reporter == localStorage.getItem("id")){
                editOrRating.push(
                    <ScrumbleButton
                        type="rate"
                        onClick={(e) => {history.push('/ratingForm/' + props.taskId); e.stopPropagation();}}
                    />
                );
            }
            break;
        case "REPORTED":
            // Show rating
            editOrRating.push(
                <RatingDisplay
                    score={props.score}
                />
            );
            break;
        default:
            // do nothing
    }
    return editOrRating;
}


// Task footer only has buttons for completion and calendar export if task is still active
const TaskFooter = ({props}) => {

    // Generate task footer according to task.status
    let footer = [];
    footer.push(<DeleteForeverOutlinedIcon onClick={(e) => {doTaskDelete(props); e.stopPropagation();}}/>);
    if (props.status === "ACTIVE") {
        footer.push(<CalendarMonthOutlinedIcon alt="Export task to calendar" onClick={(e) => {icsExport(props); e.stopPropagation();}} />);
        footer.push(<AssignmentTurnedInOutlinedIcon onClick={(e) => {doTaskComplete(props); e.stopPropagation();}} />);
    }
    return (
        <div className="task-footer">
            {footer}
        </div>
    );
}


/**
 * Create the Task component
 * @param props
 * @param taskFunctions
 * @returns {JSX.Element}
 * @constructor
 */

export const Task = ({props}) => {
    const history = useHistory();

    // Define class for task container, depending on status and privateFlag
    let containerClass = "task-container task_priority_"
        + props.priority.toLowerCase()
        + (props.privateFlag ? " private" : "");

    return (
        <div className={containerClass}
             onClick={() => history.push('/task/' + props.taskId)}>
            <div className="task-header">{props.title}</div>
            <div className="task-content">
                <div className="task-content top-container">
                    <div className="task-content task-description" style={{whiteSpace: "pre-wrap"}}>
                        {props.description}
                    </div>
                    <div className="task-content comments">
                        {props.nofComments ? props.nofComments : "no"} comments
                    </div>
                </div>
                <div className="task-content bottom-container">
                    <div className="task-content bottom-container task-attributes">
                        <div><span className="label">Priority:</span> {props.priority.toLowerCase()}</div>
                        <div><span className="label">Assignee:</span> {props.assignee_name ? props.assignee_name : notDefined}</div>
                        <div><span className="label">Reporter:</span> {props.reporter_name ? props.reporter_name : notDefined}</div>
                        <div><span className="label">Due date:</span> {new Date(props.dueDate).toLocaleString('ch-DE', {dateStyle: 'medium'})}</div>
                    </div>
                    <div className="task-content bottom-container elements-right">
                        <div><span className="label">Estimate:</span> {props.estimate}h</div>
                        <EditOrRating props={props} />
                    </div>
                </div>
            </div>
            <TaskFooter props={props} />
        </div>
    );
}
