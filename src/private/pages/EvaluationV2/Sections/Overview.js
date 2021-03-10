import React from "react";
import { Card, BreadCrumbs, Table, Button, Content } from "Components/elements";
import { startup_page } from "definitions.js";

export const Overview = ({
  connection,
  evaluationTemplate,
  history,
  match,
}) => {
  const columns = [
    {
      title: "InfoSection name",
      dataIndex: "id",
      key: "name",
      render: id => {
        let sections = evaluationTemplate.sections || [];
        let section = sections.find(s => s.id === id) || {};
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
            size="small"
            onClick={() => {
              let path = `${match.url}?section=${sectionId}`;
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
            val: `Startup: ${connection?.creative?.name}`,
            link: `${startup_page}/${connection?.id}`,
          },
        ]}
      />
      <Content maxWidth={600}>
        <div className="form_h1">{evaluationTemplate?.name}</div>
        <div className="form_p1">{evaluationTemplate?.description}</div>
        <Card style={{ paddingTop: "5px", marginBottom: "20px" }}>
          <Table
            dataSource={evaluationTemplate?.sections || []}
            columns={columns}
            pagination={false}
            disableHead={true}
          />
        </Card>

        {/*<div className="text-right">*/}
        {/*  <Button*/}
        {/*    type="right_arrow"*/}
        {/*    onClick={() => {*/}
        {/*      let path = `${startup_page}/${connection.id}/evaluation/${evaluation.id}/summary`;*/}
        {/*      history.push(path);*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Go to summary*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </Content>
    </div>
  );
};
