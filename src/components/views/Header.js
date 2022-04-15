import React from "react";
import {api, handleError} from 'helpers/api';
import {useHistory, useState} from 'react-router-dom';
import mainLogo from "images/scrumblebee_logo_508x95.png";
import PropTypes from "prop-types";
import "styles/views/Header.scss";
import "styles/ui/UserMenu.scss";

import {Menu, MenuItem, ListItemIcon, Divider, Tooltip, Avatar} from "@mui/material";
import {Logout} from "@mui/icons-material";
import User from "../../models/User";

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
  let userId = null;

  //let name = "ScrumbleBee User"
  let name = localStorage.getItem("name") ? localStorage.getItem("name") : localStorage.getItem("username");

  if (localStorage.getItem("token")) {
    userOnline = true;
    /*
    if (localStorage.getItem("id")) {
      userId = localStorage.getItem("id");
      const getUserInfo = async () => {
        try {
          const response = await api.get(`/users/${userId}`);

          // Get the returned user and update a new object.
          const user = new User(response.data);

          // Store the data into the local storage.
          if(user.name != ""){
            name = user.name;
            localStorage.setItem('name', user.name);
          }
        } catch (error) {
          alert(`Information for current user not found: \n${handleError(error)}`);
        }
      };
      getUserInfo();
    }
     */
  }

  // Navigate to different page
  function navigate(button, location) {
    if (userOnline && !button.target.className.includes("selected")) history.push(location);
  }


  // Pop-up menu for user profile and logout
  // Uses Material UI (MUI)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    if (userOnline){
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  }


  // Handle the logout process
  const logout = () => {
    const username = localStorage.getItem("username");
    async function logoutUser() {
      try {
        const requestBody = JSON.stringify({username});
        const response = await api.post('/auth/logout', requestBody);

        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        localStorage.removeItem('username');
        history.push('/login');
      }
      catch (error) {
        console.error(`Something went wrong while logging out user: \n${handleError(error)}`);
        console.error("Details:", error);
        alert(`Something went wrong during logout: \n${handleError(error)}`);
      }
    }
    logoutUser();
  }

  let userIconClass, userIconInitials;
  if (userOnline) {
    userIconClass = "header userIcon online";

    // Create user name initials
    let name_parts = name.split(" ");
    if(name_parts.length > 1){
      userIconInitials = (name_parts[0][0] + name_parts[1][0]);
    }
    else {
      if (name_parts[0].length > 1){
        userIconInitials = name_parts[0].substring(0,2);
      }
      else {
        userIconInitials = name_parts[0][0];
      }
    }
    userIconInitials = userIconInitials.toUpperCase();
    //userIconInitials = "SB";
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
          <div className={classBaseName + (props.selectedMenu === "task_overview" ? " selected" : "")} onClick={(b) => navigate(b,'/game/dashboard')}>Task Overview</div>
          <div className={classBaseName + (props.selectedMenu === "reports" ? " selected" : "")} onClick={(b) => navigate(b,'/reports')}>Reports</div>
          <div className={classBaseName + (props.selectedMenu === "scoreboard" ? " selected" : "")} onClick={(b) => navigate(b,'/scoreboard')}>Scoreboard</div>
        </div>

        <Tooltip title={""}>
          <div className={userIconClass} onClick={handleClick}>
            <div>{userIconInitials}</div>
          </div>
        </Tooltip>
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            className={"userMenu"}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 30,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <div className={"userMenu title"}>{name}</div>
          <Divider />
          <MenuItem onClick={(m) => navigate(m,'/profile')}>
            <Avatar className={"userMenu userAvatar"} /> My Profile
          </MenuItem>
          <MenuItem onClick={() => logout()}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
  );
}
HeaderContent.propTypes = {
  selectedMenu: PropTypes.string,
  active: PropTypes.number
};

const Header = (props) => {
  return(
      <HeaderContent props={props} />
  );
}

export default Header;

