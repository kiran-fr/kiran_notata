import React from "react";
import { Auth } from "aws-amplify";
import { Content, SuccessBox } from "../../elements/";

export class SignOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signOut: false,
      signOutError: false,
    };
  }

  componentDidMount() {
    Auth.signOut()
      .then(() => {
        this.setState({ signOut: true });
      })
      .catch(() => {
        this.setState({ signOutError: true });
      });
  }

  render() {
    return (
      <Content center maxWidth={600}>
        <SuccessBox title="Bye bye 😭">You have been logged out!</SuccessBox>

        <div style={{ textAlign: "right" }}>
          <a href="/login">Log in</a>
        </div>
      </Content>
    );
  }
}
