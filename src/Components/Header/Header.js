import React from "react";
import { Route, Switch } from "react-router-dom";

import { DashboardHeader } from "./DashboardHeader";

import { dashboard } from "../../pages/definitions";

const HeaderComponent = () => {
  return (
    <div>
      <header>
        <div>
          <Switch>
            <Route path={dashboard} component={DashboardHeader} />
            <Route render={() => null} />
          </Switch>
        </div>
      </header>
    </div>
  );
};

export default HeaderComponent;
