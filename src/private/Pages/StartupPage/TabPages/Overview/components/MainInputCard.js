import React, { useState } from "react";
import SubjectiveScoresComp from "./SubjectiveScoresComp";
import EvaluationSummariesComp from "./EvaluationSummariesComp";
import TagsComp from "./TagsComp";
import FunnelsComp from "./FunnelsComp";
import GroupsComp from "./GroupsComp";
import ImpactGoalsComp from "./ImpactGoalsComp";

export default function MainInputCard({
  connection,
  refetch,
  user,
  account,
  history,
}) {
  return (
    <div className="card">
      {/*SUBJECTIVE SCORES*/}
      <SubjectiveScoresComp
        connection={connection}
        account={account}
        user={user}
      />

      <div className="separator" />

      {/*EVALUATION SUMMARIES*/}
      {!!connection?.evaluationSummaries?.length && (
        <>
          <EvaluationSummariesComp connection={connection} user={user} />
          <div className="separator" />
        </>
      )}

      {/*TAGS*/}
      <TagsComp connection={connection} />
      <div className="separator" />

      {/*FUNNELS*/}
      <FunnelsComp connection={connection} />
      <div className="separator" />

      {/*GROUPS*/}
      <GroupsComp
        connection={connection}
        goToPath={path => history.push(path)}
        refetch={refetch}
      />
      <div className="separator" />

      {/*IMPACT GOALS*/}
      <ImpactGoalsComp connection={connection} />
    </div>
  );
}
