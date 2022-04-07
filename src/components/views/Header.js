import React from "react";
import {useHistory, useState} from 'react-router-dom';
import mainLogo from "images/scrumblebee_logo_508x95.png"
import PropTypes from "prop-types";
import "styles/views/Header.scss";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 */

const HeaderContent = ({props}) => {
  // use react-router-dom's hook to access the history
  const history = useHistory();
  let userOnline = false;
  if (localStorage.getItem("token")) {
    userOnline = true;
  }

  // Navigate to different
  function navigate(button, location) {
    if (userOnline && !button.target.className.includes("selected")) history.push(location);
  }

  // Handle the logout process
  const logout = () => {
    if (userOnline) {
      localStorage.removeItem('token');
      history.push('/login');
    }
  }

  let userIconClass, userIconInitials;
  if (userOnline) {
    userIconClass = "header userIcon online";
    userIconInitials = "MH";
  }
  else {
    userIconClass = "header userIcon offline";
    userIconInitials = "";
  }

  let classBaseName = "header mainmenu menuitem" + (userOnline ? " active" : "");
  return (
      <div className="header container">
        <div className="header mainlogo">
          <img src={mainLogo} alt="Logo"/>
        </div>
        <div className="header mainmenu">
          <div className={classBaseName + (props.selectedMenu == "task_overview" ? " selected" : "")} onClick={(b) => navigate(b,'/game/dashboard')}>Task Overview</div>
          <div className={classBaseName + (props.selectedMenu == "reports" ? " selected" : "")} onClick={(b) => navigate(b,'/reports')}>Reports</div>
          <div className={classBaseName + (props.selectedMenu == "scoreboard" ? " selected" : "")} onClick={(b) => navigate(b,'/scoreboard')}>Scoreboard</div>
        </div>
        <div className={userIconClass} onClick={() => logout()}>{userIconInitials}</div>
      </div>
  );
}
HeaderContent.propTypes = {
  selectedMenu: PropTypes.string,
  active: PropTypes.number
};

const Header = (props) => {

  // use react-router-dom's hook to access the history
  const history = useHistory();

  // Handle the logout process
  const logout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  }

  return(
      <HeaderContent props={props} />
  );
}

export default Header;

