import {BrowserRouter, Route, Switch} from "react-router-dom";
import Header from "components/views/Header";

// Display selected menu accordingly
const HeaderRouter = () => {
  return (
      <BrowserRouter forceRefresh={true}>
        <Switch>
          <Route path="/game/dashboard">
              <Header selectedMenu="task_overview" active="1"/>
          </Route>
          <Route path="/dashboard">
            <Header selectedMenu="task_overview" active="1"/>
          </Route>
          <Route path="/reports">
            <Header selectedMenu="reports" active="1"/>
          </Route>
          <Route path="/scoreboard">
            <Header selectedMenu="scoreboard" active="1"/>
          </Route>
          <Route>
            <Header selectedMenu="none" active="0"/>
          </Route>
        </Switch>
      </BrowserRouter>
  );
};

export default HeaderRouter;
