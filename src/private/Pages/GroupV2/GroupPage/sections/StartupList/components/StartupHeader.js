import { startup_page } from "../../../../../../../definitions";
import ButtonWithIcon from "../../../../../srv_startup/pages/ui-kits/button-with-icon";
import { ICONPOSITION } from "../../../../../srv_startup/pages/constants";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { connectionCreate } from "../../../../../../Apollo/Mutations";
import { groupGetV2 } from "../../../../../../Apollo/Queries";
import SharingOptionsModal from "../../../../modals/SharingOptionsModal";

export default function StartupHeader({ startup, group, history }) {
  const [startupDescription, setStartupDescription] = useState(false);
  const [viewSharingOptions, setViewSharingOptions] = useState();

  const [createConnection, createConnectionRes] = useMutation(
    connectionCreate,
    {
      refetchQueries: [
        {
          query: groupGetV2,
          variables: { id: group.id },
        },
      ],
      awaitRefetchQueries: true,
    }
  );

  let oneLiner, problem, solution;
  if (startup?.creative?.answers) {
    let _oneLiner = startup?.creative?.answers?.find(
      ({ questionId }) => questionId === "q01_section_info"
    );
    if (_oneLiner) oneLiner = _oneLiner.val;
    let _problem = startup?.creative?.answers?.find(
      ({ questionId }) => questionId === "q02_section_info"
    );
    if (_problem) problem = _problem.val;
    let _solution = startup?.creative?.answers?.find(
      ({ questionId }) => questionId === "q03_section_info"
    );
    if (_solution) solution = _solution.val;
  }

  let noMeta = !oneLiner && !problem && !solution;
  const canShare = group?.settings?.addEvaluation;

  return (
    <>
      {/* Name and logo */}
      <div className="group-startup-card__header row">
        <div className="col-sm-12">
          <div className="group-startup-card__header__logo">
            {startup?.creative?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div
            className={`group-startup-card__header__name`}
            style={
              startup?.connection && {
                textDecoration: "underline",
                cursor: "pointer",
              }
            }
            onMouseEnter={() => setStartupDescription(true)}
            onMouseLeave={() => setStartupDescription(false)}
            onClick={() => {
              if (!startup.connection) {
                return;
              }
              history.push(`${startup_page}/company/${startup.connection?.id}`);
            }}
          >
            {startup?.creative?.name}
          </div>

          {/* hover info */}
          {!noMeta && startupDescription && (
            <div className="group-startup-card__info-window info-window">
              <div className="group-startup-card__info-window__heading">
                {startup?.creative?.name}
              </div>

              {oneLiner && (
                <p className="group-startup-card__info-window__description">
                  {oneLiner}
                </p>
              )}

              {problem && (
                <>
                  <div className="group-startup-card__info-window__heading">
                    Problem
                  </div>
                  <p className="group-startup-card__info-window__description">
                    {problem}
                  </p>
                </>
              )}

              {solution && (
                <>
                  <div className="group-startup-card__info-window__heading">
                    Solution
                  </div>
                  <p className="group-startup-card__info-window__description">
                    {solution}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {oneLiner && (
          <div className="col-sm-12 group-startup-card__header__one-liner">
            {oneLiner}
          </div>
        )}
      </div>

      <div className="group-startup-card__sharing-options">
        {startup.isInMyDealFlow && canShare && (
          <ButtonWithIcon
            iconName="share"
            className="stop-sharing-btn"
            text="SHARING OPTIONS"
            iconPosition={ICONPOSITION.START}
            onClick={() => setViewSharingOptions(true)}
          />
        )}

        {!startup.isInMyDealFlow && (
          <ButtonWithIcon
            iconName="add"
            className="add-to-deal-flow"
            text="ADD TO DEAL FLOW"
            iconPosition={ICONPOSITION.START}
            loading={createConnectionRes.loading}
            onClick={() => {
              if (createConnectionRes.loading) {
                return;
              }
              let variables = {
                groupId: group.id,
                creativeId: startup?.creative?.id,
              };
              createConnection({ variables });
            }}
          />
        )}
      </div>

      {viewSharingOptions && (
        <SharingOptionsModal
          close={() => setViewSharingOptions(false)}
          startup={startup}
          group={group}
        />
      )}
    </>
  );
}
