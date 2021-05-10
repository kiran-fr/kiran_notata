import React from "react";

// import Sharings from "./Sharings";
// import Invitations from "./Invitations";
// import { History } from "history";

import { Content } from "Components/elements";
import Connections from "./Connections";

export default function StartupSection({ history }) {
  return (
    <Content maxWidth={1400}>
      <Connections history={history} />
    </Content>
  );
}
