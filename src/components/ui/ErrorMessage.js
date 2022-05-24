import PropTypes from "prop-types";

const ErrorMessage = props => {
    return (
        <div className="login messagebox">{props.message}</div>
    );
};

ErrorMessage.prototype = {
    message: PropTypes.string
};

export default ErrorMessage;