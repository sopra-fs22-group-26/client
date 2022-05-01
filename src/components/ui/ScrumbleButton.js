import "styles/ui/Task.scss";
import "styles/ui/ScrumbleButton.scss";

import {ReactComponent as TaskEditImage} from "images/task_edit-default.svg";
import {ReactComponent as TaskRateImage} from "images/task_rate-default.svg";

export const ScrumbleButton = props => {

    let buttonImage;
    switch (props.type) {
        case "edit":
            buttonImage = <TaskEditImage className="scrumbleImage" />
            break;
        case "rate":
            buttonImage = <TaskRateImage className="scrumbleImage" />
            break;
        default:
            // do nothing
    }

    return (
        <button
            {...props}
            style={{...props.style}}
            className={`scrumbleButton ${props.className}`}
        >
            {buttonImage}
        </button>
    );
}
