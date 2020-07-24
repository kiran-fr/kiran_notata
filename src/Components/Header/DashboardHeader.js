import React from "react";
import { Auth } from "aws-amplify";
import { Link, Redirect } from "react-router-dom";
import { Query } from "@apollo/client/react/components";
import { userGet } from "../../Apollo/Queries";
import { profile, signOut, reporting, dashboard } from "../../routes";

import {
  container,
  left_side,
  right_side,
  title_class,
  email_class,
  icons
} from "./Header.module.css";

export class DashboardHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: false
    };
  }

  render() {
    return (
      <Query query={userGet} fetchPolicy="cache-and-network">
        {({ data, loading, error }) => {
          let email;

          let have_profile;

          if (!loading && !error && data) {
            let user = data.userGet || {};
            have_profile = user.email !== null;
          }

          return (
            <div className={container}>
              <div className={left_side}>
                <div className={title_class}>notata.io</div>

                {have_profile && (
                  <div className={icons}>
                    <Link to={reporting}>
                      <i className="fal fa-chart-bar" />
                    </Link>

                    <Link to={dashboard}>
                      <i className="fal fa-list-alt" />
                    </Link>
                  </div>
                )}
              </div>

              <div className={right_side}>
                <div className={icons}>
                  {have_profile && (
                    <Link to={profile}>
                      <i className="fal fa-user-alt" />
                    </Link>
                  )}

                  <Link to={signOut}>
                    <i className="fal fa-sign-out-alt" />
                  </Link>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}
