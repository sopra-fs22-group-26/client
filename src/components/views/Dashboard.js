import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
//import {CreationButton} from 'components/ui/CreationButton';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import 'styles/views/Dashboard.scss';


const Dashboard = () => {

const CreationButton = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className = "dashboard create-button">
    {props.children}
  </button>
  );

  const history = useHistory();

  return (
      <div>
        <CreationButton onClick = { () => history.push('/creationform')} >
          Create new task  
        </CreationButton>
      </div>
    
    
  );
}

export default Dashboard;
