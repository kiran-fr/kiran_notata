import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Redirect, Switch, withRouter } from "react-router-dom";
import Route from "react-router/es/Route";

// API
import { Query } from "react-apollo";
import { userGet } from "../../Apollo/Queries";

// ROUTES
import {
  signup,
  dashboard,
  evaluation_new,
  evaluation_settings,
  viewCompanies,
  infoOverview,
  info_page_business,
  info_page_money,
  info_page_materials,
  info_page_info,
  info_edit_company_name,
  company_details,
  tagPage,
  tagCompleter,
  groups,
  reporting,
  profile,
  formsPage
} from "../../routes";

// Landing page / list
import { DashboardPage } from "./DashboardPage";

import { InfoOverview } from "./Pages/InfoPages/InfoOverview";
import InfoPageBusiness from "./Pages/InfoPages/PageBusiness";
import InfoPageMoney from "./Pages/InfoPages/PageMoney";
import InfoPageMaterials from "./Pages/InfoPages/PageMaterials";
import InfoPageInfo from "./Pages/InfoPages/PageInfo";
import InfoPageEditName from "./Pages/InfoPages/EditName";

import EvaluationOverview from "./Pages/EvaluationPages/EvaluationOverview";
import EvaluationOverview_each from "./Pages/EvaluationPages/EvaluationOverview_each";
import EvaluationSettings from "./Pages/EvaluationPages/EvaluationSettings";

import CompanyDetails from "./CompanyDetails/CompanyDetails";
import ViewCompanies from "./ViewCompanies/ViewCompanies";

import Profile from "./Profile_and_settings/Profile/Profile";
import TagPage from "./Profile_and_settings/TagPage/TagPage";
import FormsPage from "./Profile_and_settings/FormsPage/FormsPage";

import Reporting from "./Reporting/";


import { GhostLoader } from "../elements/GhostLoader";
import { container, inner_container } from "../elements/Style.module.css";




export const DashboardComponent = ({ history }) => {
  return (
    <div className={container}>
      <div className={inner_container}>
        <Switch>

          <Route exact path={profile} component={Profile} />

          <Route exact path={reporting} component={Reporting} />

          <Route exact path={tagPage} component={TagPage} />
          {
            // <Route exact path={formsPage} component={FormsPage} />
          }
          <Route exact path={dashboard} component={DashboardPage} />

          <Route exact path={infoOverview} component={InfoOverview} />
          <Route exact path={info_page_business} component={InfoPageBusiness} />
          <Route exact path={info_page_money} component={InfoPageMoney} />
          <Route
            exact
            path={info_page_materials}
            component={InfoPageMaterials}
          />
          <Route exact path={info_page_info} component={InfoPageInfo} />
          <Route
            exact
            path={info_edit_company_name}
            component={InfoPageEditName}
          />
          <Route
            exact
            path={evaluation_settings}
            component={EvaluationSettings}
          />
          <Route
            exact
            path={`${evaluation_new}/:id`}
            component={EvaluationOverview}
          />
          <Route
            exact
            path={`${evaluation_new}/:id/:sid`}
            component={EvaluationOverview_each}
          />
          <Route
            exact
            path={`${company_details}/:id`}
            component={CompanyDetails}
          />
          <Route exact path={viewCompanies} component={ViewCompanies} />
          <Route component={() => null} />
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
    return (
      <Redirect to={signup} />
    );
  }

  return (
    <Query query={userGet} fetchPolicy="cache-and-network">
      {({ data, loading, error }) => {
        if (loading) return <GhostLoader />;
        if (!loading && !error && data) {
          let user = data.userGet || {};
          if (user.email === null) {
            console.log('profile', profile)
            return (
              <Redirect to={profile} />
            )
          }
        }
        return <DashboardComponent {...props} />;
      }}
    </Query>
  );
};

export const DashboardRouter = withRouter(WrapperComponent);




