import React from "react";

import { Content, SuccessBox } from "../../elements/";

export const Awaiting = () => {
  return (
    <Content center maxWidth={600}>
      <SuccessBox title="We have sent you an email 🚀">
        To be able to log in you have to verify your identity by clicking the
        link in the email.
      </SuccessBox>
    </Content>
  );
};
