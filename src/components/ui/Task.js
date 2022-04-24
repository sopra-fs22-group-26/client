import React from "react";
import "styles/ui/Task.scss";
import editIcon from "images/task_edit_icon.svg";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";

const notDefined = (<span className="not-specified">not specified</span>);

export const Task = ({props, taskFunctions}) => (
    <div className={"task-container task_priority_" + props.priority.toLowerCase()}>
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
            <div><span className="label">Assignee:</span> {props.assignee ? props.assignee : notDefined}</div>
            <div><span className="label">Reporter:</span> {props.reporter ? props.reporter : notDefined}</div>
            <div><span className="label">Due date:</span> {new Date(props.dueDate).toLocaleString('ch-DE', {dateStyle: 'medium'})}</div>
          </div>
          <div className="task-content bottom-container elements-right">
            <div><span className="label">Estimate:</span> {props.estimate}h</div>
            <div className="editButton" onClick={() => taskFunctions.editTask(props.taskId)} >
              <img src={editIcon} />
            </div>
          </div>
        </div>
      </div>
      <div className="task-footer">
        <DeleteForeverOutlinedIcon onClick={() => taskFunctions.deleteTask(props)} />
        <CalendarMonthOutlinedIcon onClick={() => taskFunctions.exportCalendar(props.taskId)} />
        <AssignmentTurnedInOutlinedIcon onClick={() => taskFunctions.completeTask(props.taskId)} />
      </div>
    </div>
);
