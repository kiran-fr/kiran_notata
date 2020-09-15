import React, { useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";

import { connectionGet, evaluationTemplateGet } from "../../../Apollo/Queries";

import { startup_page } from "../../definitions";

import {
  Card,
  BreadCrumbs,
  Table,
  Button,
  Content,
  GhostLoader,
} from "../../../Components/elements";

export default function Evaluation({ match, history }) {
  const { connectionId, evaluationId } = match.params;
  const connectionQuery = useQuery(connectionGet, {
    variables: { id: connectionId },
  });
  const connection = (connectionQuery.data || {}).connectionGet || {};

  const [getEvaluationTemplateData, evaluationTemplateQuery] = useLazyQuery(
    evaluationTemplateGet
  );

  useEffect(() => {
    if (connection.evaluations) {
      const evaluation = connection.evaluations.find(
        ({ id }) => id === evaluationId
      );

      if (evaluation) {
        getEvaluationTemplateData({
          variables: { id: evaluation.templateId },
        });
      }
    }
  }, [connection.evaluations, evaluationId, getEvaluationTemplateData]);

  const evaluationTemplate =
    (evaluationTemplateQuery.data || {}).evaluationTemplateGet || {};

  const error = connectionQuery.error || evaluationTemplateQuery.error;
  const loading = connectionQuery.loading || evaluationTemplateQuery.loading;

  if (loading) {
    return <GhostLoader />;
  }

  if (error) {
    console.log("error", error);
    return <p>We are updating</p>;
  }

  const evaluation =
    (connection.evaluations || []).find(({ id }) => id === evaluationId) || [];

  const columns = [
    {
      title: "Section name",
      dataIndex: "id",
      key: "name",
      render: id => {
        let section =
          (evaluationTemplate.sections || []).find(s => s.id === id) || {};
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
            //type="tiny_right"
            size="small"
            onClick={() => {
              let path = `${startup_page}/${connectionId}/evaluation/${evaluation.id}/section/${sectionId}`;
              history.push(path);
            }}
          >
            go
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <BreadCrumbs
        list={[
          {
            val: `Startup: ${(connection.creative || {}).name}`,
            link: `${startup_page}/${connectionId}`,
          },
        ]}
      />
      <Content maxWidth={600}>
        <div className="form_h1">{evaluation.name}</div>
        <div className="form_p1">{evaluation.description}</div>
        <Card style={{ paddingTop: "5px", marginBottom: "20px" }}>
          <Table
            dataSource={evaluationTemplate.sections || []}
            columns={columns}
            pagination={false}
            loading={evaluationTemplateQuery.loading}
            diableHead={true}
          />
        </Card>

        <div style={{ textAlign: "right" }}>
          <Button
            type="right_arrow"
            onClick={() => {
              let path = `${startup_page}/${connection.id}/evaluation/${evaluation.id}/summary`;
              history.push(path);
            }}
          >
            Go to summary
          </Button>
        </div>
      </Content>
    </div>
  );
}
