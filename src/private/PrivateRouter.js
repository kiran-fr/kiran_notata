import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Redirect, Switch } from "react-router-dom";
import { Route, matchPath } from "react-router";

// API
import { useQuery } from "@apollo/client";
import { userGet } from "private/Apollo/Queries";

// ROUTES
import {
  signup,
  dashboard,
  charts,
  profile,
  tags,
  settings,
  team,
  evaluation_templates,
  evaluation_template,
  evaluation_template_summary,
  startup_page,
  pre_profile,
  group,
  external_form,
  facts_templates,
  facts_template,
} from "../definitions";

// Landing page / list
import Dashboard from "./pages/Dashboard/DashboardPage";
import Charts from "./pages/Dashboard/Charts/ChartsPage";

import Profile from "./pages/Profile/Profile";

import Tags from "./pages/Tags";
import Settings from "./pages/Settings/Settings";
import Team from "./pages/Team/Team";
import StartupPage from "./pages/StartupPage/StartupPage";
import FactsPage from "./pages/StartupPage/Facts/Facts";

// Evaluation templates
import EvaluationTemplates from "./pages/Templates/EvaluationTemplates/EvaluationTemplates";
import EvaluationTemplate from "./pages/Templates/EvaluationTemplate/EvaluationTemplate";
import EvaluationTemplateSection from "./pages/Templates/EvaluationTemplateSection";
import EvaluationTemplateSummary from "./pages/Templates/EvaluationTemplateSummary/EvaluationTemplateSummary";

import EvaluationPage from "./pages/Evaluation";
import SectionPage from "./pages/Evaluation/Section";
import SummaryPage from "./pages/Evaluation/Summary";

import FactsTemplates from "./pages/FactsTemplates/FactsTemplates/FactsTemplates";
import FactsTemplate from "./pages/FactsTemplates/FactsTemplate/FactsTemplate";

// Groups
import Groups from "./pages/Groups/Groups";
import Group from "./pages/Groups/Group/Group";
import GroupConnection from "./pages/Groups/GroupConnection";
import GroupSettings from "./pages/Groups/GroupSettings";

// Loader
import { GhostLoader } from "Components/elements";
import { ErrorBoundary } from "Components/ErrorBoundary";

// Styles
import Header from "Components/Header/Header";
import ExternalForm from "./pages/ExternalForm/ExternalForm";
import SideBarTreeMenu from "../Components/SideBarMenu/SideBarTreeMenu";

export const RouterComponent = ({ history }) => {
  return (
    <Switch>
      <Route exact path={dashboard} component={Dashboard} />

      <Route exact path={profile} component={Profile} />

      <Route exact path={tags} component={Tags} />

      <Route exact path={settings} component={Settings} />

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

      <Route exact path={external_form} component={ExternalForm} />

      <Route exact path={charts} component={Charts} />

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
    let user = data.userGet || {};
    if (user.email === null) {
      return <Redirect to={pre_profile} />;
    }
  }

  return (
    <>
      <Header />
      <SideBarTreeMenu {...props} />
      <div
        className={`logged_in_page_content ${
          matchPath(props.location.pathname, {
            path: [`${startup_page}/:id`, `${group}/:id`],
            exact: true,
            strict: false,
          })
            ? "show_right_activity"
            : ""
        }`}
      >
        <ErrorBoundary>
          <RouterComponent {...props} />
        </ErrorBoundary>
      </div>
    </>
  );
};

export const LoggedInRouter = WrapperComponent;
