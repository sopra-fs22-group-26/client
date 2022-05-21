import {useHistory} from "react-router-dom";
import {React, useState, useEffect} from 'react';
import PropTypes from "prop-types";
import "styles/ui/MainMenu.scss";
import {ReactComponent as MenuAttention} from "images/mainmenu_attention.svg";
import {api, handleError} from "../../helpers/api";

export const MainMenu = (props) => {

    // Navigate to different page
    const history = useHistory();
    function navigate(button, location) {
        if (props.loggedIn && !button.target.className.includes("selected")) history.push(location);
    }

    /**
     * Check if current user has open tasks to report
     * => Display icon on Reports menu
     */
    const [actionLabel, setActionLabel] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Get all tasks the current user has to report
                let response = await api.get(`/tasks/reporter/${localStorage.getItem("id")}`);
                let tasks = response.data.filter(task => task.status === "COMPLETED");
                if (tasks && tasks.length > 0) {
                    setActionLabel(<div className="attentionLabel"><MenuAttention/></div>);
                }
                else {
                    setActionLabel(null);
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the tasks: \n${handleError(error)}`);
            }
        }
        fetchData();

    // Check data regularly if user is logged in
        const interval = setInterval(()=>{
            fetchData();
        },5000);
        return() => clearInterval(interval);
    },[]);


    /**
     * Construct and return component
     */
    let classBaseName = "header mainmenu menuitem" + (props.loggedIn ? " active" : "");

    return (
        <div className="header mainmenu">
            <div className={classBaseName + (props.selectedMenu === "task_overview" ? " selected" : "")}
                 onClick={(b) => navigate(b,'/dashboard')}>Task Overview
            </div>
            <div className={classBaseName + (props.selectedMenu === "reports" ? " selected" : "")}
                 onClick={(b) => navigate(b,'/reports')}>Reports
                {actionLabel}
            </div>
            <div className={classBaseName + (props.selectedMenu === "scoreboard" ? " selected" : "")}
                 onClick={(b) => navigate(b,'/scoreboard')}>Scoreboard
            </div>
        </div>
    );
}
MainMenu.propTypes = {
    selectedMenu: PropTypes.string,
    loggedIn: PropTypes.bool
}