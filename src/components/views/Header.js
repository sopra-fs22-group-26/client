import React from "react";
import {useHistory} from 'react-router-dom';
import mainLogo from "images/scrumblebee_logo_508x95.png";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import {UserMenu} from "components/ui/UserMenu";


const HeaderContent = ({props}) => {
  const history = useHistory();

  // Check if user is logged-in
  let userOnline = false;
  if (localStorage.getItem("token")) {
    userOnline = true;
  }

  // Navigate to different page
  function navigate(button, location) {
    if (userOnline && !button.target.className.includes("selected")) history.push(location);
  }

  let classBaseName = "header mainmenu menuitem" + (userOnline ? " active" : "");
  let mainLogoClass = "header mainlogo" + (userOnline ? " online" : "");

  return (
      <div className="header container">
        <div className={mainLogoClass}
             onClick={(b) => navigate(b,'/dashboard')}
        >
          <img src={mainLogo} alt="Logo"/>
        </div>
        <div className="header mainmenu">
          <div className={classBaseName + (props.selectedMenu === "task_overview" ? " selected" : "")}
               onClick={(b) => navigate(b,'/dashboard')}>Task Overview
          </div>
          <div className={classBaseName + (props.selectedMenu === "reports" ? " selected" : "")}
               onClick={(b) => navigate(b,'/reports')}>Reports
          </div>
          <div className={classBaseName + (props.selectedMenu === "scoreboard" ? " selected" : "")}
               onClick={(b) => navigate(b,'/scoreboard')}>Scoreboard
          </div>
        </div>
        <UserMenu />
      </div>
  );
}
HeaderContent.propTypes = {
  selectedMenu: PropTypes.string
};

const Header = (props) => {
  return(
      <HeaderContent props={props} />
  );
}

export default Header;

