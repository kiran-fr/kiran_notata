import React, { Component } from "react";

// REACT STUFF
import { Auth } from "aws-amplify";
import { Redirect, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

// API STUFF
import { adopt } from "react-adopt";
// import { Mutation, Query } from "@apollo/client/react/components";
import { useQuery, useMutation } from "@apollo/client";

import { accountGet, userGet } from "../../../Apollo/Queries";
import { userUpdate } from "../../../Apollo/Mutations";
import {
  dashboard,
  evaluation_templates,
  team_management
} from "../../../routes";

// STYLES
import classnames from "classnames";

// COMPONENTS
// import { error_box } from "./Profile.module.css";
// import TeamManagementComp from "./TeamManagement";

// UTILITIES
import validateEmail from "../../../utils/validateEmail";
import validatePhoneNumber from "../../../utils/validatePhoneNumber";

import { Content } from "../../elements/NotataComponents/";

// STYLES
// import {
//   container,
//   small_container,
//   center_container,
//   inner_container,
//   button_class,
//   standard_form
// } from "../../../elements/Style.module.css";

// import { sub_header } from "./Profile.module.css";

// class VerifyPhoneNumberComp extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       verification_code: "",
//       error: false,
//       resend: false,
//       loading: false
//     };
//   }

//   render() {
//     return (
//       <div
//         style={{
//           marginTop: "50px",
//           marginBottom: "50px",
//           borderBottom: "1px solid rgb(238, 238, 238)",
//           paddingBottom: "30px"
//         }}
//       >
//         <form
//           onSubmit={e => {
//             e.preventDefault();
//             if (this.state.loading) return;
//             this.setState({ loading: true });
//             Auth.verifyCurrentUserAttributeSubmit(
//               "phone_number",
//               this.state.verification_code
//             )
//               .then(() => {
//                 this.props.confirmed();
//                 this.setState({ loading: false });
//               })
//               .catch(error => this.setState({ error, loading: false }));
//           }}
//         >
//           <div>
//             <div className={sub_header}>Please verify your phone number</div>

//             {this.state.error && (
//               <div style={{ color: "#c80000" }}>
//                 Something went wrong. Try again, or get a new code.
//               </div>
//             )}

//             <input
//               placeholder="Verification code"
//               type="text"
//               value={this.state.verification_code}
//               onChange={e => {
//                 this.setState({ verification_code: e.target.value });
//               }}
//             />

//             <div style={{ marginTop: "20px" }}>
//               <input type="submit" value="Send" />
//               {this.state.loading && <i className="fa fa-spinner fa-spin" />}
//             </div>

//             {!this.state.resend && (
//               <div
//                 style={{
//                   textAlign: "right",
//                   color: "blue",
//                   cursor: "pointer"
//                 }}
//                 onClick={() => {
//                   Auth.verifyCurrentUserAttribute("phone_number")
//                     .then(() => this.setState({ resend: true }))
//                     .catch(() => {});
//                 }}
//               >
//                 Get a new code
//               </div>
//             )}

//             {this.state.resend && <div>Code has been sent you your phone</div>}
//           </div>
//         </form>
//       </div>
//     );
//   }
// }

// class ProfileComp extends Component {

//   constructor(props, context) {
//     super(props, context);
//     this.state = {
//       email: "",
//       given_name: "",
//       family_name: "",
//       phone_number: "",
//       error: false,
//       loading: false,
//       MFA: undefined,
//       cognitoUser: undefined,
//       verification_code: ""
//     };
//   }

//   componentDidMount() {

//     Auth.currentAuthenticatedUser().then(cognitoUser => {
//       Auth.userAttributes(cognitoUser).then(userAttributes => {
//         let ua = {};
//         for (let attrib of userAttributes) {
//           ua[attrib.Name] = attrib.Value;
//         }
//         this.setState({ ...ua });
//       });

//       Auth.getPreferredMFA(cognitoUser).then(MFA => {
//         this.setState(oldState => ({
//           email: oldState.email || cognitoUser.attributes.email,
//           cognitoUser,
//           MFA
//         }));
//       });
//     });

//   }

//   componentWillUpdate(newProps) {
//     if (newProps !== this.props) {
//       // Got user data after mutataion
//       if (newProps.data) {
//         this.setState({ gotUser: true });
//       }

//       let userData;
//       if (newProps.queryProps && newProps.queryProps.data.userGet) {
//         userData = newProps.queryProps.data.userGet;
//       }

//       // Got user data after query
//       if (userData && userData.email) {
//         this.setState({ gotUser: true });
//       }
//     }
//   }

//   render() {
//     const { updateUser, data } = this.props;

//     const submit = async e => {
//       e.preventDefault();

//       let input = {};
//       if (this.state.given_name) {
//         input.given_name = this.state.given_name.trim();
//       }
//       if (this.state.family_name) {
//         input.family_name = this.state.family_name.trim();
//       }
//       if (this.state.phone_number) {
//         input.phone_number = this.state.phone_number.trim();
//       }

//       if (!this.state.gotUser) {
//         input.email = this.state.email;
//       }

//       try {
//         await Auth.updateUserAttributes(this.state.cognitoUser, input);
//         let userAttributes = await Auth.userAttributes(this.state.cognitoUser);
//         let ua = {};
//         for (let attrib of userAttributes) {
//           ua[attrib.Name] = attrib.Value;
//         }
//         this.setState({ ...ua });
//       } catch (error) {
//         console.log("error", error);
//       }

//       updateUser({ variables: { input } });
//     };

//     const setData = data => {
//       this.setState({
//         ...data,
//         error: false
//       });
//     };

//     let userExists = !!((this.props.queryProps.data || {}).userGet || {})
//       .cognitoIdentityId;

//     return (
//       <div>
//         <form onSubmit={submit} className={standard_form}>
//           <div>
//             <h1>Who are you?</h1>

//             <div style={{ marginBottom: "50px", opacity: 0.3 }}>
//               <input
//                 placeholder="Email"
//                 type="text"
//                 value={this.state.email}
//                 disabled
//               />
//             </div>

//             <div style={{ marginBottom: "50px", display: "none" }}>
//               <input placeholder="email" type="text" value={this.state.email} />
//             </div>

//             <div style={{ marginBottom: "50px" }}>
//               <input
//                 placeholder="Given name"
//                 type="text"
//                 value={this.state.given_name}
//                 onChange={e => setData({ given_name: e.target.value })}
//               />
//             </div>

//             <div style={{ marginBottom: "50px" }}>
//               <input
//                 placeholder="Family name"
//                 type="text"
//                 value={this.state.family_name}
//                 onChange={e => setData({ family_name: e.target.value })}
//               />
//             </div>

//             <div>
//               <input type="submit" value="Save" />
//               {this.props.loading && <i className="fa fa-spinner fa-spin" />}
//             </div>

//             {this.state.error && (
//               <div className={error_box}>{this.state.error}</div>
//             )}
//           </div>
//         </form>

//         {this.state.gotUser && (
//           <div
//             style={{
//               // marginTop: '10px'
//               borderTop: "1px solid #999",
//               paddingTop: "20px"
//             }}
//           >
//             <Link to={evaluation_templates} className={button_class}>
//               Evaluation templates
//             </Link>

//             <Link to={team_management} className={button_class}>
//               Manage team
//             </Link>

//             <div
//               style={{
//                 width: "100%",
//                 textAlign: "right"
//               }}
//             >
//               <Link to={dashboard}>Go to dashboard</Link>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// }

// class Profile extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   render() {
//     return (
//       <Query query={userGet} fetchPolicy="cache-and-network">
//         {({ ...queryProps }) => {
//           return (
//             <Mutation mutation={userUpdate}>
//               {(mutation, { data, error, loading }) => (
//                 <ProfileComp
//                   updateUser={mutation}
//                   error={error}
//                   loading={loading}
//                   data={data}
//                   queryProps={queryProps}
//                 />
//               )}
//             </Mutation>
//           );
//         }}
//       </Query>
//     );
//   }
// }

export default function Profile() {
  const { data, loading, error } = useQuery(userGet);

  let user;
  if (!loading && !error && data) {
    user = data.userGet;
  }

  return (
    <Content maxWidth={1200}>
      <h1>Profile</h1>

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </Content>
  );
}

// const Comp = ({ ...props }) => {

//   const { data, loading, error } = useQuery(accountGet, {
//     notifyOnNetworkStatusChange: true
//   });

//   return (
//     <div className={classnames(container, center_container, small_container)}>
//       <div className={inner_container}>
//         <Profile {...props} />
//       </div>
//     </div>
//   );
// };

// export default Comp;
