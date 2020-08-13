import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import classnames from "classnames";
import { Link } from "react-router-dom";
import {
  evaluationTemplatesGet,
  connectionGet,
} from "../../../../Apollo/Queries";
import { evaluationPut } from "../../../../Apollo/Mutations";
import { startup_page } from "../../../../routes";
import { getPossibleScore, getScore } from "../../Evaluation/util";
import { Button, Table, Modal } from "../../../elements";

import {
  container,
  each_template_style,
  each_style,
  header_style,
  name_style,
  score_style,
  body_style,
  footer_style,
} from "./EvaluationBox.module.css";

function EvaluationList({ evaluations, connectionId, templates }) {
  return (
    <div className={container}>
      {evaluations.map(evaluation => {
        const template = templates.find(
          ({ id }) => id === evaluation.templateId
        );

        const sections = template && [...template.sections];

        return (
          <div
            key={`evaluation-${evaluation.id}`}
            className={each_template_style}
          >
            {/*HEADER*/}
            <div className={header_style}>
              <div className={name_style}>
                {evaluation.name}{" "}
                <Link
                  to={`${startup_page}/${connectionId}/evaluation/${evaluation.id}`}
                >
                  (edit)
                </Link>
              </div>
              <div className={classnames(score_style, "desktop_only")}>
                {moment(evaluation.createdAt).format("ll")}
              </div>
            </div>

            {template && (
              <>
                <div className={body_style}>
                  {sections.map(({ name, questions, id }) => (
                    <div key={id} className={each_style}>
                      <div className={name_style}>{name}</div>

                      <div className={score_style}>
                        {getScore(questions, evaluation.answers)}/
                        {getPossibleScore(questions)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={footer_style}>
                  <div className={name_style}>Total</div>

                  <div className={score_style}>
                    {template.sections.reduce(
                      (acc, { questions }) =>
                        acc + getScore(questions, evaluation.answers),
                      0
                    )}
                    /
                    {template.sections.reduce(
                      (acc, { questions }) => acc + getPossibleScore(questions),
                      0
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// function EvaluationList({ evaluations, connectionId, templates }) {

//   console.log('evaluations', evaluations)

//   return <div/>

//   const tableColumns = evaluations.map(evaluation => (

//     [{
//       title: evaluation.name,
//       // dataIndex:
//     }]

//   ))

//   const columns = [
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//       render: email => <span>{email}</span>,
//     },

//     {
//       title: "",
//       dataIndex: "email",
//       key: "delete",
//       width: 20,
//       // className: delete_bucket,
//       render: email => {
//       },
//     },
//   ];

//   return (
//     <Table
//       dataSource={evaluations}
//       columns={columns}
//       diableHead={true}
//       pagination={false}
//     />
//   );

// }

export function EvaluationBox({ connection, user, history }) {
  const [showModal, setShowModal] = useState(false);
  const evaluationTemplatesQuery = useQuery(evaluationTemplatesGet);
  let templates = [];
  if (!evaluationTemplatesQuery.loading) {
    templates =
      evaluationTemplatesQuery.data.accountGet.evaluationTemplates || [];
  }

  const [
    mutate,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(evaluationPut);

  const evaluations = (connection || {}).evaluations || [];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: name => <span>{name}</span>,
    },
    {
      title: "",
      key: "use",
      width: 30,
      render: ({ id: templateId, name, description }) => {
        return (
          <Button
            size="small"
            onClick={async () => {
              try {
                let res = await mutate({
                  variables: {
                    connectionId: connection.id,
                    input: { templateId, name, description },
                  },
                });
                let evaluationId = res.data.evaluationPut.id;
                let path = `${startup_page}/${connection.id}/evaluation/${evaluationId}`;
                history.push(path);
              } catch (error) {
                return console.log("error", error);
              }
            }}
          >
            use
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ paddingBottom: "15px" }}>
      {!evaluations.length && (
        <div>
          <div style={{ fontSize: "18px" }}>Evaluate this startup</div>
          <div
            style={{ padding: "20px 0px", color: "var(--color-gray-medium)" }}
          >
            Evaluate this startup based on your own criterias. You can score
            your evaluations, and compare simiar companies.
          </div>
        </div>
      )}

      <EvaluationList
        evaluations={evaluations}
        connectionId={connection.id}
        templates={templates}
      />

      <div
        style={{
          marginTop: "15px",
          textAlign: "right",
        }}
      >
        <Button type="just_text" onClick={() => setShowModal(true)}>
          Evaluate
        </Button>
      </div>

      {showModal && (
        <Modal
          title="Evaluate startup"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <div style={{ padding: "10px 0px 0px 8px" }}>
            <Table
              dataSource={templates}
              columns={columns}
              diableHead={true}
              pagination={false}
            />
          </div>

          <div
            style={{
              position: "relative",
              paddingTop: "20px",
            }}
          >
            <Button
              buttonStyle="secondary"
              size="medium"
              onClick={() => setShowModal(false)}
            >
              cancel
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
