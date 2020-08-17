import React, { useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { Card, Content, BreadCrumbs, Button } from "../../elements";

import {
  evaluationTemplateGet,
  evaluationTemplateSectionGet,
  connectionGet,
} from "../../../Apollo/Queries";

import GeneralInput from "./GeneralInput";
import { startup_page } from "../../../routes";

function Navigation({ connection, evaluationId, sectionId, history }) {
  // Get all sections of evaluation template,
  // so that we can navigate to next section.
  // TODO: make a leaner query for this.
  const [getEvaluationTemplateData, evaluationTemplateQuery] = useLazyQuery(
    evaluationTemplateGet
  );

  useEffect(() => {
    if (connection.evaluations.length) {
      const evaluation = connection.evaluations.find(
        ({ id }) => id === evaluationId
      );
      getEvaluationTemplateData({
        variables: { id: evaluation.templateId },
      });
    }
  }, [connection.evaluations]);
  const evaluationTemplate =
    (evaluationTemplateQuery.data || {}).evaluationTemplateGet || {};

  const sections = evaluationTemplate.sections || [];

  let currentIndex = sections.map(s => s.id).indexOf(sectionId);

  if (currentIndex === sections.length - 1) return <span />;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Link
        to={`${startup_page}/${connection.id}/evaluation/${evaluationId}/summary`}
      >
        Go to summary
      </Link>

      {(currentIndex !== sections.length - 1 && (
        <Button
          type="right_arrow"
          onClick={() => {
            let path = `${startup_page}/${
              connection.id
            }/evaluation/${evaluationId}/section/${
              sections[currentIndex + 1].id
            }`;
            history.push(path);
          }}
        >
          {sections[currentIndex + 1].name}
        </Button>
      )) || <span />}
    </div>
  );
}

export default function Section({ match, history }) {
  const { connectionId, sectionId, evaluationId } = match.params;

  // Get connection
  const connectionQuery = useQuery(connectionGet, {
    variables: { id: connectionId },
  });

  const connection = (connectionQuery.data || {}).connectionGet || {
    creative: {},
    evaluations: [],
  };

  // Get evaluation template section
  const evaluationTemplateSectionQuery = useQuery(
    evaluationTemplateSectionGet,
    {
      variables: { id: sectionId },
    }
  );

  const evaluationTemplateSection =
    (evaluationTemplateSectionQuery.data || {}).evaluationTemplateSectionGet ||
    {};

  // Define loading & error
  const loading =
    connectionQuery.loading || evaluationTemplateSectionQuery.loading;
  const error = connectionQuery.error || evaluationTemplateSectionQuery.error;

  if (loading) {
    return null;
  }

  if (error) {
    console.log(error);
    return <p>We are updating</p>;
  }

  // Filter out current evaluation
  const evaluation = connection.evaluations.find(
    ({ id }) => id === evaluationId
  ) || { answers: [] };

  return (
    <div>
      <BreadCrumbs
        list={[
          {
            val: `Startup: ${connection.creative.name}`,
            link: `${startup_page}/${connectionId}`,
          },
          {
            val: `Template: ${evaluation.name}`,
            link: `${startup_page}/${connectionId}/evaluation/${evaluation.id}`,
          },
        ]}
      />
      <Content maxWidth={600}>
        <div className="form_h1">{evaluationTemplateSection.name}</div>
        <div className="form_p1">{evaluationTemplateSection.description}</div>

        {(evaluationTemplateSection.questions || []).map((question, i) => (
          <Card
            key={`question-${i}-${question.id}`}
            style={{ marginBottom: "10px" }}
          >
            <GeneralInput
              section={evaluationTemplateSection}
              question={question}
              templateId={evaluation.templateId}
              evaluation={evaluation}
              connectionId={connectionId}
            />
          </Card>
        ))}

        <Navigation
          connection={connection}
          sectionId={sectionId}
          evaluationId={evaluationId}
          history={history}
        />
      </Content>
    </div>
  );
}
