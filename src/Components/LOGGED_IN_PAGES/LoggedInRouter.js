import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Redirect, Switch, withRouter } from "react-router-dom";
import Route from "react-router/es/Route";

// API
import { Query } from "@apollo/client/react/components";
import { userGet } from "../../Apollo/Queries";

// ROUTES
import {
  signup,
  dashboard,
  profile,
  evaluation_templates,
  evaluation_template,
  team_management
} from "../../routes";

// Landing page / list
import DashboardPage from "./Dashboard/DashboardPage";

// Evaluation templates
import EvaluationTemplates from "./Profile_and_settings/EvaluationTemplates/EvaluationTemplates";
import EvaluationTemplate from "./Profile_and_settings/EvaluationTemplate/EvaluationTemplate";
import EvaluationTemplateSection from "./Profile_and_settings/EvaluationTemplateSection/";

// Team Management
import TeamManagement from "./Profile_and_settings/TeamManagement/TeamManagement";

// Loader
import { GhostLoader } from "../elements/GhostLoader";

// Styles
import { container, inner_container } from "../elements/Style.module.css";

export const RouterComponent = ({ history }) => {
  return (
    <div className={container}>
      <div className={inner_container}>
        <Switch>
          <Route exact path={dashboard} component={DashboardPage} />
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

          <Route exact path={team_management} component={TeamManagement} />

          <Route render={() => <div>404</div>} />
        </Switch>
      </div>
    </div>
  );
};

const WrapperComponent = ({ ...props }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(undefined);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setUserLoggedIn(true))
      .catch(() => setUserLoggedIn(false));
  }, []);

  if (userLoggedIn === false) {
    return <Redirect to={signup} />;
  }

  return (
    <Query query={userGet} fetchPolicy="cache-and-network">
      {({ data, loading, error }) => {
        if (loading) return <GhostLoader />;
        if (!loading && !error && data) {
          let user = data.userGet || {};
          if (user.email === null) {
            return <Redirect to={profile} />;
          }
        }
        return <RouterComponent {...props} />;
      }}
    </Query>
  );
};

export const LoggedInRouter = withRouter(WrapperComponent);
