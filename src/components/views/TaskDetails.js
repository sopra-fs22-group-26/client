import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {EstimateTotals} from "components/ui/EstimateTotals";
import React from "react";
import editIcon from "../../images/task_edit_icon.svg";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {ScrumbleButton} from "components/ui/ScrumbleButton";
import {RatingDisplay} from "components/ui/RatingDisplay";
import {PollSessionMonitor} from "components/ui/PollSessionMonitor";

import 'styles/ui/TaskDetails.scss';
import {Button} from "../ui/Button";
import {isInCurrentWeek} from "../../helpers/dateFuncs";
import {icsExport} from "helpers/icsExport";

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
                    className="editButton"
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
                        className="editButton"
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
const Comments = ({comments, taskFunctions}) => {

    let id = localStorage.getItem('id');

    const commentslist = comments.map(x => {
        let val;
        //if comment.author != id do basic else add delete button
        if (x.authorId != id) {
           val = <div className="label">{x.authorId}: {x.content}</div>
        } else{
            val = <div>{x.authorId}: {x.content}
                    <Button
                        onClick = {() => {taskFunctions.deleteComment(x)}}
                    >Delete</Button>
                </div>
        }
        return val;
    });

    return commentslist;
}

const WriteComment = ({props, taskFunctions}) => {

    const [comment, setComment] = useState(null);

    return (
        <div>
             <textarea
                 rows="1"
                 value={comment}
                 placeholder="Leave a comment..."
                 onChange = {(e) => {setComment(e.target.value)}}
                />
            <Button
            onClick = {() => {taskFunctions.postComment(comment, props, setComment)}}
            disabled={!comment}
            >Post</Button>
        </div>
    );
}


// Task footer only has buttons for completion and calendar export if task is still active
const TaskFooter = ({props, taskFunctions}) => {
    // Generate task footer according to task.status
    let footer = [];
    footer.push(<DeleteForeverOutlinedIcon onClick={() => taskFunctions.deleteTask(props)}/>);
    if (props.status === "ACTIVE") {
        footer.push(<CalendarMonthOutlinedIcon alt="Export task to calendar" onClick={() => taskFunctions.exportCalendar(props)} />);
        footer.push(<AssignmentTurnedInOutlinedIcon onClick={() => taskFunctions.completeTask(props)} />);
    }
    return (
        <div className="task-footer">
            {footer}
        </div>
    );
}


const Task = ({props,comments, setComment, taskFunctions}) => {
    const history = useHistory();
    return (
        <div className={"task-details-container task_priority_" + props.priority.toLowerCase()}>
            <div className="task-header">
                <div>{props.title}</div>
                <CloseOutlinedIcon className="action-icon" onClick={() => history.goBack()} />
            </div>
            <div className="task-content">
                <div className="task-content top-container">
                    <div className="task-content task-description">
                        {props.description}
                    </div>
                </div>
                <div className="task-content top-container">
                    <div className="task-content comments">
                        <Comments comments={comments} taskFunctions={taskFunctions}></Comments>
                        <h4>-----------------</h4>
                        <WriteComment props={props} taskFunctions={taskFunctions}></WriteComment>
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
                        <EditOrRating props={props} taskFunctions={taskFunctions} editIcon={editIcon} />
                    </div>
                </div>
            </div>
            <TaskFooter props={props} taskFunctions={taskFunctions} />
        </div>
    )
};


// Output form
const TaskDetails = () => {
    const history = useHistory();
    const [task, setTask] = useState(null);
    const [estimate, setEstimate] = useState({currentWeek: 0, total: 0});
    const [comments, setComments] = useState(null);

    const params = useParams();

    /**
     * Functions to manipulate tasks:
     * - delete and complete (directly)
     * - edit (redirect to edit page)
     * - calendar export
     */

    // Delete task
    function doTaskDelete(task) {
        if (window.confirm(`Do you really want to delete the task \"${task.title}\"?`)) {
            async function deleteTask() {
                try {
                    const response = await api.delete(`/tasks/${task.taskId}`);
                    console.log(response);
                    history.push('/dashboard')
                } catch (error) {
                    console.error(`Something went wrong while deleting the task: \n${handleError(error)}`);
                    console.error("Details:", error);
                    alert("Something went wrong while deleting the task! See the console for details.");
                }
            }
            deleteTask();
        }
    }

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
                    history.push('/dashboard')
                } catch (error) {
                    console.error(`Something went wrong while updating the task: \n${handleError(error)}`);
                    console.error("Details:", error);
                    alert("Something went wrong while updating the task! See the console for details.");
                }
            }
            completeTask();
        }
    }

    // Edit task
    function doTaskEdit(task) {
        history.push('/editform/' + task.taskId);
    }


    // Export calendar file for a task
    // => needs to be implemented!
    function doTaskCalendarExport(task) {
        alert("Calendar export functionality coming soon...");
    }

    function doCommentPost(comment, task, setComment){
            async function postComment() {
                try {
                    //prepare comment to post
                    let content = comment;
                    let belongingTask = task.taskId;
                    let authorId = localStorage.getItem("id");
                    const requestBody = JSON.stringify({content, authorId, belongingTask, task});
                    const response = await api.post(`/comments`, requestBody);

                    //reset input field via the hook after comment has been posted
                    setComment("");

                } catch (error) {
                    console.error(`Something went wrong while posting the comment: \n${handleError(error)}`);
                    console.error("Details:", error);
                    alert("Something went wrong while commenting the task! See the console for details.");
                }
            }
            postComment();
    }

    function doCommentDelete(comment){
        async function deleteComment() {
            try {
                const response = await api.delete(`/comments/${comment.commentId}`);
                console.log(response);

            } catch(error){
                console.error(`Something went wrong while deleting the comment: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while deleting the comment! See the console for details.");
            }
        }
        deleteComment();
    }


    // Functions will be passed to task child component (for reference)
    const myTaskFunctions = {
        "completeTask": doTaskComplete,
        "editTask": doTaskEdit,
        "deleteTask": doTaskDelete,
        "exportCalendar": icsExport,
        "postComment" : doCommentPost,
        "deleteComment" : doCommentDelete
    }

    useEffect(() => {
        async function fetchData() {
            try {
                let [r_task, r_users, r_assignedTasks] = await Promise.all([api.get(`/tasks/${params["task_id"]}`),
                    api.get('/users'),
                    api.get(`/tasks/assignee/${localStorage.getItem("id")}`)]);

                // Get the returned tasks and update the states.
                let taskResponse = r_task.data;

                // Get all users and replace assignee and reporter ids with user names
                let userArray = r_users.data.map(user => [user.id, (user.name ? user.name : user.username)]);
                const userDictionary = Object.fromEntries(userArray);

                taskResponse.assignee_name = taskResponse.assignee ? userDictionary[taskResponse.assignee] : null;
                taskResponse.reporter_name = taskResponse.reporter ? userDictionary[taskResponse.reporter] : null;

                let commentsResponse = r_task.data.comments;
                setComments(commentsResponse);
                setTask(taskResponse);

                // Calculate Total Estimates for current user
                let estimates = {currentWeek: 0, total: 0};
                estimates.total = r_assignedTasks.data.reduce((acc, t) => acc + t.estimate, 0);
                estimates.currentWeek = r_assignedTasks.data.filter(t => isInCurrentWeek(new Date(t.dueDate))).reduce((acc, t) => acc + t.estimate, 0);
                setEstimate(estimates);

                // See here to get more data.
                console.log(r_task);
                console.log(r_users);
            } catch (error) {
                console.error(`Something went wrong while fetching the tasks: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the tasks! See the console for details.");
            }
        }
        fetchData();

        // Update data regularly
        const interval = setInterval(()=>{
            fetchData()
        },3000);
        return() => clearInterval(interval);

    }, []);


    let content = <div className="nothing"> loading task info</div>;

    if(task) {
        content = <Task props={task} comments={comments} key={task.id} taskFunctions={myTaskFunctions}/>;
    }

    return (
        <BaseContainer>
            <div className="base-container left-frame">
            </div>
            <div className="base-container main-frame">
                {content}
            </div>
            <div className="base-container right-frame">
                <PollSessionMonitor />
                <EstimateTotals
                    currentWeek={estimate.currentWeek}
                    total={estimate.total}
                />
                <Button
                    onClick = { () => history.push('/creationform')}
                >
                    Create new task
                </Button>
            </div>
        </BaseContainer>
    );
}

export default TaskDetails;