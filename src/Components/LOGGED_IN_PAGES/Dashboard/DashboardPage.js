import React from "react";

// RESOURCES
import moment from "moment";

// API
import { Query, Mutation } from "react-apollo";
import { adopt } from "react-adopt";
import {
  accountGet,
  userGet
} from "../../../Apollo/Queries";
import {
  creativePut,
  connectionPut
} from "../../../Apollo/Mutations";

// COMPONENTS
import { GhostLoader } from "../../elements/GhostLoader";
import Connections from "./Connections";

// STYLES
import classnames from "classnames";

import {
  standard_form
} from "../../elements/Style.module.css";





class NewCreative extends React.Component {

  state = { value: '' }

  render() {

    return (
      <Mutation mutation={creativePut}>
      {(mutate, { data, error, loading }) => (
        <div>

          <form
            className={standard_form}
            onSubmit={e => {
              e.preventDefault();
              if (!this.state.value.length) return;
              let variables = {
                input: { name: this.state.value }
              }
              mutate({variables})
            }}
            >
            <input
              type="text"
              placeholde="Dollar Press Ltd."
              value={this.state.value}
              onChange={e => this.setState({value: e.target.value})}
            />

            <div>
              <input type="submit" value="Save" />
              {loading && <i className="fa fa-spinner fa-spin" />}
            </div>

          </form>
        </div>
      )}
      </Mutation>
    )
  }
}


const Creatives = ({creatives}) => {
  return (
    <div>
      <Mutation mutation={connectionPut}>
        {(mutate, { data, error, loading }) => {
          return (
            <div>
              {
                creatives.map((creative, i) => {
                  return (
                    <div
                      key={`creative-${creative.id}`}
                      >
                      <div>
                        <span>{creative.name} </span>
                        {
                          // !connections.some(c => c.creativeId === creative.id) && (
                            <span
                              onClick={() => {
                                let variables = { creativeId: creative.id }
                                mutate({variables})
                              }}
                              >
                              (evaluate)
                            </span>
                          // )
                        }
                      </div>
                    </div>
                  )
                })
              }
            </div>
        )}}
      </Mutation>
      <NewCreative />
    </div> 
  )
}


class DashboardPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      openConnecion: null
    }
  }

  render() {
    
    const { user } = this.props;
    const {
      connections,
      creatives
    } = this.props.data;

    let noData = (!creatives || !creatives.length) && (!connections || connections.length);

    return (
      <content>


        {
          noData && (
            <div>
              <div>Ain't nothing here...</div>
            </div>
          )
        }

        {
          <Creatives creatives={creatives} user={user} />
        }
        
        <Connections user={user} />

      </content>
    )
  }

}



const ComposedComponent = () => {

  const Composed = adopt({
    accountQuery: ({ render }) => (
      <Query query={accountGet}>{render}</Query>
    ),
    userQuery: ({ render }) => (
      <Query query={userGet}>{render}</Query>
    ),    
  });

  return (
    <Composed>
      {({accountQuery, userQuery}) => {
        const loading = accountQuery.loading || userQuery.loading;
        const error = accountQuery.error || userQuery.error;

        if (error) console.log("error", error);
        if (loading) return <GhostLoader />;
        if (error) return <div>We are updating </div>;

        const data = accountQuery.data.accountGet;
        const user = userQuery.data.userGet;

        return (
          <DashboardPage
            data={data}
            user={user}
          />
        );
      }}
    </Composed>
  );
};

export default ComposedComponent;




