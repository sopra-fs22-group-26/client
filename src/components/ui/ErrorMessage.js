import PropTypes from "prop-types";

const ErrorMessage = props => {
    let errorMessage = "";
    if (props.message){
        errorMessage = <div className="login messagebox">{props.message}</div>;
    }
    return errorMessage;
};

ErrorMessage.prototype = {
    message: PropTypes.string
};

export default ErrorMessage;