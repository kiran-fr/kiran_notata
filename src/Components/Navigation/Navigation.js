import React from "react";

import { SideBarMenu } from "Components/UI_Kits";
import { TopMenu } from "Components/UI_Kits";

export default function Navigation({ history }) {
  return (
    <React.Fragment>
      <SideBarMenu />
      <div>
        <TopMenu history={history} />
      </div>
    </React.Fragment>
  );
}
