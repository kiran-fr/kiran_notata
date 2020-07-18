import React, { Component } from "react";

import validateEmail from "../../../../utils/validateEmail";

// REACT STUFF
import { Auth } from "aws-amplify";

// API STUFF
import { adopt } from "react-adopt";
import { Mutation, Query } from "react-apollo";
import {
  userGet,
  userInvitationsGet,
  accountGet,
  accountInvitationsGet
} from "../../../../Apollo/Queries";


import {
  accountInvite,
  userInvitationResponse
} from "../../../../Apollo/Mutations";



// COMPONENTS
import { GhostLoader } from "../../../elements/GhostLoader";

// STYLES
import classnames from "classnames";

import {
  container,
  small_container,
  center_container,
  inner_container,
  button_class,  
  standard_form,
  submit_button
} from "../../../elements/Style.module.css";

import {
  sub_header
} from "../Profile/Profile.module.css";

import {
  members_list,
  member_of_team,
  member_of_team_new,
  pending_invitation,
  submit_reject_buttons,
  reject_button,
  submit_reject_buttons_container
} from "./TeamManagement.module.css";

class Comp extends React.Component {

  state = { value: '' }

  render() {
    
    let {
      user,
      userInvitations,

      account,
      accountInvitations
    } = this.props;
    let { members } = account;

    let validEmail = validateEmail(this.state.value);

    return (
      <div>


        { /* YOUR EXTERNAL INVITATIONS */  }

        {
          !!userInvitations.length && (
            <Mutation mutation={userInvitationResponse}>
              {(mutate, { data, error, loading}) => {
                if (!error && !loading && data) {
                  window.location.reload()
                }
                return (
                  <div style={{marginTop: "50px"}}>
                    <h1>Team invitations</h1>
                    {
                      userInvitations.map((invitation, i) => {
                        let { given_name, family_name, email } = invitation.createdByUser;
                        return (
                          <div
                            key={`invitation-${invitation.email}`}
                          >
                            <div>You have been invited to a team by {`${given_name} ${family_name} (${email})`}!</div>

                            <div className={submit_reject_buttons_container}>
                              
                              <div
                                className={classnames(
                                  submit_button,
                                  submit_reject_buttons
                                )}
                                onClick={() => {

                                  if (window.confirm(
                                    'Are you sure you want to leave your current team?'
                                  )) { /* Do nothing */ } else { return; }

                                  let variables = {
                                    accountId: invitation.accountId,
                                    response: "ACCEPT"
                                  }
                                  mutate({variables})
                                }}
                                >
                                Accept
                              </div>

                              <div
                                className={classnames(
                                  submit_button,
                                  submit_reject_buttons,
                                  reject_button
                                )}
                                onClick={() => {
                                  let variables = {
                                    accountId: invitation.accountId,
                                    response: "REJECT"
                                  }
                                  mutate({variables})
                                }}
                                >
                                Reject
                              </div>

                            </div>

                          </div>
                        )
                      })
                    }
                  </div>
                )
              }}
            </Mutation>
          )
        }

        <div style={{marginTop: "50px"}}>

          <h1>Your team</h1>

          {
            members.length === 1 && (
              <div>
                You are currently the only member of this team.
              </div>
            )
          }

          {
            members.length !== 1 && (
              <div>
                <div className={sub_header}>
                  Team members
                </div>
                {
                  members.map((m, i) => (
                    <div
                      key={`team_member-${m.email}`}
                      className={member_of_team}
                    >
                      <span>
                        <span>{m.email}</span>
                        {m.email === user.email && <span> (you)</span>}
                      </span>

                      {
                        // m.email !== user.email && (
                        //   <i className="fas fa-minus-circle" />
                        // )
                      }

                    </div>
                  ))
                }
              </div>
            )
          }



          { /* ACCOUNT TEAM MANAGEMENT */ }

          <Mutation mutation={accountInvite}>
            {(mutate, { data, error, loading}) => {

              return (
                <div style={{marginTop: '50px'}}>

                  {
                    !!accountInvitations.length && (
                      <div className={sub_header}>
                        Pending invitations
                      </div>
                    )
                  }

                  <div className={members_list}>
                    {
                      accountInvitations.map((invitation, i) => (
                        <div
                          key={`invitation-${invitation.email}`}
                          className={member_of_team}
                          >
                          <span>{invitation.email}</span>

                          <i
                            className="fas fa-minus-circle"
                            onClick={() => {

                              if (window.confirm(
                                `Are you sure you want to delete the team invitation for ${invitation.email}`
                              )) { /* Do nothing */ } else { return; }

                              let variables = { email: invitation.email }
                              mutate({
                                variables,
                                update: (proxy, { data: { accountInvite } }) => {
                                  let data = proxy.readQuery({
                                    query: accountInvitationsGet
                                  })
                                  data.accountInvitationsGet = accountInvite
                                }
                              })
                            }}
                          />
                        </div>
                      ))
                    }
                  </div>

                  <form className={standard_form} onSubmit={e => {
                    e.preventDefault();
                    if (!validEmail) return;
                    let variables = { email: this.state.value }
                    mutate({
                      variables,
                      update: (proxy, { data: { accountInvite } }) => {
                        let data = proxy.readQuery({
                          query: accountInvitationsGet
                        })
                        data.accountInvitationsGet = accountInvite
                        this.setState({value: ''})
                      }
                    })
                    

                  }}>
                    <input
                      type="text"
                      placeholder="Invite to team (email)"
                      value={this.state.value}
                      onChange={e => this.setState({value: e.target.value})}
                    />
                    <div style={{marginTop: '10px'}}>
                      <input
                        style={{
                          opacity: validEmail ? 1 : 0.2,
                          cursor: validEmail ? "pointer" : "default"
                        }}
                        type="submit"
                        value="Invite"
                      />
                      {loading && <i className="fa fa-spinner fa-spin" />}
                    </div>

                  </form>

                </div>
              )
            }}
          </Mutation>


        </div>



      </div>
    )
  }
}


const ComposedComponent = ({id, user}) => {

  const Composed = adopt({
    userQuery: ({ render }) => (
      <Query query={userGet} >{render}</Query>
    ),
    userInvitationsQuery: ({ render }) => (
      <Query query={userInvitationsGet} >{render}</Query>
    ),        
    accountQuery: ({ render }) => (
      <Query query={accountGet} >{render}</Query>
    ),
    accountInvitationsQuery: ({ render }) => (
      <Query query={accountInvitationsGet} >{render}</Query>
    ),
  });

  return (
    <Composed>
      {({
        userQuery,
        userInvitationsQuery,
        accountQuery,
        accountInvitationsQuery
      }) => {

        const loading =
          userQuery.loading ||
          userInvitationsQuery.loading ||
          accountQuery.loading ||
          accountInvitationsQuery.loading;

        const error =
          userQuery.error ||
          userInvitationsQuery.error ||
          accountQuery.error ||
          accountInvitationsQuery.error;

        if (error) return <div>We're updating</div>

        if (loading) return <GhostLoader />

        const user = userQuery.data.userGet;          
        const userInvitations = userInvitationsQuery.data.userInvitationsGet;

        const account = accountQuery.data.accountGet;
        const accountInvitations = accountInvitationsQuery.data.accountInvitationsGet;

        return (
          <div
            className={
              classnames(
                container,
                center_container,
                small_container
              )
            }>
            <div className={inner_container}>
            <Comp
              user={user}
              userInvitations={userInvitations || []}
              account={account}
              accountInvitations={accountInvitations || []}
            />
            </div>
          </div>
        )

      }}
    </Composed>
  );
};

export default ComposedComponent




