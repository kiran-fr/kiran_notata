import React from "react";
import { Switch, withRouter } from "react-router-dom";
import Route from "react-router/es/Route";

// ROUTES
import { public_creative, demo_page } from "./definitions";

import { PublicCreative } from "./public/PublicCreative/PublicCreative";
import { DemoPage } from "./public/DemoPage/DemoPage";

export const RouterComponent = ({ history }) => {
  return (
    <Switch>
      <Route exact path={demo_page} component={DemoPage} />
      <Route exact path={`${public_creative}/:id`} component={PublicCreative} />

      <Route render={() => <div>404</div>} />
    </Switch>
  );
};

const WrapperComponent = ({ ...props }) => {
  return (
    <>
      <div className="public_shared_page_content">
        <RouterComponent {...props} />
      </div>
    </>
  );
};

export const PublicRouter = withRouter(WrapperComponent);
