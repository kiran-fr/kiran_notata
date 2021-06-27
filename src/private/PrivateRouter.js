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
  ui_components,
  team,
  startup_page,
  pre_profile,
  group,
  external_form,
  facts_templates,
  facts_template,
  navigation,
  startup_index,
  startup_company_profile,
  group_new,
  group_dashboard,
  reports,
  notifications_page,
  news,
  news_view_one,
  new_news,
  edit_news,
  your_team,
  funnels1,
  tags1,
  web_form,
  notification,
  setting_profile,
  settings,
  evaluation_templates_page,
  evaluation_template_page,
  archive_page,
  reminders,
  evaluate_page,
  evaluation_summary_page,
} from "../definitions";

// Landing page / list
import StartupSection from "./Pages/Startup/StartupPage";

import Charts from "./oldPages/Dashboard/Charts/ChartsPage.tsx";
import Profile from "./oldPages/Profile/Profile";
import Tags from "./oldPages/Tags";
import Funnels from "./oldPages/Funnels";
import Team from "./oldPages/Team/Team";
import StartupPage from "./oldPages/StartupPage/StartupPage";
import FactsPage from "./oldPages/StartupPage/Facts/Facts";
import UI_Components from "./oldPages/UI_Components";

// Evaluation templates

import FactsTemplates from "./oldPages/FactsTemplates/FactsTemplates/FactsTemplates";
import FactsTemplate from "./oldPages/FactsTemplates/FactsTemplate/FactsTemplate";
import EvaluationV2Page from "./Pages/EvaluationV2/";
import EvaluationSummary from "./Pages/EvaluationV2/Summary";

// Groups
import Group from "./oldPages/Groups/Group/Group";
import GroupConnection from "./oldPages/Groups/GroupConnection";
import GroupSettings from "./oldPages/Groups/GroupSettings";

import Groups from "./Pages/GroupV2/index";
import GroupDashboard from "./Pages/GroupV2/group-dashboard";
import News from "./Pages/news/news";
import NewsViewOne from "./Pages/news/NewsViewOne";
import NewsEdit from "./Pages/news/news-edit";

// Loader
import { GhostLoader } from "Components/elements";
import { ErrorBoundary } from "Components/ErrorBoundary";

// Styles
import { Header } from "Components/Header/Header";
import ExternalForm from "./oldPages/ExternalForm/ExternalForm";
import Navigation from "./oldPages/UI_Components/Navigation/Navigation";

// Shubham Imports
import { Startup } from "./shubham-new-designs/pages/startup/index";
import Reminders from "./shubham-new-designs/pages/dashboard/reminders";
// New Startup Info
import Reports from "./Pages/srv_startup/pages/reports/reports";
import { StartupPage as StartupInfo } from "./Pages/StartupPage/index";
import Dashboard from "./Pages/srv_startup/pages/dashboard/dashboard";


import { EvaluationTemplatesPage } from "./Pages/srv_startup/pages/EvaluationTemplates/EvaluationTemplatesPage/EvaluationTemplatesPage";
import { EvaluationTemplatePage } from "./Pages/srv_startup/pages/EvaluationTemplates/EvaluationTemplatePage/EvaluationTemplatePage";
import { EvaluationTemplateSectionPage } from "./Pages/srv_startup/pages/EvaluationTemplates/EvaluationTemplateSectionPage/EvaluationTemplateSectionPage";

// New Jørgen import
import NotificationsPage from "./Pages/Notifications/notifications";

//settings
import Settings from "./Pages/settings/settings";
import yourTeam from "./Pages/settings/your-team";
import webForm from "./Pages/settings/web-form";
import TagGroup from "./Pages/settings/tags";
import Funnels1 from "./Pages/settings/funnels";
import Notifications from "./Pages/settings/notifications";
import ProfileSettings from "./Pages/settings/profile";
import ArchivePage from "./Pages/ArchivePage/ArchivePage.js";
import EvaluatePage from "./Pages/Evaluate/EvaluatePage";
import EvaluationSummaryPage from "./Pages/Evaluate/EvaluationSummaryPage";


export const RouterComponent = ({ history }) => {
  return (
    <Switch>
      <Route eaxct path={reports} component={Reports} />

      <Route exact path={startup_page} component={StartupSection} />

      <Route exact path={profile} component={Profile} />

      <Route exact path={tags} component={Tags} />

      <Route exact path={team} component={Team} />

      <Route exact path={external_form} component={ExternalForm} />

      <Route exact path={charts} component={Charts} />

      <Route eaxct path={notifications_page} component={NotificationsPage} />

      <Route exact path={funnels} component={Funnels} />

      {/* dashboard */}
      <Route exact path={dashboard} component={Dashboard} />

      <Route exact path={settings} component={Settings} />
      <Route exact path={your_team} component={yourTeam} />
      <Route exact path={web_form} component={webForm} />
      <Route exact path={tags1} component={TagGroup} />
      <Route exact path={funnels1} component={Funnels1} />
      <Route exact path={notification} component={Notifications} />
      <Route exact path={setting_profile} component={ProfileSettings} />

      <Route exact path={facts_templates} component={FactsTemplates} />

      <Route exact path={`${facts_template}/:id`} component={FactsTemplate} />

      <Route eaxct path={news} component={News} />
      <Route eaxct path={`${news_view_one}/:id`} component={NewsViewOne} />
      <Route eaxct path={new_news} component={NewsEdit} />

      <Route eaxct path={`${edit_news}/:id`} component={NewsEdit} />
      <Route exact path={archive_page} component={ArchivePage} />

      <Route
        exact
        path={[
          `${evaluate_page}/:connectionId/:templateId/:evaluationId`,
          `${evaluate_page}/:connectionId/:templateId`,
        ]}
        component={EvaluatePage}
      />

      <Route
        exact
        path={`${evaluation_summary_page}/:connectionId/:templateId/:evaluationId`}
        component={EvaluationSummaryPage}
      />

      <Route
        exact
        path={evaluation_templates_page}
        component={EvaluationTemplatesPage}
      />

      <Route
        exact
        path={`${evaluation_template_page}/:id`}
        component={EvaluationTemplatePage}
      />

      <Route
        exact
        path={`${evaluation_template_page}/:id/section/:sectionId`}
        component={EvaluationTemplateSectionPage}
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
      <Route
        exact
        path={`${group_dashboard}/:groupId`}
        component={GroupDashboard}
      />

      <Route eaxct path={news} component={News} />
      <Route eaxct path={reminders} component={Reminders} />
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
      <Navigation history={props.history} />
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
