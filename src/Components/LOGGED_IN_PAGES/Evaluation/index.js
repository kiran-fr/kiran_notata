import React, { useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";

import { connectionGet, evaluationTemplateGet } from "../../../Apollo/Queries";

import { startup_page } from "../../../routes";

import {
  Card,
  BreadCrumbs,
  GhostLoader,
  Table,
  Button,
  Content,
} from "../../elements/";

export default function Evaluation({ match, history }) {
  const {
    data: connectionGetData,
    loading: connectionGetLoading,
    error: connectionGetError,
  } = useQuery(connectionGet, {
    variables: { id: match.params.connectionId },
  });

  const [
    getData,
    {
      data: evaluationTemplateGetData,
      loading: evaluationTemplateGetLoading,
      error: evaluationTemplateGetError,
      called,
    },
  ] = useLazyQuery(evaluationTemplateGet);

  useEffect(() => {
    if (connectionGetData) {
      const evaluation = connectionGetData.connectionGet.evaluations.find(
        ({ id }) => id === match.params.evaluationId
      );

      getData({
        variables: {
          id: evaluation.templateId,
        },
      });
    }
  }, [connectionGetData]);

  if (
    (!connectionGetData && connectionGetLoading) ||
    !called ||
    (!evaluationTemplateGetData && evaluationTemplateGetLoading)
  ) {
    return <GhostLoader />;
  }

  if (connectionGetError || evaluationTemplateGetError) {
    console.log(connectionGetError);
    console.log(evaluationTemplateGetError);

    return <p>We are updating</p>;
  }

  const evaluation = connectionGetData.connectionGet.evaluations.find(
    ({ id }) => id === match.params.evaluationId
  );

  const columns = [
    {
      title: "Section name",
      dataIndex: "id",
      key: "name",
      render: id => {
        let section =
          (evaluationTemplateGetData.evaluationTemplateGet.sections || []).find(
            s => s.id === id
          ) || {};
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
              let path = `${startup_page}/${match.params.connectionId}/evaluation/${evaluation.id}/section/${sectionId}`;
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
      <Content maxWidth={600}>
        <h1>{evaluation.name}</h1>
        <h3>{evaluation.description}</h3>
        <Card maxWidth={1200}>
          <Table
            dataSource={
              evaluationTemplateGetData.evaluationTemplateGet.sections || []
            }
            columns={columns}
            pagination={false}
            loading={evaluationTemplateGetLoading}
            diableHead={true}
          />
        </Card>
      </Content>
    </div>
  );
}
