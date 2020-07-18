import React from "react";
import { Query, Mutation } from "react-apollo";
import qp from "../../../../utils/queryParams";
import { getOrganization } from "../../../../Apollo/Queries";
import { updateOrganization } from "../../../../Apollo/Mutations";

import {
  infoOverview,
  info_page_business,
  info_page_money,
  info_page_materials,
  info_page_info
} from "../../../../routes";
import dd from "./combinedData";
import { PageComp } from "../PageComp";

export class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: null };
  }

  componentDidMount() {
    let { id } = qp(window.location.search);
    this.setState({
      id: id[0],
      routeMap: {
        Business: info_page_business,
        Money: info_page_money,
        Materials: info_page_materials,
        Info: info_page_info
      }
    });
  }

  render() {
    if (!this.state.id) return <span />;

    return (
      <Query
        query={getOrganization}
        variables={{ id: this.state.id }}
        fetchPolicy="cache-and-network"
      >
        {({ data, error, loading }) => {
          if (error) console.error("GraphQL error", error);
          return (
            <Mutation mutation={updateOrganization}>
              {(mutate, mRes) => {
                return (
                  <PageComp
                    id={this.state.id}
                    qData={(data || {}).getOrganization}
                    loading={loading || mRes.loading}
                    routeMap={this.state.routeMap}
                    overviewPage={infoOverview}
                    mutation={({ variables }) => {
                      mutate({
                        variables,
                        optimisticResponse: {
                          __typename: "Mutation",
                          updateOrganization: {
                            ...data.getOrganization,
                            ...variables.input
                          }
                        }
                      });
                    }}
                    search={`?id=${this.state.id}`}
                    dd={dd}
                    {...this.props}
                  />
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default Page;
