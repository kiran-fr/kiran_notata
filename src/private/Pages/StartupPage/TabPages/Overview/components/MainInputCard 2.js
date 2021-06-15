import React from "react";
import SubjectiveScoresComp from "./SubjectiveScoresComp";
import EvaluationSummariesComp from "./EvaluationSummariesComp";
import TagsComp from "./TagsComp";
import FunnelsComp from "./FunnelsComp";
import GroupsComp from "./GroupsComp";
import ImpactGoalsComp from "./ImpactGoalsComp";

export default function MainInputCard({ connection }) {
  return (
    <div className="card">
      {/*SUBJECTIVE SCORES*/}
      <SubjectiveScoresComp connection={connection} />
      <div className="separator" />

      {/*EVALUATION SUMMARIES*/}
      <EvaluationSummariesComp connection={connection} />
      <div className="separator" />

      {/*TAGS*/}
      <TagsComp connection={connection} />

      {/*FUNNELS*/}
      <FunnelsComp connection={connection} />

      {/*GROUPS*/}
      <GroupsComp connection={connection} />

      {/*IMPACT GOALS*/}
      <ImpactGoalsComp connection={connection} />
    </div>
  );
}
