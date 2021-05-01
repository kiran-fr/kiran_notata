import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// HELPERS
import ScrollToTop from "./ScrollToTop";

// PUBLIC
import { FrontPage } from "Containers/FrontPage/FrontPage";

// USER
import { Signup } from "Containers/NewDesign/SignUp/SignUp";
import { Login } from "Containers/NewDesign/Login/Login";
import { ForgotPassword } from "Containers/NewDesign/ForgotPassword/ForgotPassword";
import { SignOut } from "Containers/NewDesign/SignOut/SignOut";
import PreProfile from "Containers/NewDesign/PreProfile/Profile";

// import { Signup } from "Containers/Auth/Signup/Signup";
// import { Login } from "Containers/Auth/Login/Login";
// import { ForgotPassword } from "Containers/Auth/ForgotPassword/ForgotPassword";
// import { SignOut } from "Containers/Auth/SignOut/SignOut";
// import PreProfile from "Containers/Auth/PreProfile/Profile";

import { Awaiting } from "Containers/Auth/Awaiting/Awaiting";

// Import Kanban View
import { KanbanPage } from "./private/NewDesign/Kanban/KanbanPage";

// SHARING
import { LinkBridge } from "Components/Shared/LinkBridge/LinkBridge";

import { LoggedInRouter } from "./private/PrivateRouter";

import { PublicRouter } from "./public/PublicRouter";
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
  kanban,
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

        <Route path={kanban} component={KanbanPage} />

        <Route path={public_pages} component={PublicRouter} />

        <Route render={() => <div>404</div>} />
      </Switch>
    </ScrollToTop>
  </Router>
);
