import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Redirect, Switch, withRouter } from "react-router-dom";
import Route from "react-router/es/Route";

// API
// import { Query } from "@apollo/client/react/components";
import { useQuery } from "@apollo/client";
import { userGet } from "../../Apollo/Queries";

// ROUTES
import {
  signup,
  dashboard,
  profile,
  report,
  inbox,
  activities,
  tags,
  groups,
  settings,
  team,
  evaluation_templates,
  evaluation_template
} from "../../routes";

// Landing page / list
import Dashboard from "./Dashboard/DashboardPage";

import Profile from "./Profile/Profile";
import Report from "./Report/Report";
import Inbox from "./Inbox/Inbox";
import Activities from "./Activities/Activities";
import Tags from "./Tags/Tags";
import Groups from "./Groups/Groups";
import Settings from "./Settings/Settings";
import Team from "./Team/Team";

// Evaluation templates
import EvaluationTemplates from "./Templates/EvaluationTemplates/EvaluationTemplates";
import EvaluationTemplate from "./Templates/EvaluationTemplate/EvaluationTemplate";
import EvaluationTemplateSection from "./Templates/EvaluationTemplateSection/";

// Loader
import { GhostLoader } from "../elements/GhostLoader";

// Styles
import { container, inner_container } from "../elements/Style.module.css";

import SideBar from "../SideBar/SideBar";
import Header from "../Header/Header";

export const RouterComponent = ({ history }) => {
  return (
    <div className={inner_container}>
      <Switch>
        <Route exact path={dashboard} component={Dashboard} />

        <Route exact path={profile} component={Profile} />

        <Route exact path={report} component={Report} />

        <Route exact path={inbox} component={Inbox} />

        <Route exact path={activities} component={Activities} />

        <Route exact path={tags} component={Tags} />

        <Route exact path={groups} component={Groups} />

        <Route exact path={settings} component={Settings} />

        <Route exact path={team} component={Team} />

        <Route
          exact
          path={evaluation_templates}
          component={EvaluationTemplates}
        />
        <Route
          exact
          path={`${evaluation_template}/:id`}
          component={EvaluationTemplate}
        />
        <Route
          exact
          path={`${evaluation_template}/:id/:sectionId`}
          component={EvaluationTemplateSection}
        />

        <Route exact path={team} component={Team} />

        <Route render={() => <div>404</div>} />
      </Switch>
    </div>
  );
};

const WrapperComponent = ({ ...props }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(undefined);

  const { data, loading, error } = useQuery(userGet);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setUserLoggedIn(true))
      .catch(() => setUserLoggedIn(false));
  }, []);

  if (userLoggedIn === false) {
    return <Redirect to={signup} />;
  }

  if (loading) return <GhostLoader />;

  if (!loading && !error && data) {
    let user = data.userGet || {};
    if (user.email === null) {
      return <Redirect to={profile} />;
    }
  }

  return (
    <>
      <Header />
      <SideBar />
      <div className={container}>
        <RouterComponent {...props} />
      </div>
    </>
  );
};

export const LoggedInRouter = withRouter(WrapperComponent);
