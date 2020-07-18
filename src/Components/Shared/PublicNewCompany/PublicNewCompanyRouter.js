import React from "react";
import classnames from 'classnames';
import { Redirect, Switch, withRouter } from "react-router-dom";
import Route from "react-router/es/Route";
import {
  public_new_company,
  public_new_company_page_business,
  public_new_company_page_money,
  public_new_company_page_materials,
  public_new_company_page_info,
  public_edit_company_name
} from "../../../routes";

import {
  container,
  small_container,
  center_container,
  inner_container
} from '../../elements/Style.module.css';

import OverviewPage from './Pages/Overview';
import PageBusiness from './Pages/PageBusiness';
import PageMoney from './Pages/PageMoney';
import PageMaterials from './Pages/PageMaterials';
import PageInfo from './Pages/PageInfo';
import EditPageName from './Pages/EditPageName';


const DashboardComponent = ({history}) => {
  return (
    <div className={classnames(container)}>
      <div className={inner_container}>
        <Switch>
          <Route exact path={public_new_company} component={OverviewPage} />
          <Route exact path={public_new_company_page_business} component={PageBusiness} />
          <Route exact path={public_new_company_page_money} component={PageMoney} />
          <Route exact path={public_new_company_page_materials} component={PageMaterials} />
          <Route exact path={public_new_company_page_info} component={PageInfo} />
          <Route exact path={public_edit_company_name} component={EditPageName} />
        </Switch>
      </div>
    </div>
  );
};

export default withRouter(DashboardComponent);


