import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
// import {GameGuard} from "components/routing/routeProtectors/GameGuard";
//import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import CreationForm from "components/views/CreationForm";
import Dashboard from "components/views/Dashboard";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter forceRefresh={true}>
      <Switch>
        <Route exact path="/dashboard">
            <Dashboard/> {/* DashboardGuard has to be added. */} 
        </Route>
        <Route exact path="/creationform">
            <CreationForm/> {/* CreationFormGuard has to be added. */} 
        </Route>
        <Route exact path="/login">
          <LoginGuard>
            <Login/>
          </LoginGuard>
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
