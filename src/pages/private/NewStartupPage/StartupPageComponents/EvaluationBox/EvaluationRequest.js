import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { evaluationTemplatesGet } from "Apollo/Queries";
import { evaluationPut } from "Apollo/Mutations";
import {
  startup_page,
  group as group_route,
  public_evaluation,
} from "pages/definitions";
import { Button, Table, Modal, SuccessBox } from "Components/elements";

function NewEvaluationLogic({ evaluations, templates, connection, history }) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentLoading, setCurrentLoading] = useState("");
  const [mutate, { loading }] = useMutation(evaluationPut);

  let groupsWithTemplates = [];

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
      let template = templates.find(
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
    <div
      style={{
        marginBottom: "35px",
      }}
    >
      <div
        style={{
          marginTop: "15px",
          textAlign: "right",
        }}
      >
        <Button
          type={
            (evaluations.length && !groupsWithTemplates.length) ||
            groupsWithTemplates.length ||
            connection.sharedWithMe?.length
              ? "just_text"
              : "right_arrow"
          }
          size="small"
          onClick={() => setShowModal(true)}
        >
          + new evaluation
        </Button>
      </div>

      <div
        style={{
          // marginTop: "-35px",
          // textAlign: "right",
          float: "right",
          marginTop: "50px",
        }}
      >
        <Button
          type="just_text"
          size="small"
          // onClick={() =>
          // getPresentations({
          // variables: { connectionId: connection.id },
          // })
          // }
        >
          request evaluation
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

export function EvaluationRequest({ connection }) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentLoading, setCurrentLoading] = useState("");
  const [mutate, { loading }] = useMutation(evaluationPut);
  const [copySuccess, setCopySuccess] = useState(undefined);

  const evaluationTemplatesQuery = useQuery(evaluationTemplatesGet);
  // const evaluationTemplatesQuery = useQuery(evaluationTemplatesGet);

  const publicLink = `${window.location.protocol}//${window.location.host}${public_evaluation}/${connection?.id}/${connection?.creative.id}/${showConfirmModal?.templateId}`;

  function copyToClipboard() {
    navigator.clipboard.writeText(publicLink);
    setCopySuccess(true);
  }

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
      let template = templates.find(
        t => t && t.id === evaluation.templateId
      ) || { sections: [{ id: null }] };

      let path = `${startup_page}/${connection.id}/evaluation/${evaluation.id}/section/${template.sections[0].id}`;
      //   history.push(path);
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

  let templates = [];

  if (!evaluationTemplatesQuery.loading && evaluationTemplatesQuery.data) {
    templates =
      evaluationTemplatesQuery.data.accountGet.evaluationTemplates || [];
  }
  console.log("templ", templates);

  if (!connection) return <span />;

  const evaluations = connection.evaluations || [];

  return (
    <>
      <div
        style={{
          // marginTop: "-35px",
          // textAlign: "right",
          float: "right",
          marginTop: "50px",
        }}
      >
        <Button
          type="just_text"
          size="small"
          onClick={() => setShowModal(true)}
        >
          request evaluation
        </Button>
      </div>

      {showModal && (
        <Modal
          title="Request Evaluation"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <div style={{ padding: "10px 0px 0px 8px" }}>
            <Table
              dataSource={templates}
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
          title="Request Evaluation"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <div>
            Here is a public link you can share with people, so that you can
            collect their evaluations. They don't need to sign up to notata to
            use this link.
          </div>

          <div
            style={{
              padding: "10px 0px",
            }}
          >
            <SuccessBox
              style={{
                padding: "5px",
                fontSize: "12px",
                color: "var(--color-secondary)",
              }}
            >
              <a href={publicLink} target="_blank" rel="noopener noreferrer">
                {publicLink}
              </a>
            </SuccessBox>

            <div
              style={{
                textAlign: "right",
                fontSize: "12px",
                cursor: "pointer",
              }}
              onClick={copyToClipboard}
            >
              {copySuccess ? "link copied to clipboard" : "copy link"}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
