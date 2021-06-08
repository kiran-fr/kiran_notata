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
  // evaluation_templates,
  // evaluation_template,
  // evaluation_template_summary,
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
  // evaluation_template_new,
  // add_section,
  group_dashboard,
  // evaluation_template_new_dev,
  // evaluation_template_profile,
  // add_section_dev,
  reports,
  notifications_page,
  news,
  dashboard_new,
  news1,
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
} from "../definitions";

// Landing page / list
import StartupSection from "./NewDesign/Startup/StartupPage";

// import Dashboard from "./pages/Dashboard/DashboardPage";
import Charts from "./pages/Dashboard/Charts/ChartsPage";
import Profile from "./pages/Profile/Profile";
import Tags from "./pages/Tags";
import Funnels from "./pages/Funnels";
// import Settings from "./pages/Settings/Settings";
import Team from "./pages/Team/Team";
import StartupPage from "./pages/StartupPage/StartupPage";
import FactsPage from "./pages/StartupPage/Facts/Facts";
import UI_Components from "./pages/UI_Components";

// Evaluation templates

import FactsTemplates from "./pages/FactsTemplates/FactsTemplates/FactsTemplates";
import FactsTemplate from "./pages/FactsTemplates/FactsTemplate/FactsTemplate";
import EvaluationV2Page from "./pages/EvaluationV2/";
import EvaluationSummary from "./pages/EvaluationV2/Summary";

// Groups
// import Groups from "./pages/Groups/Groups";
import Group from "./pages/Groups/Group/Group";
import GroupConnection from "./pages/Groups/GroupConnection";
import GroupSettings from "./pages/Groups/GroupSettings";
// import Groups from "./shubham-new-designs/pages/groups/index";
import Groups from "./NewDesign/srv_startup/pages/GroupV2/index";
import GroupDashboard from "./NewDesign/srv_startup/pages/GroupV2/group-dashboard";
// import GroupDashboard from "./shubham-new-designs/pages/groups/group-dashboard";
import News1 from "./NewDesign/news/news";
import NewsViewOne from "./NewDesign/news/NewsViewOne";
import NewsEdit from "./NewDesign/news/news-edit";
// import NewsEdit from "./NewDesign/news/news-edit";

// Loader
import { GhostLoader } from "Components/elements";
import { ErrorBoundary } from "Components/ErrorBoundary";

// Styles
import { Header } from "Components/Header/Header";
import ExternalForm from "./pages/ExternalForm/ExternalForm";
import Navigation from "./pages/UI_Components/Navigation/Navigation";

// Shubham Imports
import { Startup } from "./shubham-new-designs/pages/startup/index";
import Reports from "./shubham-new-designs/pages/reports/reports";
import Settings_Home from "./shubham-new-designs/pages/settings/settings";
import News from "./shubham-new-designs/pages/news/news";
import DashboardNew from "./shubham-new-designs/pages/dashboard/dashboard";

// New Startup Info
import { StartupPage as StartupInfo } from "./NewDesign/srv_startup/pages/StartupPage/index";
import { Reports as ReportsAdd } from "./NewDesign/srv_startup/pages/reports/reports";
import Dashboard from "./NewDesign/srv_startup/pages/dashboard/dashboard";

// import EvaluationTemplates from "./pages/Templates/EvaluationTemplates/EvaluationTemplates";
// import EvaluationTemplate from "./pages/Templates/EvaluationTemplate/EvaluationTemplate";
// import EvaluationTemplateSection from "./pages/Templates/EvaluationTemplateSection";
// import EvaluationTemplateSummary from "./pages/Templates/EvaluationTemplateSummary/EvaluationTemplateSummary";

import { EvaluationTemplatesPage } from "./NewDesign/srv_startup/pages/EvaluationTemplates/EvaluationTemplatesPage/EvaluationTemplatesPage";
import { EvaluationTemplatePage } from "./NewDesign/srv_startup/pages/EvaluationTemplates/EvaluationTemplatePage/EvaluationTemplatePage";
import { EvaluationTemplateSectionPage } from "./NewDesign/srv_startup/pages/EvaluationTemplates/EvaluationTemplateSectionPage/EvaluationTemplateSectionPage";

// New Jørgen import
import NotificationsPage from "./NewDesign/Notifications/notifications";
// import { SectionPage } from "./NewDesign/srv_startup/pages/EvaluationTemplates/EvaluationTemplateSectionPage/EvaluatimplateSectionPage";

//settings
import Settings from "./NewDesign/settings/settings";
import yourTeam from "./NewDesign/settings/your-team";
import webForm from "./NewDesign/settings/web-form";
import TagGroup from "./NewDesign/settings/tags";
import Funnels1 from "./NewDesign/settings/funnels";
import Notifications from "./NewDesign/settings/notifications";
import ProfileSettings from "./NewDesign/settings/profile";

import ArchivePage from "./NewDesign/ArchivePage/ArchivePage";

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
      <Route exact path={your_team} component={yourTeam} />
      <Route exact path={web_form} component={webForm} />
      <Route exact path={tags1} component={TagGroup} />
      <Route exact path={funnels1} component={Funnels1} />
      <Route exact path={notification} component={Notifications} />
      <Route exact path={setting_profile} component={ProfileSettings} />

      <Route exact path={facts_templates} component={FactsTemplates} />

      <Route exact path={`${facts_template}/:id`} component={FactsTemplate} />

      <Route exact path={news1} component={News1} />
      <Route exact path={`${news_view_one}/:id`} component={NewsViewOne} />
      <Route exact path={new_news} component={NewsEdit} />
      <Route exact path={`${edit_news}/:id`} component={NewsEdit} />

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

      {/*<Route*/}
      {/*  exact*/}
      {/*  path={`${evaluation_template_profile}/:id/:sectionId`}*/}
      {/*  component={EvaluationTemplatesPage}*/}
      {/*/>*/}
      {/*<Route exact path={add_section_dev} component={EvaluationTemplatesPage} />*/}
      {/*<Route exact path={add_section} component={AddSection} />*/}

      {/*<Route*/}
      {/*  exact*/}
      {/*  path={evaluation_template_new}*/}
      {/*  component={ElevationTemplates}*/}
      {/*/>*/}

      {/*<Route*/}
      {/*  exact*/}
      {/*  path={evaluation_template_new_dev}*/}
      {/*  component={ElevationTemplatesPage}*/}
      {/*/>      */}

      {/*<Route*/}
      {/*  exact*/}
      {/*  path={`${evaluation_template_summary}/:templateId`}*/}
      {/*  component={EvaluationTemplateSummary}*/}
      {/*/>*/}

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

      {/*<Route*/}
      {/*  exact*/}
      {/*  path={`${evaluation_template_profile}/:id`}*/}
      {/*  component={EvaluationTemplatesPage}*/}
      {/*/>*/}

      <Route eaxct path={reports} component={Reports} />
      {/* <Route eaxct path={settings_new} component={Settings_Home} /> */}
      <Route eaxct path={news} component={News} />

      {/* <Route
        eaxct
        path={`${startup_page}/settings`}
        component={Settings}
      /> */}
      <Route eaxct path={dashboard_new} component={DashboardNew} />
      <Route
        eaxct
        path={`${startup_page}/components/company/dashboard`}
        component={Dashboard}
      />

      <Route
        eaxct
        path={`${startup_page}/report/reports`}
        component={ReportsAdd}
      />

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
