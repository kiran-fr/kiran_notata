import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userLoggedIn } from "../../../Modules/user";
import { getUserIsLoggedIn } from "../../../Modules";
import { useForm } from "react-hook-form";
import { dashboard, awaiting, login } from "../../../pages/definitions";
import { Content, Card, Button, ErrorBox } from "../../elements/";

function SignupComp({ history, location, userLoggedIn, userIsLoggedIn }) {
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  if (userIsLoggedIn) {
    history.push(location.state || dashboard);
  }

  function onSubmit(data) {
    let { email, password } = data;

    email = email.toLowerCase().trim();

    setIsLoading(true);
    Auth.signUp({
      username: email,
      password,
      attributes: { email },
    })
      .then(res => {
        console.log("res", res);
        let path = `${awaiting}?=awaitingConfirm=true&email=${encodeURIComponent(
          email
        )}`;
        history.push(path);
        setIsLoading(false);
      })
      .catch(error => {
        console.log("error", error);
        setErrorMessage("Hmmm.... something went wrong...");
        setIsLoading(false);
      });
  }

  return (
    <Content maxWidth={600} center>
      <h1>Sign up</h1>
      <Card style={{ paddingBottom: "20px" }}>
        <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
          <div>
            <label for="email">Email</label>
            <input
              type="text"
              placeholder="email"
              ref={register({ required: true })}
              name="email"
              id="email"
            />

            <label for="password">Password</label>
            <input
              type="password"
              placeholder="password"
              ref={register({ required: true })}
              name="password"
              id="password"
            />
          </div>

          <div style={{ textAlign: "right" }}>
            <Button
              type="input"
              value="Sign up"
              loading={isSubmitting || isLoading}
            />
          </div>
        </form>

        <div
          style={{
            position: "absolute",
            fontSize: "12px",
            bottom: "-23px",
            left: "2px",
          }}
        >
          <Link to={login}>Already have an account?</Link>
        </div>
      </Card>

      {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
    </Content>
  );
}

export const Signup = connect(
  state => ({
    userIsLoggedIn: getUserIsLoggedIn(state),
  }),
  {
    userLoggedIn,
  }
)(SignupComp);

// export const Signup = withRouter(
//   class SignupComp extends Component {
//     constructor(props, context) {
//       super(props, context);

//       this.state = {
//         email: "",
//         password: "",
//         passwordRepeat: "",
//         error: false,
//         passordOK: false,
//         loading: false,
//         done: false
//       };
//     }

//     componentDidMount() {
//       const search = this.props.location.search;
//       const params = new URLSearchParams(search);

//       let email = params.get("email");

//       let dataFromUrl = {};
//       if (email) dataFromUrl.email = email;

//       this.setState(dataFromUrl);
//     }

//     render() {
//       const { location } = this.props;

//       if (this.state.done) {
//         return (
//           <Redirect
//             to={{
//               pathname: awaiting,
//               search: `awaitingConfirm=true&email=${encodeURIComponent(
//                 this.state.doneUsername
//               )}`,
//               state: location.state
//             }}
//           />
//         );
//       }

//       const submit = e => {
//         e.preventDefault();

//         if (this.state.password === "") {
//           return this.setState({
//             error: "signup.password.requirederror"
//           });
//         }

//         if (this.state.password.length < 8) {
//           return this.setState({
//             error: "signup.password.min8characterserror"
//           });
//         }

//         if (
//           this.state.password.length >= 8 &&
//           this.state.passwordRepeat === ""
//         ) {
//           return this.setState({
//             error: "signup.repeatpassword.requirederror"
//           });
//         }

//         if (this.state.password !== this.state.passwordRepeat) {
//           return this.setState({
//             error: "signup.password.repeatpassword.doesnotmatcherror"
//           });
//         }

//         // if (!this.state.termsChecked) {
//         //   return this.setState({
//         //     error: "signup.terms.requirederror",
//         //   });
//         // }

//         this.setState({
//           loading: true
//         });

//         const email = this.state.email.trim().toLowerCase();
//         const password = this.state.password;

//         // const firstName = this.state.firstName.trim();
//         // const lastName = this.state.lastName.trim();

//         Auth.signUp({
//           username: email,
//           password,
//           attributes: { email }
//         })
//           .then(data => {
//             this.setState({
//               loading: false,
//               done: true,
//               doneUsername: data.user.username
//             });
//           })
//           .catch(err => {
//             this.setState({
//               error: err.message,
//               loading: false
//             });
//           });
//       };

//       const setData = data => {
//         this.setState({
//           ...data,
//           error: false
//         });
//       };

//       return (
//         <div
//           className={classnames(container, small_container, center_container)}
//         >
//           <div className={inner_container}>
//             <form onSubmit={submit} className={standard_form}>
//               <div>
//                 <h1>Create new account</h1>

//                 <div style={{ marginBottom: "20px" }}>
//                   <input
//                     placeholder="email"
//                     type="text"
//                     value={this.state.email}
//                     onChange={e => {
//                       setData({ email: e.target.value });
//                     }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: "20px" }}>
//                   <input
//                     placeholder="password"
//                     type="password"
//                     value={this.state.password}
//                     onChange={e => setData({ password: e.target.value })}
//                   />
//                 </div>

//                 <div style={{ marginBottom: "50px" }}>
//                   <input
//                     placeholder="repeat password"
//                     type="password"
//                     value={this.state.passwordRepeat}
//                     onChange={e => setData({ passwordRepeat: e.target.value })}
//                   />
//                 </div>

//                 {this.state.error && (
//                   <div className={error_box}>{this.state.error}</div>
//                 )}

//                 <div>
//                   <input type="submit" value="Create account" />
//                   {this.state.loading && (
//                     <i className="fa fa-spinner fa-spin" />
//                   )}
//                 </div>

//                 <div>
//                   <div>
//                     <a href="/login">Log in</a>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       );
//     }
//   }
// );
