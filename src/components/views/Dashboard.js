import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {CreationButton} from 'components/ui/CreationButton';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";


const Dashboard = () => {

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
