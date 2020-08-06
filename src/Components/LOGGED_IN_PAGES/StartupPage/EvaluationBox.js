import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import moment from "moment";
import { Link } from "react-router-dom";

import { evaluationTemplatesGet, connectionGet } from "../../../Apollo/Queries";
import { evaluationPut } from "../../../Apollo/Mutations";

import { item } from "./EvaluationBox.module.css";
import { startup_page } from "../../../routes";

function EvaluationList({ evaluations, connectionId }) {
  return (
    <div>
      {evaluations.map(evaluation => (
        <div key={`evaluation-${evaluation.id}`} className={item}>
          <span>
            <label>
              {evaluation.name}{" "}
              <Link
                to={`${startup_page}/${connectionId}/evaluation/${evaluation.id}`}
              >
                <i className="fa fas fa-edit" />
              </Link>
            </label>
            <label>{moment(evaluation.createdAt).format("lll")}</label>
          </span>
        </div>
      ))}
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
      <EvaluationList evaluations={evaluations} connectionId={connection.id} />

      <button onClick={() => setShow(true)}>evaluate startup</button>
      {show &&
        (mutationLoading ? (
          <p>...loading</p>
        ) : (
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
        ))}
    </>
  );
}
