import React from "react";
import {useHistory} from 'react-router-dom';
import mainLogo from "images/scrumblebee_logo_508x95.png";
import "styles/views/Header.scss";
import {UserMenu} from "components/ui/UserMenu";
import {MainMenu} from "components/ui/MainMenu";

const HeaderContent = ({props}) => {
    // Check if user is logged-in
    let userOnline = false;
    if (localStorage.getItem("token") && localStorage.getItem("id")) {
        userOnline = true;
    }

    // Navigate to different page
    const history = useHistory();
    function navigate(button, location) {
        if (userOnline && !button.target.className.includes("selected")) history.push(location);
    }

    let mainLogoClass = "header mainlogo" + (userOnline ? " online" : "");

    // Display Header
    return (
        <div className="header container">
            <div className={mainLogoClass}
                 onClick={(b) => navigate(b,'/dashboard')}
            >
                <img src={mainLogo} alt="Logo"/>
            </div>
            <MainMenu
                {...props}
                loggedIn={userOnline}
            />
            <UserMenu />
        </div>
    );
}

const Header = (props) => {
    return(
        <HeaderContent props={props} />
    );
}

export default Header;

