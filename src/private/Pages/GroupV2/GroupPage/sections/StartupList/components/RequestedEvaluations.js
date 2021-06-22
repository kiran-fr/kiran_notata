import React, { useState } from "react";
import { evaluate_page } from "definitions";
import SubjectiveScoreList from "../../../../../StartupPage/TabPages/Evaluations/SubjectiveScoreList";
import EvaluationListByTemplate from "../../../../../StartupPage/TabPages/Evaluations/EvaluationListByTemplate";
import ButtonWithIcon from "../../../../../srv_startup/pages/ui-kits/button-with-icon";
import { ICONPOSITION } from "../../../../../srv_startup/pages/constants";

export default function RequestedEvaluations({ startup, group, history }) {
  const [viewDetails, setViewDetails] = useState(true);

  let connection = startup?.connection;
  let evaluations = connection?.evaluations?.filter(({ isMe }) => isMe) || [];

  let unusedEvaluations = group?.evaluationTemplates?.filter(
    ({ id }) => !evaluations.some(({ templateId }) => templateId === id)
  );

  if (!startup.isInMyDealFlow) {
    return <span />;
  }

  if (!unusedEvaluations.length) {
    return <span />;
  }

  return (
    <div className="group-startup-card__requested-evaluations">
      <div
        className="group-startup-card__content-section"
        onClick={() => setViewDetails(!viewDetails)}
      >
        <div className="group-startup-card__content-section__title">
          REQUESTED EVALUATIONS
        </div>
        <i
          className={`group-startup-card__content-section__icon ${
            viewDetails ? "fa fa-chevron-down" : "fa fa-chevron-right"
          }`}
          aria-hidden="true"
        />
      </div>

      {viewDetails && (
        <div className="group-startup-card__content-inner">
          {unusedEvaluations.map(template => {
            return (
              <div className="row" key={template.id}>
                <div className="col-sm-12">
                  <ButtonWithIcon
                    iconName="add"
                    className="sharing-bth"
                    text={template.name}
                    iconPosition={ICONPOSITION.END}
                    onClick={() => {
                      let path = `${evaluate_page}/${connection?.id}/${template.id}?groupId=${group.id}`;
                      history.push(path);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // return (
  //   <div className="row requested-evaluations-container">
  //     <div className="col-sm-12">
  //       <div className="col-sm-12 your-evaluations-container__details-heading">
  //         requested evaluations
  //       </div>
  //
  //       {unusedEvaluations.map(template => {
  //         return (
  //           <div className="row" key={template.id}>
  //             <div className="col-sm-12 your-evaluations-container__record">
  //               <div className="col-sm-5 col-xs-7 subjective-score-evaluation-container__name">
  //                 {template.name}
  //               </div>
  //               <div className="col-sm-2 col-xs-6 subjective-score-evaluation-container__submitions">
  //                 <span />
  //               </div>
  //               <div className="col-sm-1 col-xs-5 subjective-score-evaluation-container__score">
  //                 <span />
  //               </div>
  //               <div className="col-md-4 col-sm-6 col-xs-6">
  //                 <div
  //                   className="your-evaluations-container__record__share-with-group"
  //                   onClick={() => {
  //                     let path = `${evaluate_page}/${connection?.id}/${template.id}?groupId=${group.id}`;
  //                     history.push(path);
  //                   }}
  //                 >
  //                   Evaluate
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );
}
