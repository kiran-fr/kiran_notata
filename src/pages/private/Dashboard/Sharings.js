import React, { useState } from "react";
import moment from "moment";

// API
import { useQuery, useMutation } from "@apollo/client";

import { userGet, groupsGet } from "Apollo/Queries";
import { groupMarkAsSeen } from "Apollo/Mutations";

// COMPONENTS
import Filters from "./Filters";
import { group as group_route } from "pages/definitions";

import { Card } from "Components/elements";

import {
  list_item,
  group_list_item,
  sharing_list_item,
  time_stamp,
  highlight_1,
  highlight_2,
  list_icon,
  mark_all,
  list_expander,
  mark_as_seen,
} from "./Sharings.module.css";

export default function Sharings({ history }) {
  const [expanded, setExpanded] = useState(false);

  const [loadingMark, setLoadingMark] = useState({ ALL: false });

  const userGetQuery = useQuery(userGet);
  const groupsGetQuery = useQuery(groupsGet);

  const [markAsSeen] = useMutation(groupMarkAsSeen, {
    refetchQueries: [{ query: groupsGet }],
    awaitRefetchQueries: true,
  });

  if (userGetQuery.loading || groupsGetQuery.loading) return <span />;
  if (userGetQuery.error || groupsGetQuery.error) return <span />;
  if (!userGetQuery.data || !groupsGetQuery.data) return <span />;

  let user = userGetQuery.data.userGet;
  let groups = groupsGetQuery.data.groupsGet;

  let inbox = [];

  for (let group of groups) {
    let { members } = group;

    // let isOwner = group.createdBy === user.cognitoIdentityId;
    let isAdmin = group.members.some(
      ({ email, role }) => email === user.email && role === "admin"
    );

    let member = members.find(({ email }) => email === user.email) || [];
    let { latestActivity } = member;
    if (!latestActivity && !isAdmin) {
      inbox.push({
        timeStamp: group.createdAt,
        type: "GROUP",
        data: group,
      });
    }

    for (let startup of group.startups) {
      if (!startup.seen) {
        inbox.push({
          timeStamp: startup.createdAt,
          type: "SHARING",
          data: {
            ...startup,
            groupName: group.name,
            groupId: group.id,
          },
        });
      }
    }
  }

  inbox = inbox.sort((a, b) => b.timeStamp - a.timeStamp);

  inbox = inbox.filter(({ type }) => type !== "SHARING");

  let capListAt = 5;

  if (!inbox.length) return <span />;

  return (
    <Card label="Inbox" maxWidth={1200} style={{ paddingBottom: "20px" }}>
      <div
        className={mark_all}
        onClick={async () => {
          try {
            setLoadingMark({ ALL: true });
            await markAsSeen({ variables: { markAll: true } });
          } catch (error) {
            console.log("error", error);
          }
          setLoadingMark({ ALL: false });
        }}
      >
        {loadingMark.ALL && (
          <span>
            <i className="fa fa-spinner fa-spin" />{" "}
          </span>
        )}
        mark all as seen
      </div>

      {inbox
        .filter((a, i) => (expanded ? true : i < capListAt))
        .map(({ timeStamp, type, data }, i) => {
          return (
            <div key={i} className={list_item}>
              {type === "GROUP" && (
                <div className={group_list_item}>
                  <div className={list_icon}>
                    <i className="fal fa-users" />
                  </div>

                  <div className={time_stamp}>
                    {moment(timeStamp).format("lll")}
                  </div>
                  <div>
                    You have been invited to join the group{" "}
                    <span
                      className={highlight_1}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        let path = `${group_route}/${data.id}`;
                        history.push(path);
                      }}
                    >
                      {data.name}
                    </span>
                  </div>

                  <div
                    className={mark_as_seen}
                    onClick={() => {
                      if (loadingMark[data.id]) return;
                      markAsSeen({ variables: { groupId: data.id } });
                      setLoadingMark({ [data.id]: true });
                    }}
                  >
                    mark as seen{" "}
                    {loadingMark[data.id] && (
                      <i className="fa fa-spinner fa-spin" />
                    )}
                  </div>
                </div>
              )}
              {type === "SHARING" && (
                <div className={sharing_list_item}>
                  <div className={list_icon}>
                    <i className="fal fa-share-alt" />
                  </div>

                  <div className={time_stamp}>
                    {moment(timeStamp).format("lll")}
                  </div>
                  <div>
                    <span className={highlight_2}>{data.sharedBy}</span>
                    <span> shared </span>

                    <span
                      className={highlight_1}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        let path = `${group_route}/${data.groupId}/${data.connection.id}`;
                        history.push(path);
                      }}
                    >
                      {data.connection.creative.name}
                    </span>

                    <span> with the group </span>

                    <span
                      className={highlight_1}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        let path = `${group_route}/${data.groupId}`;
                        history.push(path);
                      }}
                    >
                      {data.groupName}
                    </span>
                  </div>

                  <div
                    className={mark_as_seen}
                    onClick={async () => {
                      if (loadingMark[`${data.connection.id}-${data.sharedBy}`])
                        return;
                      let variables = {
                        groupId: data.groupId,
                        connectionId: data.connection.id,
                        sharedBy: data.sharedBy,
                      };
                      setLoadingMark({
                        [`${data.connection.id}-${data.sharedBy}`]: true,
                      });
                      markAsSeen({ variables });
                    }}
                  >
                    mark as seen{" "}
                    {loadingMark[`${data.connection.id}-${data.sharedBy}`] && (
                      <i className="fa fa-spinner fa-spin" />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

      {inbox.length > capListAt && !expanded && (
        <div onClick={() => setExpanded(true)} className={list_expander}>
          <span>View {inbox.length - capListAt} more items...</span>
        </div>
      )}

      {expanded && (
        <div onClick={() => setExpanded(false)} className={list_expander}>
          <span>View less</span>
        </div>
      )}
    </Card>
  );
}
