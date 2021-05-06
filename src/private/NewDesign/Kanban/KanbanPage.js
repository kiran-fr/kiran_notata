import React from "react";

import { Content } from "Components/elements";

import Navigation from "../../pages/UI_Components/Navigation/Navigation";
import { Kanban } from "./Kanban";

export const KanbanPage = () => {
  return (
    <>
      <Navigation></Navigation>
      <Content maxWidth={1300}>
        <Kanban></Kanban>
      </Content>
    </>
  );
};
