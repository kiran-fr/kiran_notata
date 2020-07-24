import React from "react";

// RESOURCES
import moment from "moment";

// API
import { Query, Mutation } from "@apollo/client/react/components";
import { adopt } from "react-adopt";
import { connectionsGet, userGet } from "../../../Apollo/Queries";

// COMPONENTS
import ConnectionCard from "./ConnectionCard";
import { GhostLoader } from "../../elements/GhostLoader";

// STYLES
import classnames from "classnames";

import {
  standard_form,
  shady_list,
  shady_list_item,
  shady_list_byLine,
  shady_list_name,
  shady_list_open_close
} from "../../elements/Style.module.css";

class Connections extends React.Component {
  state = {
    openConnecion: this.props.createdConnection
  };

  render() {
    let { connections, user } = this.props;

    return (
      <div className={shady_list}>
        {connections
          .slice()
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((connection, i) => {
            return (
              <div
                key={`connection-${connection.id}`}
                className={shady_list_item}
              >
                <div className={shady_list_byLine}>
                  <div>
                    <span>{moment(connection.createdAt).format("ll")} - </span>
                    <span>{connection.createdByUser.given_name} </span>
                    <span>{connection.createdByUser.family_name}</span>
                  </div>
                </div>
                <div className={shady_list_name}>
                  <div
                    className={shady_list_open_close}
                    onClick={() => {
                      this.setState({
                        openConnecion:
                          this.state.openConnecion === connection.id
                            ? null
                            : connection.id
                      });
                    }}
                  >
                    {(this.state.openConnecion === connection.id && (
                      <span style={{ left: "-5px", position: "relative" }}>
                        <i className="fas fa-caret-down" />
                      </span>
                    )) || <i className="fas fa-caret-right" />}
                  </div>

                  {connection.creative.name}
                </div>

                {this.state.openConnecion === connection.id && (
                  <ConnectionCard id={connection.id} user={user} />
                )}
              </div>
            );
          })}
      </div>
    );
  }
}

const ComposedComponent = ({ createdConnection }) => {
  const Composed = adopt({
    userQuery: ({ render }) => <Query query={userGet}>{render}</Query>,
    connectionsQuery: ({ render }) => (
      <Query query={connectionsGet}>{render}</Query>
    )
  });

  return (
    <Composed>
      {({ connectionsQuery, userQuery }) => {
        const loading = connectionsQuery.loading || userQuery.loading;
        const error = connectionsQuery.error || userQuery.error;

        if (error) console.log("error", error);
        if (loading) return <GhostLoader />;
        if (error) return <div>We are updating </div>;

        const connections = connectionsQuery.data.connectionsGet;
        const user = userQuery.data.userGet;

        return (
          <Connections
            connections={connections || []}
            user={user}
            createdConnection={createdConnection}
          />
        );
      }}
    </Composed>
  );
};

export default ComposedComponent;
