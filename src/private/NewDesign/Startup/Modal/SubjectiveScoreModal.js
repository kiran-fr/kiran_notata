import React, { useState, useEffect } from "react";
import { GhostLoader } from "Components/elements";
import Modal from "../DealFlow/modal";
import { AddScore } from "../DealFlow/addScore";

import { useQuery } from "@apollo/client";
import { userGet } from "private/Apollo/Queries";

// API Stuff
import { useMutation } from "@apollo/client";
import { connectionSubjectiveScorePut } from "private/Apollo/Mutations";

export default function SubjectiveScoreModal({ connection, close }) {
  // Query user data
  let userQuery = useQuery(userGet);
  let user = userQuery?.data?.userGet;

  const [subScore, setSubScore] = useState("");

  // Define data
  const subjectiveScores = connection?.subjectiveScores || [];

  // Get your score
  let { score: yourScore } =
    subjectiveScores.find(ss => ss.createdBy === user.cognitoIdentityId) || {};

  // Mutation
  const [mutate] = useMutation(connectionSubjectiveScorePut);

  // score given by this user or not
  useEffect(() => {
    let { score: yourScore } =
      subjectiveScores.find(ss => ss.createdBy === user.cognitoIdentityId) ||
      {};
    setSubScore(yourScore ? yourScore : "");
  }, [connection]);

  // store the value in state

  const handleScore = sc => {
    setSubScore(sc);
  };

  // save score func
  const saveModal = () => {
    let variables = {
      id: connection.id,
      score: subScore,
    };

    let sS = subjectiveScores || [];

    let action =
      yourScore === subScore ? "delete" : yourScore ? "update" : "add";

    // Remove
    if (action === "delete") {
      sS = subjectiveScores.filter(s => s.createdBy !== user.cognitoIdentityId);
    }

    // Add new
    if (action === "add") {
      let optimisticItem = {
        createdAt: new Date().getTime(),
        createdBy: user.cognitoIdentityId,
        score: subScore,
        responseType: "update",
        __typename: "SubjectiveScore",
        createdByUser: {
          email: user.email,
          family_name: user.family_name,
          given_name: user.given_name,
          __typename: "SimpleUser",
        },
      };
      sS = [...subjectiveScores, optimisticItem];
    }

    // Update existing
    if (action === "update") {
      sS = subjectiveScores.map(s =>
        s.createdBy !== user.cognitoIdentityId ? s : { ...s, score: subScore }
      );
    }

    let optimisticResponse = {
      __typename: "Mutation",
      connectionSubjectiveScorePut: {
        ...connection,
        subjectiveScores: sS,
      },
    };

    mutate({
      variables,
      optimisticResponse,
    });
    close(false);
  };

  return (
    <Modal
      title="Set subjective score"
      saveModal={saveModal}
      closeModal={close}
    >
      {(!user && <GhostLoader />) || (
        <AddScore subScore={subScore} handleScore={handleScore} />
      )}
    </Modal>
  );
}
