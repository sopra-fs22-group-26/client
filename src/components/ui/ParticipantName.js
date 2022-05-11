import "styles/ui/ParticipantName.scss";

export const ParticipantName = props => (
    <div
        {...props}
        style={{width: props.width, ...props.style}}
        className="participant-name-container">
        {props.username}
    </div>
);
