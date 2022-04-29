import React from "react";
import "styles/ui/Task.scss";
import editIcon from "images/task_edit_icon.svg";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";

const notDefined = (<span className="not-specified">not specified</span>);

// Task only has edit button if task is still active.
// Rated tasks show rating.
const EditOrRating = ({props, taskFunctions, editIcon}) => {
  // Generate right side according to task.status
  let editOrRating = [];
  if (props.status === "ACTIVE") {
    editOrRating.push(
        <div className="editButton" onClick={(e) => {taskFunctions.editTask(props); e.stopPropagation();}} >
          <img src={editIcon} alt="Edit task" />
        </div>
    );
  }
  return editOrRating;
}


// Task footer only has buttons for completion and calendar export if task is still active
const TaskFooter = ({props, taskFunctions}) => {
  // Generate task footer according to task.status
  let footer = [];
  footer.push(<DeleteForeverOutlinedIcon onClick={(e) => {taskFunctions.deleteTask(props); e.stopPropagation();}}/>);
  if (props.status === "ACTIVE") {
    footer.push(<CalendarMonthOutlinedIcon onClick={(e) => {taskFunctions.exportCalendar(props); e.stopPropagation();}} />);
    footer.push(<AssignmentTurnedInOutlinedIcon onClick={(e) => {taskFunctions.completeTask(props); e.stopPropagation();}} />);
  }
  return (
      <div className="task-footer">
        {footer}
      </div>
  );
}


export const Task = ({props, taskFunctions}) => (
    <div className={"task-container task_priority_" + props.priority.toLowerCase()} onClick={() => taskFunctions.taskDetails(props)}>
      <div className="task-header">{props.title}</div>
      <div className="task-content">
        <div className="task-content top-container">
          <div className="task-content task-description">
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
            <EditOrRating props={props} taskFunctions={taskFunctions} editIcon={editIcon} />
          </div>
        </div>
      </div>
      <TaskFooter props={props} taskFunctions={taskFunctions} />
    </div>
);
