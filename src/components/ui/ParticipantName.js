import "styles/ui/ParticipantName.scss";

export const ParticipantName = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`primary-button ${props.className}`}>
        {props.children}
    </button>
);
