import React from "react";
import "./routes.css";
import { container, content } from "./routes.module.css";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";

// **************
// * COMPONENTS *
// **************

// HELPERS
import ScrollToTop from "./ScrollToTop";

// PUBLIC
import FrontPage from "./Containers/FrontPage";
import AboutPage from "./Components/AboutPage/AboutPage";
import { FooterSection } from "./Components/Footer/Footer";
// import { Header } from "./Components/Header/Header";

// USER
import { Signup } from "./Components/User/Signup/Signup";
import { Login } from "./Components/User/Login/Login";
import { ForgotPassword } from "./Components/User/ForgotPassword/ForgotPassword";
import { Awaiting } from "./Components/User/Awaiting/Awaiting";
import { SignOut } from "./Components/User/SignOut/SignOut";

// SHARING
import LinkBridge from "./Components/Shared/LinkBridge/LinkBridge";

// LOGGED IN PAGES
import { LoggedInRouter } from "./Components/LOGGED_IN_PAGES/LoggedInRouter";

// **********
// * ROUTES *
// **********

// PUBLIC
export const frontpage = "/";
export const aboutpage = "/about";

// USER
export const signOut = "/signout";
export const login = "/login";
export const forgotPassword = "/forgotPassword";
export const signup = "/signup";
export const awaiting = "/awaiting";

// SHARING
export const link_bridge = `/link`;

// LOGGED IN PAGES
export const dashboard = "/dashboard";
export const profile = `${dashboard}/profile`;
export const report = `${dashboard}/report`;
export const inbox = `${dashboard}/inbox`;
export const activities = `${dashboard}/activities`;
export const tags = `${dashboard}/tags`;
export const groups = `${dashboard}/groups`;
export const settings = `${dashboard}/settings`;
export const team = `${dashboard}/team`;

export const evaluation_templates = `${dashboard}/templates`;
export const evaluation_template = `${evaluation_templates}/edit`;

export const Routes = () => (
  <Router basename="/">
    <ScrollToTop>
      <Switch>
        <Route exact path={frontpage} component={FrontPage} />
        <Route exact path={aboutpage} component={AboutPage} />

        <Route exact path={signup} component={Signup} />
        <Route exact path={login} component={Login} />
        <Route exact path={signOut} component={SignOut} />
        <Route exact path={forgotPassword} component={ForgotPassword} />
        <Route exact path={awaiting} component={Awaiting} />

        <Route path={link_bridge} component={LinkBridge} />

        {/*<Route exact path={profile} component={ProfilePage} />*/}

        <Route path={dashboard} component={LoggedInRouter} />

        <Route render={() => <div>404</div>} />

        {
          // <Route render={() => <Redirect to={frontpage} />} />
        }
      </Switch>
    </ScrollToTop>
  </Router>
);
