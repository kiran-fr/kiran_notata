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
  funnels,
  settings,
  ui_components,
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
  navigation,
  startup_index,
  startup_company_profile,
  startup_info,
  group_new,
  evaluation_template_new,
  add_section,
  group_dashboard,
  evaluation_template_new_dev,
  evaluation_template_profile,
  add_section_dev,
  reports,
  notifications_page,
} from "../definitions";

// Landing page / list
import StartupSection from "./NewDesign/Startup/StartupPage";

// import Dashboard from "./pages/Dashboard/DashboardPage";
import Charts from "./pages/Dashboard/Charts/ChartsPage";
import Profile from "./pages/Profile/Profile";
import Tags from "./pages/Tags";
import Funnels from "./pages/Funnels";
import Settings from "./pages/Settings/Settings";
import Team from "./pages/Team/Team";
import StartupPage from "./pages/StartupPage/StartupPage";
import FactsPage from "./pages/StartupPage/Facts/Facts";
import UI_Components from "./pages/UI_Components";

// Evaluation templates
import EvaluationTemplates from "./pages/Templates/EvaluationTemplates/EvaluationTemplates";
import EvaluationTemplate from "./pages/Templates/EvaluationTemplate/EvaluationTemplate";
import EvaluationTemplateSection from "./pages/Templates/EvaluationTemplateSection";
import EvaluationTemplateSummary from "./pages/Templates/EvaluationTemplateSummary/EvaluationTemplateSummary";
import FactsTemplates from "./pages/FactsTemplates/FactsTemplates/FactsTemplates";
import FactsTemplate from "./pages/FactsTemplates/FactsTemplate/FactsTemplate";
import EvaluationV2Page from "./pages/EvaluationV2/";
import EvaluationSummary from "./pages/EvaluationV2/Summary";

// Groups
// import Groups from "./pages/Groups/Groups";
import Group from "./pages/Groups/Group/Group";
import GroupConnection from "./pages/Groups/GroupConnection";
import GroupSettings from "./pages/Groups/GroupSettings";

import Groups from "./shubham-new-designs/pages/groups/index";

// Loader
import { GhostLoader } from "Components/elements";
import { ErrorBoundary } from "Components/ErrorBoundary";

// Styles
import { Header } from "Components/Header/Header";
import ExternalForm from "./pages/ExternalForm/ExternalForm";
import Navigation from "./pages/UI_Components/Navigation/Navigation";

// Shubham Imports
import { Startup } from "./shubham-new-designs/pages/startup/index";
import ElevationTemplates from "./shubham-new-designs/pages/startup/evaluations/evaluation-templates";
import AddSection from "./shubham-new-designs/pages/startup/evaluations/add-new-section";
import GroupDashboard from "./shubham-new-designs/pages/groups/group-dashboard";
import Reports from "./shubham-new-designs/pages/reports/reports";

// New Startup Info
import { Startup as StartupInfo } from "./NewDesign/srv_startup/pages/startup/index";
import { ElevationTemplates as ElevationTemplatesDev } from "./NewDesign/srv_startup/pages/startup/evaluations/evaluation-templates";
import { AddSection as AddSectionDev } from "./NewDesign/srv_startup/pages/startup/evaluations/add-new-section";
import { TemplateSection } from "./NewDesign/srv_startup/pages/startup/evaluations/template-section";

// New Jørgen import
import NotificationsPage from "./NewDesign/Notifications/notifications";

/* import SideBarTreeMenu from "../Components/SideBarMenu/SideBarTreeMenu"; */

export const RouterComponent = ({ history }) => {
  return (
    <Switch>
      <Route exact path={startup_page} component={StartupSection} />

      <Route exact path={profile} component={Profile} />

      <Route exact path={tags} component={Tags} />

      <Route exact path={team} component={Team} />

      <Route exact path={external_form} component={ExternalForm} />

      <Route exact path={charts} component={Charts} />

      <Route eaxct path={notifications_page} component={NotificationsPage} />

      <Route exact path={funnels} component={Funnels} />

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
        component={TemplateSection}
      />

      <Route
        exact
        path={`${evaluation_template_summary}/:templateId`}
        component={EvaluationTemplateSummary}
      />

      <Route exact path={`${group}`} component={Groups} />
      <Route exact path={`${group_new}`} component={Groups} />

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
        path={`${startup_page}/:connectionId/evaluationV2/template/:templateId`}
        component={EvaluationV2Page}
      />

      <Route
        exact
        path={`${startup_page}/:connectionId/evaluationV2/template/:templateId/evaluation/:evaluationId`}
        component={EvaluationV2Page}
      />

      <Route
        exact
        path={`${startup_page}/:connectionId/evaluation_summary/:evaluationId`}
        component={EvaluationSummary}
      />

      <Route exact path={ui_components} component={UI_Components} />

      <Route exact path={navigation} component={Navigation} />

      <Route exact path={startup_company_profile} component={StartupInfo} />

      <Route exact path={startup_index} component={Startup} />
      <Route exact path={group_dashboard} component={GroupDashboard} />

      <Route
        exact
        path={evaluation_template_new}
        component={ElevationTemplates}
      />

      <Route
        exact
        path={evaluation_template_new_dev}
        component={ElevationTemplatesDev}
      />

      <Route
        exact
        path={`${evaluation_template_profile}/:id`}
        component={AddSectionDev}
      />

      <Route
        exact
        path={`${evaluation_template_profile}/:id/:sectionId`}
        component={TemplateSection}
      />
      <Route exact path={add_section_dev} component={AddSectionDev} />

      <Route exact path={add_section} component={AddSection} />
      <Route eaxct path={reports} component={Reports} />

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
    <div className="page_container" style={{ display: "flex" }}>
      <Header history={props.history} />
      <Navigation />
      {/* <SideBarTreeMenu {...props} /> */}
      <div
        className={`logged_in_page_content ${
          matchPath(props.location.pathname, {
            path: [`${startup_page}/:id`],
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
    </div>
  );
};

export const LoggedInRouter = WrapperComponent;
