import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import {MainGuard} from "components/routing/routeProtectors/MainGuard";

import Login from "components/views/Login";
import Signup from "components/views/Signup";
import Dashboard from "components/views/Dashboard";
import Reports from "components/views/Reports";

import Profile from "components/views/Profile";
import EditProfile from "components/views/EditProfile";

import TaskDetails from "components/views/TaskDetails";
import EditForm from "components/views/EditForm";
import CreationForm from "components/views/CreationForm";
import Scoreboard from "components/views/Scoreboard";
import RatingForm from "../../views/RatingForm";
import SessionLobby from "components/views/SessionLobby";
import WaitingLobby from "../../views/WaitingLobby";
import VotingLobby from "../../views/VotingLobby";

/**
 * Main router of your application.
 */
const AppRouter = () => {
  return (
    <BrowserRouter forceRefresh={true}>
      <Switch>
        <Route exact path="/dashboard">
          <MainGuard>
            <Dashboard/>
          </MainGuard>
        </Route>
        <Route exact path="/reports">
          <MainGuard>
            <Reports/>
          </MainGuard>
        </Route>
        <Route exact path="/task/:task_id">
          <MainGuard>
            <TaskDetails/>
          </MainGuard>
        </Route>
        <Route exact path="/creationform">
          <MainGuard>
            <CreationForm/>
          </MainGuard>
        </Route>
        <Route exact path="/sessionlobby">
          <MainGuard>
            <SessionLobby/>
          </MainGuard>
        </Route>
        <Route exact path="/waitinglobby/:meetingId">
          <MainGuard>
            <WaitingLobby/>
          </MainGuard>
        </Route>
        <Route exact path="/votinglobby/:meetingId">
          <MainGuard>
            <VotingLobby/>
          </MainGuard>
        </Route>
        <Route exact path="/editform/:task_id">
          <MainGuard>
            <EditForm/>
          </MainGuard>
        </Route>
        <Route exact path="/ratingform/:task_id">
          <MainGuard>
            <RatingForm/>
          </MainGuard>
        </Route>
        <Route exact path="/login">
          <LoginGuard>
            <Login/>
          </LoginGuard>
        </Route>
        <Route exact path="/signup">
          <LoginGuard>
            <Signup/>
          </LoginGuard>
        </Route>
        <Route exact path="/profile">
          <MainGuard>
            <Profile/>
          </MainGuard>
        </Route>
        <Route exact path="/editProfile">
          <MainGuard>
            <EditProfile/>
          </MainGuard>
        </Route>
        <Route exact path="/scoreboard">
          <MainGuard>
            <Scoreboard/>
          </MainGuard>
        </Route>
        <Route exact path="/">
          <Redirect to="/dashboard"/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
