import React from "react";
import { Route, Switch } from "react-router-dom";
import { dashboard, profile } from "../../routes";
import { DashboardHeader } from "./DashboardHeader";

const HeaderComponent = () => {
  return (
    <div>
      <header>
        <div>
          <Switch>
            <Route path={dashboard} component={DashboardHeader} />
            {/*<Route path={profile} component={DashboardHeader} />*/}
            <Route render={() => null} />
          </Switch>
        </div>
      </header>
    </div>
  );
};

export default HeaderComponent;
