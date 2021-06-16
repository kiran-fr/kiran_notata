import React from "react";

// Components
import { Content } from "Components/elements";
import { Kanban } from "./Kanban";
import Navigation from "../EvaluationV2/Navigation";

// Export
export const KanbanPage = () => {
  return (
    <>
      <Navigation />
      <Content maxWidth={1300}>
        <Kanban />
      </Content>
    </>
  );
};
