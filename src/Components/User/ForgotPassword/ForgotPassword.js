import React from "react";
import { EnterUsername } from "./EnterUsername";
import { ConfirmUser } from "./ConfirmUser";

export class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: "enterUsername"
    };
  }

  render() {
    const { state } = this.state;
    const { location } = this.props;

    if (state === "enterUsername") {
      return (
        <EnterUsername
          location={location}
          done={email => {
            this.setState({
              email,
              state: "confirmEmail"
            });
          }}
        />
      );
    }
    if (state === "confirmEmail") {
      return <ConfirmUser email={this.state.email} />;
    }
    return null;
  }
}
