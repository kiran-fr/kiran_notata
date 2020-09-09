import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// **************
// * COMPONENTS *
// **************

// HELPERS
import ScrollToTop from "../ScrollToTop";

// PUBLIC
import FrontPage from "../Containers/FrontPage";

// USER
import { Signup } from "../Components/User/Signup/Signup";
import { Login } from "../Components/User/Login/Login";
import { ForgotPassword } from "../Components/User/ForgotPassword/ForgotPassword";
import { Awaiting } from "../Components/User/Awaiting/Awaiting";
import { SignOut } from "../Components/User/SignOut/SignOut";
import PreProfile from "../Components/User/PreProfile/Profile";

// SHARING
import LinkBridge from "../Components/Shared/LinkBridge/LinkBridge";

// LOGGED IN PAGES
import { LoggedInRouter } from "./PrivateRouter";

// PUBLIC SHARED PAGES
import { PublicRouter } from "./PublicRouter";
import {
  frontpage,
  signup,
  login,
  signOut,
  forgotPassword,
  awaiting,
  pre_profile,
  link_bridge,
  dashboard,
  public_pages,
} from "./definitions";

import "./routes.css";

export const Routes = () => (
  <Router basename="/">
    <ScrollToTop>
      <Switch>
        <Route exact path={frontpage} component={FrontPage} />

        <Route exact path={signup} component={Signup} />
        <Route exact path={login} component={Login} />
        <Route exact path={signOut} component={SignOut} />
        <Route exact path={forgotPassword} component={ForgotPassword} />
        <Route exact path={awaiting} component={Awaiting} />

        <Route exact path={pre_profile} component={PreProfile} />

        <Route path={link_bridge} component={LinkBridge} />

        <Route path={dashboard} component={LoggedInRouter} />

        <Route path={public_pages} component={PublicRouter} />

        <Route render={() => <div>404</div>} />
      </Switch>
    </ScrollToTop>
  </Router>
);
