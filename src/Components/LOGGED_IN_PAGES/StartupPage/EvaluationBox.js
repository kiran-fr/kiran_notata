import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import { evaluationTemplatesGet, connectionGet } from "../../../Apollo/Queries";
import { evaluationPut } from "../../../Apollo/Mutations";

function EvaluationList({ evaluations }) {
  return (
    <div>
      <h3>Evaluations</h3>
      <ul>
        {evaluations.map(evaluation => (
          <li key={`evaluation-${evaluation.id}`}>
            <label>name: {evaluation.name}</label>
            <br />
            <label>created by: {evaluation.createdByUser.email}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EvaluationBox({ connection, user }) {
  const [show, setShow] = useState(false);

  const {
    data: evaluationTemplates,
    loading: evaluationTemplatesLoading,
    error: evaluationTemplatesError,
  } = useQuery(evaluationTemplatesGet);

  console.log("evaluationTemplates", evaluationTemplates);

  let templates = [];
  if (
    !evaluationTemplatesLoading &&
    !evaluationTemplatesError &&
    evaluationTemplates
  ) {
    templates = evaluationTemplates.accountGet.evaluationTemplates;
  }

  const [
    mutate,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(evaluationPut, {
    refetchQueries: [
      { query: connectionGet, variables: { id: connection.id } },
    ],
    awaitRefetchQueries: true,
  });

  const evaluations = (connection || {}).evaluations || [];

  return (
    <>
      <EvaluationList evaluations={evaluations} />

      <button onClick={() => setShow(true)}>evaluate startup</button>
      {show && (
        <ul>
          {templates.map(({ id: templateId, name, description }) => (
            <li
              key={templateId}
              onClick={async () => {
                await mutate({
                  variables: {
                    connectionId: connection.id,
                    input: { templateId, name, description },
                  },
                });
                !mutationError && setShow(false);
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
