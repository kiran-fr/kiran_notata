import React from "react";
import { useQuery } from "@apollo/client";

import { Card, Content, BreadCrumbs, GhostLoader } from "../../elements";

import {
  evaluationTemplateSectionGet,
  connectionGet,
} from "../../../Apollo/Queries";

import { startup_page } from "../../../routes";
import GeneralInput from "./GeneralInput";

export default function Section({ match }) {
  const {
    data: connectionGetData,
    loading: connectionGetLoading,
    error: connectionGetError,
  } = useQuery(connectionGet, {
    variables: { id: match.params.connectionId },
  });

  const {
    data: evaluationTemplateSectionGetData,
    loading: evaluationTemplateSectionGetLoading,
    error: evaluationTemplateSectionGetError,
  } = useQuery(evaluationTemplateSectionGet, {
    variables: { id: match.params.sectionId },
  });

  if (
    (!connectionGetData && connectionGetLoading) ||
    (!evaluationTemplateSectionGetData && evaluationTemplateSectionGetLoading)
  ) {
    return <GhostLoader />;
  }

  if (connectionGetError || evaluationTemplateSectionGetError) {
    console.log(connectionGetError);
    console.log(evaluationTemplateSectionGetError);

    return <p>We are updating</p>;
  }

  const evaluation = connectionGetData.connectionGet.evaluations.find(
    ({ id }) => id === match.params.evaluationId
  );

  return (
    <div>
      <BreadCrumbs
        list={[
          {
            val: `Startup: ${connectionGetData.connectionGet.creative.name}`,
            link: `${startup_page}/${match.params.connectionId}`,
          },
          {
            val: `Template: ${evaluation.name}`,
            link: `${startup_page}/${match.params.connectionId}/evaluation/${evaluation.id}`,
          },
        ]}
      />
      <Content maxWidth={600}>
        <h1>
          {evaluationTemplateSectionGetData.evaluationTemplateSectionGet.name}
        </h1>
        <p>
          {
            evaluationTemplateSectionGetData.evaluationTemplateSectionGet
              .description
          }
        </p>

        {(
          evaluationTemplateSectionGetData.evaluationTemplateSectionGet
            .questions || []
        ).map((question, i) => (
          <Card key={`question-${i}-${question.id}`}>
            <GeneralInput
              section={
                evaluationTemplateSectionGetData.evaluationTemplateSectionGet
              }
              question={question}
              templateId={evaluation.templateId}
              evaluation={evaluation}
            />
          </Card>
        ))}
      </Content>
    </div>
  );
}
