import React from "react";
import { Switch, withRouter } from "react-router-dom";
import Route from "react-router/es/Route";

// ROUTES
import { public_creative, demo_page, public_pages } from "./definitions";
import { DemoPage } from "./public/DemoPage/DemoPage";

import { PublicCreative as ExternalForm } from "./public/ExternalForm/PublicCreative/PublicCreative";

import { PublicCreative } from "./public/PublicCreative/PublicCreative";

export const RouterComponent = ({ history }) => {
  return (
    <Switch>
      <Route exact path={demo_page} component={DemoPage} />
      <Route
        exact
        path={`${public_creative}/:accountId/:id`}
        component={ExternalForm}

        // component={PublicCreative}
      />
      <Route
        exact
        path={`${public_pages}/:accountId/form.html`}
        component={ExternalForm}
      />
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
