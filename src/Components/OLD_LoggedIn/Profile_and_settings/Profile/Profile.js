import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { Mutation, Query } from "react-apollo";
import { error_box } from "./Profile.module.css";
import { Auth } from "aws-amplify";

import {
  // getUser,
  // getTeam
  userGet
} from "../../../../Apollo/Queries";
import {
  userUpdate,
  // putTeam
} from "../../../../Apollo/Mutations";
import validateEmail from "../../../../utils/validateEmail";
import validatePhoneNumber from "../../../../utils/validatePhoneNumber";

import {
  viewCompanies,
  evaluation_settings,
  tagPage,
  formsPage
  // termPage
} from "../../../../routes";
import {
  container,
  small_container,
  center_container,
  inner_container,
  button_class
} from "../../../elements/Style.module.css";

import { member_of_team, member_of_team_new } from "./Profile.module.css";


class VerifyPhoneNumber extends Component {
  constructor(props) {
    super(props)
    this.state = {
      verification_code: "",
      error: false,
      resend: false,
      loading: false
    }
  }

  render() {
    return (
      <div style={{
          marginTop: "50px",
          marginBottom: "50px",
          borderBottom: "1px solid rgb(238, 238, 238)",
          paddingBottom: "30px"
        }}>
        <form onSubmit={e => {
          e.preventDefault();
          if (this.state.loading) return;
          this.setState({loading: true})
          Auth.verifyCurrentUserAttributeSubmit('phone_number', this.state.verification_code)
            .then(() => {
              this.props.confirmed()
              this.setState({loading: false})
            })
            .catch(error => this.setState({error, loading: false}) )

        }}>
          <div>
            <h1>Please verify your phone number</h1>

            {
              this.state.error && (
                <div style={{color: "#c80000"}}>
                  Something went wrong. Try again, or get a new code.
                </div>
              )
            }

            <input
              placeholder="Verification code"
              type="text"
              value={this.state.verification_code}
              onChange={e => {
                this.setState({verification_code: e.target.value})
              }}
            />




            <div style={{marginTop: "20px"}}>
              <input type="submit" value="Send" />
              {
                this.state.loading && <i className="fa fa-spinner fa-spin" />
              }
            </div>


            { !this.state.resend && (
                <div
                  style={{
                    textAlign: "right",
                    color: "blue",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    Auth
                      .verifyCurrentUserAttribute('phone_number')
                      .then(() => this.setState({resend: true}) )
                      .catch(() => { })
                  }}
                  >
                  Get a new code
                </div>
              )
            }

            {
              this.state.resend && (
                <div>
                  Code has been sent you your phone
                </div>
              )
            }

          </div>
        </form>
      </div>

    )
  }
}


// class TeamSection extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { val: "" };
//   }

//   render() {
//     const submit = e => {
//       e.preventDefault();
//     };

//     return (
//       <Query query={getTeam} fetchPolicy="cache-and-network">
//         {queryProps => {
//           let team = queryProps.data && queryProps.data.getTeam;
//           let { id, members, pending, is_pending } = team || {};

//           return (
//             <form onSubmit={submit}>
//               <div style={{ marginTop: "120px" }}>
//                 <h1>Your team</h1>

//                 {(members && members.length && (
//                   <div>
//                     <div>members</div>
//                     <Mutation mutation={putTeam}>
//                       {(mutate, { data, loading, error }) => (
//                         <div>
//                           {members.map((member, i) => (
//                             <div
//                               style={{ marginBottom: "10px" }}
//                               key={`input-${i}`}
//                               className={member_of_team}
//                             >
//                               <input disabled type="text" value={member} />

//                               {loading && (
//                                 <i className="fa fa-spinner fa-spin" />
//                               )}

//                               {!loading && !is_pending && (
//                                 <i
//                                   className="fas fa-minus-circle"
//                                   onClick={() => {
//                                     let variables = { id, delete_user: member };
//                                     mutate({
//                                       variables,
//                                       refetchQueries: [{ query: getTeam }]
//                                     });
//                                   }}
//                                 />
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </Mutation>
//                   </div>
//                 )) || <span />}

//                 {(pending && pending.length && (
//                   <div>
//                     <div>pending invitations</div>
//                     <Mutation mutation={putTeam}>
//                       {(mutate, { data, loading, error }) => (
//                         <div>
//                           {pending.map((member, i) => (
//                             <div
//                               style={{ marginBottom: "10px" }}
//                               key={`input-${i}`}
//                               className={member_of_team}
//                             >
//                               <input disabled type="text" value={member} />

//                               {loading && (
//                                 <i className="fa fa-spinner fa-spin" />
//                               )}

//                               {!loading && !is_pending && (
//                                 <i
//                                   className="fas fa-minus-circle"
//                                   onClick={() => {
//                                     let variables = { id, delete_user: member };
//                                     mutate({
//                                       variables,
//                                       refetchQueries: [{ query: getTeam }]
//                                     });
//                                   }}
//                                 />
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </Mutation>
//                   </div>
//                 )) || <span />}

//                 {!is_pending && (
//                   <div
//                     style={{ marginBottom: "10px" }}
//                     className={member_of_team_new}
//                   >
//                     <input
//                       placeholder="Invite new team member (email)"
//                       type="text"
//                       value={this.state.val}
//                       onChange={e => {
//                         this.setState({ val: e.target.value });
//                       }}
//                     />

//                     {
//                       <Mutation mutation={putTeam}>
//                         {(mutate, { data, loading, error }) => {
//                           if (loading && !this.state.loading) {
//                             this.setState({ loading: true });
//                           }

//                           if (loading) {
//                             return <i className="fa fa-spinner fa-spin" />;
//                           }

//                           if (this.state.loading && !loading) {
//                             this.setState({ loading: false, val: "" });
//                           }

//                           return (
//                             <span>
//                               {validateEmail(this.state.val) && (
//                                 <i
//                                   className="fas fa-plus-circle"
//                                   onClick={() => {
//                                     let variables = {};
//                                     if (id) variables.id = id;
//                                     variables.invite_email = this.state.val.toLowerCase();
//                                     mutate({
//                                       variables,
//                                       refetchQueries: [{ query: getTeam }]
//                                     });
//                                   }}
//                                 />
//                               )}
//                             </span>
//                           );
//                         }}
//                       </Mutation>
//                     }
//                   </div>
//                 )}

//                 {is_pending && (
//                   <Mutation mutation={putTeam}>
//                     {(mutate, { data, loading, error }) => {
//                       return (
//                         <div
//                           className={button_class}
//                           style={{
//                             maxWidth: "626px",
//                             marginLeft: "auto",
//                             marginRight: "auto"
//                           }}
//                           onClick={() => {
//                             let variables = {
//                               id: this.state.id,
//                               accept_user: "ACCEPT"
//                             };
//                             mutate({ variables });
//                           }}
//                         >
//                           <span>Accepit team invitation</span>
//                           {loading && <i className="fa fa-spinner fa-spin" />}
//                         </div>
//                       );
//                     }}
//                   </Mutation>
//                 )}
//               </div>
//             </form>
//           );
//         }}
//       </Query>
//     );
//   }
// }

class ProfileComp extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      email: "",
      given_name: "",
      family_name: "",
      phone_number: "",
      company: "",
      error: false,
      loading: false,
      MFA: undefined,
      cognitoUser: undefined,
      verification_code: ""
    };

    let userData;
    if (this.props.queryProps && this.props.queryProps.data.userGet) {
      userData = this.props.queryProps.data.userGet;
    }
    if (userData) this.state = { ...userData, gotUser: !!userData.email };

  }



  componentDidMount() {
    Auth
      .currentAuthenticatedUser()
      .then(cognitoUser => {
        Auth.userAttributes(cognitoUser).then(userAttributes => {
          let ua = {}
          for (let attrib of userAttributes) {
            ua[attrib.Name] = attrib.Value;
          }
          this.setState({...ua})
        });     

        Auth.getPreferredMFA(cognitoUser).then((MFA) => {
          this.setState(oldState => ({
            email: oldState.email || cognitoUser.attributes.email,
            cognitoUser, MFA
          }));
        })
      })
  }  

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps !== this.props) {
  //     if (!nextProps.queryProps.loading && !nextProps.queryProps.error) {
  //       let user = nextProps.queryProps.data.getUser;
  //       let nonNullUserAttributes = Object.keys(user).reduce((obj, key) => {
  //         if (user[key] !== null) obj[key] = user[key];
  //         return obj;
  //       }, {});
  //       this.setState({ ...nonNullUserAttributes, gotUser: !!user.email });
  //     }
  //   }
  // }

  render() {
    const { updateUser, data } = this.props;

    // if (data && data.putUser && this.state.gotUser) {
    //   // return <Redirect to={viewCompanies} />;
    // }

    const submit = async e => {

      e.preventDefault();

      let input = {};
      if (this.state.given_name) {
        input.given_name = this.state.given_name.trim();
      }
      if (this.state.family_name) {
        input.family_name = this.state.family_name.trim();
      }
      if (this.state.phone_number) {
        input.phone_number = this.state.phone_number.trim();
      }

      try {
        await Auth.updateUserAttributes(this.state.cognitoUser, input);
        let userAttributes = await Auth.userAttributes(this.state.cognitoUser);
        let ua = {}
        for (let attrib of userAttributes) { ua[attrib.Name] = attrib.Value; }
        this.setState({...ua})
      } catch (error) {
        console.log('error', error)
      }
      
      if (this.state.email) {
        input.email = this.state.email.trim().toLowerCase();
      }

      console.log('input', input)

      updateUser({
        variables: { input }
        // , refetchQueries: [{ query: getUser }]
      });

    };

    const setData = data => {
      this.setState({
        ...data,
        error: false
      });
    };


    let userExists = !!((this.props.queryProps.data || {}).userGet || {})
      .cognitoIdentityId;

    return (
      <div className={classnames(container, center_container, small_container)}>
        <div className={inner_container}>
          

          <form onSubmit={submit}>
            <div>
              <h1>Who are you?</h1>

              <div style={{ marginBottom: "50px", display: "none" }}>
                <input
                  placeholder="email"
                  type="text"
                  value={this.state.email}
                />
              </div>

              <div style={{ marginBottom: "50px" }}>
                <input
                  placeholder="Given name"
                  type="text"
                  value={this.state.given_name}
                  onChange={e => setData({ given_name: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: "50px" }}>
                <input
                  placeholder="Family name"
                  type="text"
                  value={this.state.family_name}
                  onChange={e => setData({ family_name: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: "50px" }}>

                <div>
                  <input
                    placeholder="Phone number"
                    type="text"
                    value={this.state.phone_number}
                    onChange={e => setData({ phone_number: e.target.value })}
                  />
                </div>

              </div>

              <div style={{ marginBottom: "50px" }}>
                <input
                  placeholder="Company"
                  type="text"
                  value={this.state.company}
                  onChange={e => setData({ company: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: "50px", opacity: 0.3 }}>
                <input
                  placeholder="Email"
                  type="text"
                  value={this.state.email}
                  disabled
                />
              </div>

              <div>
                <input type="submit" value="Save" />
                {this.props.loading && <i className="fa fa-spinner fa-spin" />}
              </div>

              {this.state.error && (
                <div className={error_box}>{this.state.error}</div>
              )}
            </div>
          </form>

          {
            this.state.phone_number &&
            this.state.phone_number_verified === "false" && (
              <VerifyPhoneNumber
                confirmed={() => {
                  this.setState({phone_number_verified: "true"})                  
                }}
              />
            )
          }


          {
            this.state.email && (
              <Link
                to={viewCompanies}
                className={button_class}
                style={{
                  maxWidth: "626px",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                Go to dashboard
              </Link>
            )
          }

          {
            this.state.phone_number &&
            this.state.phone_number_verified === "true" && (
              <div style={{marginTop: '50px', marginBottom: '50px'}}>
                <form onSubmit={e => {
                  e.preventDefault()
                }}
                >
                <h1>
                  Phone number is verified
                </h1>
                  <label>
                    <input
                      type="checkbox"
                      checked={this.state.MFA === "SMS_MFA"}
                      onChange={e => {
                        let MFA = this.state.MFA === "SMS_MFA" ? "NOMFA" : "SMS";
                        Auth.setPreferredMFA(this.state.cognitoUser, MFA);
                        if (MFA === "SMS") MFA = "SMS_MFA";
                        this.setState({MFA})
                      }}
                    />
                    Enable SMS for two factor security when logging in.
                  </label>
                </form>
              </div>
            )
          }        

          {userExists && (
            <div
              style={{
                borderTop: "1px solid #eee",
                marginTop: "35px",
                paddingTop: "35px"
              }}
            >
              <Link
                to={evaluation_settings}
                className={button_class}
                style={{
                  maxWidth: "626px",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                <span>Evaluation settings</span>
                <i className="fal fa-cog" />
              </Link>

              <Link
                to={tagPage}
                className={button_class}
                style={{
                  maxWidth: "626px",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                <span>Manage tags</span>
                <i className="fas fa-tag" />
              </Link>


              <Link
                to={formsPage}
                className={button_class}
                style={{
                  maxWidth: "626px",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                <span>Input forms</span>
                <i className="fas fa-align-left" />
              </Link>




            </div>
          )}
          {
            // userExists && <TeamSection />
          }
        </div>
      </div>
    );
  }
}


class Profile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {

    console.log('profile...')


    return (
      <Query query={userGet} fetchPolicy="cache-and-network">
        {({ ...queryProps }) => {
          return (
            <Mutation mutation={userUpdate}>
              {(mutation, { data, error, loading }) => (
                <ProfileComp
                  updateUser={mutation}
                  error={error}
                  loading={loading}
                  data={data}
                  queryProps={queryProps}
                />
              )}
            </Mutation>
          );
        }}
      </Query>      
    )
  }

}

export default Profile;

