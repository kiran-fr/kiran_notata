import React from "react";

import { Content } from "Components/elements";

import { Kanban } from "./Kanban";
import Navigation from "../EvaluationV2/Navigation";

export const KanbanPage = () => {
  return (
    <>
      {/*<Navigation />*/}
      <Navigation />
      <Content maxWidth={1300}>
        <Kanban />
      </Content>
    </>
  );
};
