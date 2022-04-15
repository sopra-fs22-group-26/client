import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import editIcon from "../../images/task_edit_icon.svg"
import {CreationButton} from 'components/ui/CreationButton';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";


const Dashboard = () => {

  const history = useHistory();

  return (
      <div>
          <div>
            <CreationButton onClick = { () => history.push('/creationform')} >
              Create new task
            </CreationButton>
          </div>
          <div>
              <button><img src={editIcon} onClick= { () => history.push('/editform')} /></button>
          </div>
      </div>
  );
}

export default Dashboard;
