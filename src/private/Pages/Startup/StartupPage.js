import React from "react";

// COMPONENT 
import { Content } from "Components/elements";
import Connections from "./Connections";

export default function StartupSection({ history }) {
  return (
    <Content maxWidth={1400}>
      <Connections history={history} />
    </Content>
  );
}
