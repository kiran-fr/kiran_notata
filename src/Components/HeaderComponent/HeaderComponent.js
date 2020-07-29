import React from "react";
import { Route, Switch } from "react-router-dom";
import { dashboard, profile } from "../../routes";
// import { DashboardHeader } from "./DashboardHeader";
import AntHeader from "./AntHeader";

const HeaderComponent = () => {
  return (
    <div>
      <header>
        <div>
          <Switch>
            <Route path={dashboard} component={AntHeader} />
            <Route path={profile} component={AntHeader} />
            <Route render={() => null} />
          </Switch>
        </div>
      </header>
    </div>
  );
};

export default HeaderComponent;
