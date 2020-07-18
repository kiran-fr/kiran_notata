import React from "react";
import { Query, Mutation } from "react-apollo";
import qp from "../../../../utils/queryParams";
import { GhostLoader } from "../../../elements/GhostLoader";
import { public_getOrganization } from "../../../../Apollo/Queries";
import { public_updateOrganization } from "../../../../Apollo/Mutations";
import {
  public_new_company,
  public_new_company_page_business,
  public_new_company_page_money,
  public_new_company_page_materials,
  public_new_company_page_info
} from "../../../../routes";
import dd from "./combinedData";
import { error_box } from "../../../elements/Style.module.css";
import { PageComp } from "../../../LoggedIn/Pages/PageComp";

export class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgId: null,
      email: null
    };
  }

  componentDidMount() {
    let { orgId, email } = qp(window.location.search);
    this.setState({
      orgId: orgId[0],
      email: email[0],
      routeMap: {
        Business: public_new_company_page_business,
        Money: public_new_company_page_money,
        Materials: public_new_company_page_materials,
        Info: public_new_company_page_info
      }
    });
  }

  render() {
    if (!this.state.orgId) return <span />;
    return (
      <Query
        query={public_getOrganization}
        variables={{ id: this.state.orgId, email: this.state.email }}
        fetchPolicy="cache-and-network"
      >
        {({ data, error, loading }) => {
          if (error) {
            return (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "96px" }}>💥</div>
                <div className={error_box}>
                  Ooops. Seems like something went wrong...
                </div>
              </div>
            );
          }

          return (
            <Mutation mutation={public_updateOrganization}>
              {(mutate, mRes) => (
                <PageComp
                  id={this.state.orgId}
                  qData={(data || {}).public_getOrganization}
                  loading={loading || mRes.loading}
                  routeMap={this.state.routeMap}
                  search={`?orgId=${this.state.orgId}&email=${this.state.email}`}
                  overviewPage={public_new_company}
                  mutation={m => {
                    let variables = {
                      input: m.variables.input,
                      email: this.state.email,
                      id: this.state.orgId
                    };
                    mutate({
                      variables,
                      optimisticResponse: {
                        __typename: "Mutation",
                        public_updateOrganization: {
                          ...data.public_getOrganization,
                          ...variables.input
                        }
                      }
                    });
                  }}
                  dd={dd}
                  {...this.props}
                />
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default Page;
