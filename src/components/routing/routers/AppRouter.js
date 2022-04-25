import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
// import {GameGuard} from "components/routing/routeProtectors/GameGuard";
//import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import {MainGuard} from "components/routing/routeProtectors/MainGuard";
import Login from "components/views/Login";
import CreationForm from "components/views/CreationForm";
import Dashboard from "components/views/Dashboard";
import Signup from "components/views/Signup";
import Profile from "components/views/Profile";
import EditProfile from "components/views/EditProfile";


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
        <Route exact path="/creationform">
          <MainGuard>
            <CreationForm/>
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
            <Profile/>
        </Route>

        <Route exact path="/editProfile">
          <EditProfile/>
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
