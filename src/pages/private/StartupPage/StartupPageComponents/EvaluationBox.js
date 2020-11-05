import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import classnames from "classnames";
import { Link } from "react-router-dom";

import { evaluationTemplatesGet } from "Apollo/Queries";
import { evaluationPut } from "Apollo/Mutations";
import { startup_page, group as group_route } from "pages/definitions";
import { getPossibleScore, getScore } from "../../Evaluation/util";
import { Button, Table, Modal } from "Components/elements";

import {
  container,
  each_template_style,
  each_style,
  header_style,
  name_style,
  score_style,
  body_style,
  footer_style,
  meta_style,
  caret_button,
  title_container,
  from_group,
} from "./EvaluationBox.module.css";

function EvaluationSummary({
  evaluation,
  connectionId,
  sharedItem,
  noEdit,
  history,
}) {
  let [showList, setShowList] = useState(false);

  return (
    <div key={`evaluation-${evaluation.id}`} className={each_template_style}>
      {/*HEADER*/}
      <div className={header_style}>
        <div>
          <div className={classnames(meta_style)}>
            <span>
              By {evaluation.createdByUser.given_name}{" "}
              {evaluation.createdByUser.family_name} @{" "}
            </span>
            <span>{moment(evaluation.createdAt).format("ll")}</span>
          </div>

          {sharedItem && (
            <div className={from_group}>
              From group:{" "}
              <span
                onClick={() => {
                  let path = `${group_route}/${sharedItem.groupId}`;
                  history.push(path);
                }}
              >
                {sharedItem.groupName}
              </span>
            </div>
          )}

          <div className={classnames(name_style, title_container)}>
            <div
              className={caret_button}
              onClick={() => setShowList(!showList)}
            >
              {(showList && <i className="fas fa-caret-down" />) || (
                <i className="fas fa-caret-right" />
              )}
            </div>
            {evaluation.summary.templateName}{" "}
            {!noEdit && evaluation.summary.sections[0] && (
              <Link
                to={`${startup_page}/${connectionId}/evaluation/${evaluation.id}/section/${evaluation.summary.sections[0].id}`}
              >
                (edit)
              </Link>
            )}
          </div>
        </div>

        <div className={score_style}>
          {evaluation.summary.totalScore}/{evaluation.summary.possibleScore}
        </div>
      </div>

      {showList && (
        <div className={body_style}>
          {evaluation.summary.sections.map(
            ({ name, score, possibleScore }, i) => (
              <div key={i} className={each_style}>
                <div className={name_style}>{name}</div>
                <div className={score_style}>
                  {score}/{possibleScore}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export function EvaluationBox({ connection, groups, user, history }) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentLoading, setCurrentLoading] = useState("");

  const evaluationTemplatesQuery = useQuery(evaluationTemplatesGet);
  let templates = [];
  if (!evaluationTemplatesQuery.loading && evaluationTemplatesQuery.data) {
    templates =
      evaluationTemplatesQuery.data.accountGet.evaluationTemplates || [];
  }

  const [mutate, { loading }] = useMutation(evaluationPut);

  if (!connection) return <span />;

  const evaluations = connection.evaluations || [];

  const sharedEvaluations = [];

  // console.log('connection.sharedWithMe', connection.sharedWithMe)

  for (let sharedItem of connection.sharedWithMe) {
    if (sharedItem.connection) {
      for (let sharedEvaluation of sharedItem.connection.evaluations) {
        if (!evaluations.some(({ id }) => id === sharedEvaluation.id)) {
          if (sharedItem.evaluations) {
            sharedEvaluations.push({
              evaluation: sharedEvaluation,
              sharedItem,
            });
          }
        }
      }
    }
  }

  // Get groups that you are member of that has this startup
  let isInGroups =
    groups.filter(g =>
      g.startups.some(s => s.creativeId === connection.creative.id)
    ) || [];

  // Get only groups with evaluation template
  let groupsWithTemplates = isInGroups.filter(({ evaluationTemplates }) => {
    return evaluationTemplates && evaluationTemplates.length !== 0;
  });

  // Get only evaluation templates I have not already used
  groupsWithTemplates = groupsWithTemplates.map(group => {
    let evaluationTemplates = group.evaluationTemplates.filter(template => {
      let haveEvaluated = connection.evaluations.some(
        ({ templateId, createdByUser }) => {
          if (createdByUser.email !== user.email) {
            return false;
          }
          return templateId === template.id;
        }
      );
      return !haveEvaluated;
    });
    return {
      ...group,
      evaluationTemplates,
    };
  });

  // Remove empty
  groupsWithTemplates = groupsWithTemplates.filter(
    ({ evaluationTemplates }) =>
      evaluationTemplates && evaluationTemplates.length
  );

  let allTemplates = [...templates];
  for (let group of groupsWithTemplates) {
    allTemplates = allTemplates.concat(group.evaluationTemplates || []);
  }

  let allGroupsWithTemplates = groups.filter(
    ({ evaluationTemplates }) =>
      evaluationTemplates && evaluationTemplates.length !== 0
  );

  let megaAllTemplates = [...templates];

  // for (let group of allGroupsWithTemplates) {
  //   megaAllTemplates = megaAllTemplates.concat(group.evaluationTemplates || []);
  // }

  async function selectTemplate({ templateId, name, description }) {
    setCurrentLoading(templateId);
    try {
      let res = await mutate({
        variables: {
          connectionId: connection.id,
          input: { templateId, name, description },
        },
      });
      let evaluation = res.data.evaluationPut;
      let template = allTemplates.find(
        t => t && t.id === evaluation.templateId
      ) || { sections: [{ id: null }] };

      let path = `${startup_page}/${connection.id}/evaluation/${evaluation.id}/section/${template.sections[0].id}`;
      history.push(path);
    } catch (error) {
      console.log("error", error);
    }
    setCurrentLoading("");
  }

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
            type="right_arrow"
            size="small"
            onClick={() => {
              if (currentLoading) return;

              let haveUsedThisTemplateBefore = evaluations.some(
                evaluation => evaluation.templateId === templateId
              );

              if (!haveUsedThisTemplateBefore) {
                selectTemplate({ templateId, name, description });
              } else {
                setShowConfirmModal({ templateId, name, description });
                setShowModal(false);
              }
            }}
            loading={loading && currentLoading === templateId}
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
        <div style={{ paddingTop: "20px" }}>
          <div style={{ fontSize: "18px" }}>Evaluate this startup</div>
          <div
            style={{ padding: "20px 0px", color: "var(--color-gray-medium)" }}
          >
            Evaluate this startup based on your own criteria, or choose from
            predefined templates.
          </div>
        </div>
      )}

      <div className={container}>
        {evaluations.map(evaluation => (
          <EvaluationSummary
            key={evaluation.id}
            evaluation={evaluation}
            connectionId={connection.id}
          />
        ))}

        {sharedEvaluations.map(({ evaluation, sharedItem }) => (
          <EvaluationSummary
            key={evaluation.id}
            evaluation={evaluation}
            connectionId={sharedItem.connectionId}
            sharedItem={sharedItem}
            history={history}
            noEdit
          />
        ))}
      </div>

      {groupsWithTemplates.map(group => {
        return (
          <div key={group.id}>
            <div className={from_group}>
              Evaluation from{" "}
              <span
                onClick={() => {
                  let path = `${group_route}/${group.id}`;
                  history.push(path);
                }}
              >
                {group.name}
              </span>
            </div>

            <div>
              {group.evaluationTemplates.map(template => {
                return (
                  <Button
                    type="right_arrow"
                    size="medium"
                    style={{ width: "100%" }}
                    key={`${group.id}-${template.id}`}
                    loading={currentLoading === template.id}
                    onClick={async () => {
                      if (currentLoading === template.id) return;

                      setCurrentLoading(template.id);
                      try {
                        let variables = {
                          connectionId: connection.id,
                          groupId: group.id,
                          input: {
                            templateId: template.id,
                            name: template.name,
                            description: template.description,
                          },
                        };

                        let res = await mutate({ variables });
                        let evaluation = res.data.evaluationPut;
                        let _template = allTemplates.find(
                          ({ id }) => id === evaluation.templateId
                        ) || { sections: [{ id: null }] };
                        let sectionId = _template.sections.find(({ id }) => id)
                          .id;
                        let path = `${startup_page}/${connection.id}/evaluation/${evaluation.id}/section/${sectionId}`;
                        history.push(path);
                      } catch (error) {
                        console.log("error", error);
                      }
                      setCurrentLoading("");
                    }}
                  >
                    {template.name}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div
        style={{
          marginTop: "15px",
          textAlign: "right",
        }}
      >
        <Button
          type={
            (evaluations.length && !groupsWithTemplates.length) ||
            groupsWithTemplates.length
              ? "just_text"
              : "right_arrow"
          }
          size="small"
          onClick={() => setShowModal(true)}
        >
          New evaluation
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
              dataSource={megaAllTemplates}
              columns={columns}
              disableHead={true}
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

      {showConfirmModal && (
        <Modal
          title="Evaluate startup"
          close={() => {
            setShowConfirmModal(undefined);
            setShowModal(true);
          }}
          disableFoot={true}
        >
          <div
            style={{
              padding: "10px 0px 0px 8px",
              fontSize: "16px",
              lineHeight: 2,
            }}
          >
            <span>
              You have already evaluated this startup using this template. You
              can edit evaluation, or create a new one by clicking "USE".
            </span>
          </div>

          <div
            style={{
              position: "relative",
              paddingTop: "20px",
              textAlign: "right",
            }}
          >
            <Button
              buttonStyle="secondary"
              size="medium"
              onClick={() => {
                setShowConfirmModal(undefined);
                setShowModal(true);
              }}
            >
              cancel
            </Button>

            <Button
              type="right_arrow"
              size="medium"
              loading={currentLoading}
              onClick={() => selectTemplate(showConfirmModal)}
            >
              use
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
