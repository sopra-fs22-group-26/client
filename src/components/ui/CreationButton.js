import "styles/ui/CreationButton.scss";

export const CreationButton = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`creation-button ${props.className}`}>
    {props.children}
  </button>
);
