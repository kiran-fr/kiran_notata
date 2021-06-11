import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  groupsPublicGet,
  groupInvitationsGet,
  userGet,
} from "../../../../Apollo/Queries";
import {
  groupUserInvitationResponse,
  groupPublicJoin,
} from "../../../../Apollo/Mutations";
import { Loader } from "../../../../../Components/elements";

function reduceArray(arr, no) {
  let nArr = [];
  arr.forEach((a, i) => {
    i < no && nArr.push(a);
  });
  return nArr;
}

export default function DashboardGroupInvitations({ history }) {
  // Queries
  const publicGroupsQuery = useQuery(groupsPublicGet);
  const groupInvitationsQuery = useQuery(groupInvitationsGet);
  const userQuery = useQuery(userGet);

  // Mutations
  const [joinPublicGroup, joinPublicGroupRes] = useMutation(groupPublicJoin);

  const [respond, respondRes] = useMutation(groupUserInvitationResponse, {
    refetchQueries: [{ query: groupInvitationsGet }],
  });

  // Maps
  let publicGroupsFromServer = publicGroupsQuery?.data?.groupsPublicGet || [];
  let groupInvitationsFromServer =
    groupInvitationsQuery?.data?.groupInvitationsGet || [];
  let user = userQuery?.data?.userGet || {};

  publicGroupsFromServer = publicGroupsFromServer.filter(
    ({ iAmMember }) => !iAmMember
  );

  // Get (max 2) group invitations
  let groupInvitations = [];
  if (groupInvitationsFromServer) {
    groupInvitations = reduceArray(groupInvitationsFromServer, 2);
  }

  let publicGroups = [];

  if (publicGroupsFromServer.length) {
    // If there are 2 invitations, list none
    if (groupInvitations.length === 2) {
      publicGroups = [];
    }

    // If there is one invitation, list 2
    if (groupInvitations.length === 1) {
      publicGroups = reduceArray(publicGroupsFromServer, 2);
    }

    // If there are no invitations, list 3
    if (groupInvitations.length === 0) {
      publicGroups = reduceArray(publicGroupsFromServer, 5);
    }
  }

  let hasAllData =
    publicGroupsQuery?.data && groupInvitationsQuery?.data && userQuery?.data;

  let isLoading =
    publicGroupsQuery?.loading ||
    groupInvitationsQuery?.loading ||
    userQuery?.loading;

  let showLoader =
    joinPublicGroupRes?.loading ||
    respondRes?.loading ||
    (!hasAllData && isLoading);

  let isEmpty = !publicGroups.length && !groupInvitations.length;

  return (
    <div className="card dashboard-container__invited-to-groups-card">
      <div className="card-heading-designer">
        Group suggestions and invitations
      </div>
      <div className="dashboard-container__invited-to-groups-card__data-container">
        {showLoader && <Loader />}

        {isEmpty && !showLoader && (
          <div className="empty-wrapper">
            <div>
              <div>You have no invitations</div>
            </div>
          </div>
        )}

        {publicGroups.map(group => (
          <div
            className="dashboard-container__invited-to-groups-card__data-container__data-entry"
            key={group.id}
          >
            <div className="group-name">
              <span
                className="material-icons"
                onClick={() => {
                  let variables = {
                    id: group.id,
                  };
                  joinPublicGroup({ variables });
                }}
              >
                add_circle
              </span>
              {group.name}
            </div>
            {/*<div className="admin">*/}
            {/*  Ane Nordahl Carlsen*/}
            {/*</div>*/}
          </div>
        ))}
      </div>

      {groupInvitations
        .filter(x => x)
        .map(group => (
          <div
            className="dashboard-container__invited-to-groups-card__invite-container"
            id={group?.id}
          >
            <div className="dashboard-container__invited-to-groups-card__invite-container__invite">
              <div className="invite-member">
                <span className="invitation-text">
                  You have been invited to join a group
                </span>
              </div>
              <div className="dashboard-container__invited-to-groups-card__data-container__data-entry">
                <div className="group-name">
                  <span
                    className="material-icons"
                    onClick={() => {
                      let variables = {
                        groupId: group.id,
                        email: user.email,
                        response: "ACCEPT",
                      };
                      console.log("variables", variables);
                      respond({ variables });
                    }}
                  >
                    add_circle
                  </span>
                  {group.name}
                </div>
              </div>
            </div>
            <div className="dashboard-container__invited-to-groups-card__invite-container__close">
              <span
                className="material-icons"
                onClick={() => {
                  let variables = {
                    groupId: group.id,
                    email: user.email,
                    response: "REJECT",
                  };

                  console.log("variables", variables);
                  respond({ variables });
                }}
              >
                close
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}
