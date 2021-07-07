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
  startup_page,
  pre_profile,
  group,
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
  fake_page,
  documentation,
} from "../definitions";

// Landing page / list
import StartupSection from "./Pages/MyStartups/StartupPage";
import Navigation from "../Components/Navigation/Navigation";

import EvaluationV2Page from "./Pages/Evaluation/";
import EvaluationSummary from "./Pages/Evaluation/Summary";

// Groups
import Groups from "./Pages/Group/GroupsPage/GroupsPage";
import GroupPage from "./Pages/Group/GroupPage/GroupPage";

import News from "./Pages/News/News";
import NewsViewOne from "./Pages/News/NewsViewOne";
import NewsEdit from "./Pages/News/NewsEdit";

// Loader
import { GhostLoader } from "Components/elements";
import { ErrorBoundary } from "Components/ErrorBoundary";

// Styles
import { Header } from "Components/Header/Header";

// Shubham Imports
import Reminders from "./Pages/Reminders/Reminders";

// New MyStartups Info
import Reports from "./Pages/Reports/reports";
import { StartupPage as StartupInfo } from "./Pages/StartupPage/index";
import Dashboard from "./Pages/Dashboard/dashboard";

import { EvaluationTemplatesPage } from "./Pages/EvaluationTemplates/EvaluationTemplatesPage/EvaluationTemplatesPage";
import { EvaluationTemplatePage } from "./Pages/EvaluationTemplates/EvaluationTemplatePage/EvaluationTemplatePage";
import { EvaluationTemplateSectionPage } from "./Pages/EvaluationTemplates/EvaluationTemplateSectionPage/EvaluationTemplateSectionPage";

// New Jørgen import
import NotificationsPage from "./Pages/Notifications/Notifications";

//Settings
import Settings from "./Pages/Settings/Settings";
import yourTeam from "./Pages/Settings/YourTeam/YourTeam";
import webForm from "./Pages/Settings/WebForm/WebForm";
import TagGroup from "./Pages/Settings/Tags/Tags";
import Funnels1 from "./Pages/Settings/Funnels/Funnels";
import Notifications from "./Pages/Settings/Notifications/Notifications";
import ProfileSettings from "./Pages/Settings/Profile/Profile";
import ArchivePage from "./Pages/ArchivePage/ArchivePage.js";

import FakePage from "./Pages/Fake/fake";
import FakePage2 from "./Pages/Fake/fake2";
import Documentation from "./Pages/Documentation/Documentation";

export const RouterComponent = ({ history }) => {
  return (
    <Switch>
      <Route exact path={documentation} component={Documentation} />
      <Route exact path={fake_page} component={FakePage} />
      <Route exact path={`${fake_page}/:id`} component={FakePage2} />

      <Route exact path={reports} component={Reports} />

      <Route exact path={startup_page} component={StartupSection} />

      <Route eaxct path={notifications_page} component={NotificationsPage} />

      {/* Dashboard */}
      <Route exact path={dashboard} component={Dashboard} />

      <Route exact path={settings} component={Settings} />
      <Route exact path={your_team} component={yourTeam} />
      <Route exact path={web_form} component={webForm} />
      <Route exact path={tags1} component={TagGroup} />
      <Route exact path={funnels1} component={Funnels1} />
      <Route exact path={notification} component={Notifications} />
      <Route exact path={setting_profile} component={ProfileSettings} />
      <Route eaxct path={news} component={News} />
      <Route eaxct path={`${news_view_one}/:id`} component={NewsViewOne} />
      <Route eaxct path={new_news} component={NewsEdit} />

      <Route eaxct path={`${edit_news}/:id`} component={NewsEdit} />
      <Route exact path={archive_page} component={ArchivePage} />

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

      <Route exact path={startup_company_profile} component={StartupInfo} />

      <Route exact path={`${group_dashboard}/:groupId`} component={GroupPage} />

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
