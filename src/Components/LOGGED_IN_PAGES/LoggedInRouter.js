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
  evaluation_template,
  startup_page,
  pre_profile,
  group,
} from "../../routes";

// Landing page / list
import Dashboard from "./Dashboard/DashboardPage";

import Profile from "./Profile/Profile";

import Report from "./Report/Report";
import Inbox from "./Inbox/Inbox";
import Activities from "./Activities/Activities";
import Tags from "./Tags/Tags";
import Settings from "./Settings/Settings";
import Team from "./Team/Team";
import StartupPage from "./StartupPage/StartupPage";
import FactsPage from "./StartupPage/Facts/Facts";

// Evaluation templates
import EvaluationTemplates from "./Templates/EvaluationTemplates/EvaluationTemplates";
import EvaluationTemplate from "./Templates/EvaluationTemplate/EvaluationTemplate";
import EvaluationTemplateSection from "./Templates/EvaluationTemplateSection/";

import EvaluationPage from "./Evaluation";
import SectionPage from "./Evaluation/Section";
import SummaryPage from "./Evaluation/Summary";

// Groups
import Groups from "./Groups/Groups";
import Group from "./Groups/Group";
import GroupConnection from "./Groups/GroupConnection";

// Loader
import { GhostLoader } from "../elements/";

// Styles
import SideBar from "../SideBar/SideBar";
import Header from "../Header/Header";

export const RouterComponent = ({ history }) => {
  return (
    <Switch>
      <Route exact path={dashboard} component={Dashboard} />

      <Route exact path={profile} component={Profile} />

      <Route exact path={report} component={Report} />

      <Route exact path={inbox} component={Inbox} />

      <Route exact path={activities} component={Activities} />

      <Route exact path={tags} component={Tags} />

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

      <Route exact path={`${group}`} component={Groups} />

      <Route exact path={`${group}/:id`} component={Group} />

      <Route
        exact
        path={`${group}/:id/:connectionId`}
        component={GroupConnection}
      />

      <Route exact path={`${startup_page}/:id`} component={StartupPage} />

      <Route
        exact
        path={`${startup_page}/:id/creative/:creativeId`}
        component={FactsPage}
      />

      <Route
        exact
        path={`${startup_page}/:connectionId/evaluation/:evaluationId`}
        component={EvaluationPage}
      />
      <Route
        exact
        path={`${startup_page}/:connectionId/evaluation/:evaluationId/summary`}
        component={SummaryPage}
      />
      <Route
        exact
        path={`${startup_page}/:connectionId/evaluation/:evaluationId/section/:sectionId`}
        component={SectionPage}
      />

      <Route exact path={team} component={Team} />

      <Route render={() => <div>404</div>} />
    </Switch>
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
      return <Redirect to={pre_profile} />;
    }
  }

  return (
    <>
      <Header />
      <SideBar />
      <div className="logged_in_page_content">
        <RouterComponent {...props} />
      </div>
    </>
  );
};

export const LoggedInRouter = withRouter(WrapperComponent);
