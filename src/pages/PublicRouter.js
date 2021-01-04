import React from "react";
import { Switch, withRouter } from "react-router-dom";
import Route from "react-router/es/Route";

// ROUTES
import {
  public_creative,
  demo_page,
  public_pages,
  ban_demo_page,
  product_demo,
  public_presentation,
  oia_demo_page,
} from "./definitions";

import { ProductDemo } from "./public/ProductDemo/ProductDemo";
import { DemoPage } from "./public/DemoPage/DemoPage";
// import { BanDemoPage } from "./public/BAN_DemoPage/BAN_DemoPage";
import { OIADemoPage } from "./public/OIA_DemoPage/OIA_DemoPage";

import { PublicCreative as ExternalForm } from "./public/ExternalForm/PublicCreative/PublicCreative";
// import { PublicCreative } from "./public/PublicCreative/PublicCreative";
import { PublicPresentationPage } from "./public/PublicPresentationPage/PublicPresentationPage";

export const RouterComponent = ({ history }) => {
  return (
    <Switch>
      <Route exact path={demo_page} component={DemoPage} />
      {/*<Route exact path={ban_demo_page} component={BanDemoPage} />*/}
      <Route exact path={oia_demo_page} component={OIADemoPage} />
      <Route exact path={product_demo} component={ProductDemo} />

      <Route
        exact
        path={`${public_presentation}/:id/:email`}
        component={PublicPresentationPage}
      />

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