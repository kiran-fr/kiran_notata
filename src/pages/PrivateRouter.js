import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Redirect, Switch } from "react-router-dom";
import Route from "react-router/es/Route";

// API
import { useQuery } from "@apollo/client";
import { userGet } from "Apollo/Queries";

// ROUTES
import {
  signup,
  dashboard,
  profile,
  report,
  inbox,
  activities,
  tags,
  settings,
  team,
  evaluation_templates,
  evaluation_template,
  evaluation_template_summary,
  startup_page,
  new_startup_page,
  pre_profile,
  group,
  external_form,
  facts_templates,
  facts_template,
} from "./definitions";

// Landing page / list
import Dashboard from "./private/Dashboard/DashboardPage";

import Profile from "./private/Profile/Profile";

import Report from "./private/Report/Report";
import Inbox from "./private/Inbox/Inbox";
import Activities from "./private/Activities/Activities";
import Tags from "./private/Tags";
import Settings from "./private/Settings/Settings";
import Team from "./private/Team/Team";
import StartupPage from "./private/StartupPage/StartupPage";
import NewStartupPage from "./private/NewStartupPage/NewStartupPage";
import FactsPage from "./private/StartupPage/Facts/Facts";

// Evaluation templates
import EvaluationTemplates from "./private/Templates/EvaluationTemplates/EvaluationTemplates";
import EvaluationTemplate from "./private/Templates/EvaluationTemplate/EvaluationTemplate";
import EvaluationTemplateSection from "./private/Templates/EvaluationTemplateSection";
import EvaluationTemplateSummary from "./private/Templates/EvaluationTemplateSummary/EvaluationTemplateSummary";

import EvaluationPage from "./private/Evaluation";
import SectionPage from "./private/Evaluation/Section";
import SummaryPage from "./private/Evaluation/Summary";

import FactsTemplates from "./private/FactsTemplates/FactsTemplates/FactsTemplates";
import FactsTemplate from "./private/FactsTemplates/FactsTemplate/FactsTemplate";

// Groups
import Groups from "./private/Groups/Groups";
import Group from "./private/Groups/Group/Group";
import GroupConnection from "./private/Groups/GroupConnection";
import GroupSettings from "./private/Groups/GroupSettings";

// Loader
import { GhostLoader } from "Components/elements";

// Styles
import Header from "Components/Header/Header";
import ExternalForm from "./private/ExternalForm/ExternalForm";
import SideBarTreeMenu from "../Components/SideBarMenu/SideBarTreeMenu";

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

      <Route exact path={facts_templates} component={FactsTemplates} />

      <Route exact path={`${facts_template}/:id`} component={FactsTemplate} />

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

      <Route
        exact
        path={`${evaluation_template_summary}/:templateId`}
        component={EvaluationTemplateSummary}
      />

      <Route exact path={`${group}`} component={Groups} />

      <Route exact path={`${group}/:id`} component={Group} />

      <Route exact path={`${group}/:id/settings`} component={GroupSettings} />

      <Route
        exact
        path={`${group}/:id/:connectionId`}
        component={GroupConnection}
      />

      <Route
        exact
        path={`${startup_page}/:id`}
        // component={StartupPage}
        component={NewStartupPage}
      />

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

      <Route
        exact
        path={`${new_startup_page}/:id`}
        component={NewStartupPage}
      />

      <Route exact path={team} component={Team} />

      <Route exact path={external_form} component={ExternalForm} />

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

  if (loading && !data) return <GhostLoader />;

  if (!loading && !error && data) {
    // console.log("data", data);

    let user = data.userGet || {};
    if (user.email === null) {
      return <Redirect to={pre_profile} />;
    }
  }

  return (
    <>
      <Header />
      <SideBarTreeMenu {...props} />
      {/*<SideBar {...props} />*/}
      <div
        className={`logged_in_page_content ${
          props.location.state?.rightMenu ? "show_right_activity" : ""
        }`}
      >
        <RouterComponent {...props} />
      </div>
    </>
  );
};

export const LoggedInRouter = WrapperComponent;
