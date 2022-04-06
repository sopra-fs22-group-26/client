import React from "react";
import {ReactLogo} from "components/ui/ReactLogo";
import mainLogo from "images/scrumblebee_logo_508x95.png"
import {ReactComponent as UserIconSelected} from "images/user_icon_selected.svg";
import PropTypes from "prop-types";
import "styles/views/Header.scss";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const Header = props => (
    <div className="header container">
      <div className="header mainlogo">
        <img src={mainLogo} alt="Logo"/>
      </div>
      <div className="header mainmenu">
        <div className="header mainmenu menuitem selected">Task Overview</div>
        <div className="header mainmenu menuitem active">Reports</div>
        <div className="header mainmenu menuitem">Scoreboard</div>
      </div>
      <div className="header userIcon online">MH</div>

    </div>
);

Header.propTypes = {
  height: PropTypes.string
};

/**
 * Don't forget to export your component!
 */
export default Header;
