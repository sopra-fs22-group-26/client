import React from "react";
import {api, handleError} from "helpers/api";
import {useHistory} from "react-router-dom";
import {Menu, Avatar, Divider, ListItemIcon, MenuItem, Tooltip} from "@mui/material";
import {Logout} from "@mui/icons-material";
import {initialsOf} from "helpers/userDisplay";

import "styles/ui/UserMenu.scss";

export const UserMenu = () => {
    // Pop-up menu for user profile and logout
    // Uses Material UI (MUI)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    // use react-router-dom's hook to access the history
    const history = useHistory();

    // User-related parameters and css-classes according to user state
    let username, name, userIconClass, userIconInitials;
    let userOnline = false;
    if (localStorage.getItem("token") && localStorage.getItem("id")) {
        // User is online
        userOnline = true;
        username = localStorage.getItem("username");
        name = localStorage.getItem("name") ? localStorage.getItem("name") : localStorage.getItem("username");
        userIconClass = "header userIcon online";
        userIconInitials = initialsOf(name);
    }
    else {
        userIconClass = "header userIcon offline";
        userIconInitials = "";
    }


    // Open and close user menu
    const handleClick = (event) => {
        if (userOnline){
            setAnchorEl(event.currentTarget);
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Navigate to different page iff user is loggedIn and not on current menu-page
    function navigate(button, location) {
        if (userOnline && !button.target.className.includes("selected")) history.push(location);
    }

    // Handle the logout process
    const logout = () => {
        async function logoutUser() {
            try {
                const requestBody = JSON.stringify({username});
                await api.post('/auth/logout', requestBody);

                // Clear local cache and navigate to login page
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
                localStorage.removeItem('token');
            }
        }
        logoutUser();
    };


    /**
     * Construct and return component
     */
    return (
        <div className="userIconContainer">
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
};


