import React from "react";
import { useQuery } from "@apollo/client";

import { connectionGet, evaluationTemplatesGet } from "../../../Apollo/Queries";

import { startup_page, evaluation_template } from "../../../routes";

import { Card, BreadCrumbs, GhostLoader, Table, Button } from "../../elements/";

export default function Evaluation({ match, history }) {
  const {
    data: connectionGetData,
    loading: connectionGetLoading,
    error: connectionGetError,
  } = useQuery(connectionGet, {
    variables: { id: match.params.connectionId },
  });

  const {
    data: evaluationTemplatesGetData,
    loading: evaluationTemplatesGetLoading,
    error: evaluationTemplatesGetError,
  } = useQuery(evaluationTemplatesGet);

  if (
    (!connectionGetData && connectionGetLoading) ||
    (!evaluationTemplatesGetData && evaluationTemplatesGetLoading)
  ) {
    return <GhostLoader />;
  }

  if (connectionGetError || evaluationTemplatesGetError) {
    console.log(connectionGetError);
    console.log(evaluationTemplatesGetError);

    return <p>We are updating</p>;
  }

  const evaluation = connectionGetData.connectionGet.evaluations.find(
    ({ id }) => id === match.params.evaluationId
  );
  const template = evaluationTemplatesGetData.accountGet.evaluationTemplates.find(
    ({ name }) => name === evaluation.name
  );

  const columns = [
    {
      title: "Section name",
      dataIndex: "id",
      key: "name",
      render: id => {
        let section = (template.sections || []).find(s => s.id === id) || {};
        let questions = section.questions || [];

        let possibleScore = 0;
        for (let q of questions) {
          if (q.inputType === "TRAFFIC_LIGHTS") {
            possibleScore += 2;
          }

          if (q.inputType === "RADIO") {
            let max = Math.max.apply(
              Math,
              q.options.map(o => o.score || 0)
            );
            possibleScore += max;
          }

          if (q.inputType === "CHECK") {
            for (let o of q.options) {
              possibleScore += o.score;
            }
          }
        }

        return (
          <div>
            <div>{section.name}</div>
            <div style={{ opacity: 0.5, fontSize: "12px" }}>
              {questions.length} questions - {possibleScore} points
            </div>
          </div>
        );
      },
    },

    {
      title: "",
      dataIndex: "id",
      key: "section_button",
      width: 30,
      render: sectionId => {
        return (
          <Button
            type="tiny_right"
            onClick={() => {
              let path = `${evaluation_template}/${template.id}/${sectionId}`;
              history.push(path);
            }}
          />
        );
      },
    },
  ];

  return (
    <div>
      <BreadCrumbs
        list={[
          {
            val: `Startup: ${connectionGetData.connectionGet.creative.name}`,
            link: `${startup_page}/${match.params.connectionId}`,
          },
        ]}
      />
      <div>
        <h1>{evaluation.name}</h1>
        <h3>{evaluation.description}</h3>
        <Card maxWidth={1200}>
          <Table
            dataSource={template.sections || []}
            columns={columns}
            pagination={false}
            loading={evaluationTemplatesGetLoading}
            diableHead={true}
          />
        </Card>
      </div>
    </div>
  );
}
