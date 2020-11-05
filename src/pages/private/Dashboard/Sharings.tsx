import React, { useEffect, useState } from "react";
import moment from "moment";
import { History } from "history";

// API
import { useQuery, useMutation } from "@apollo/client";
import { userGet, groupsGet, creativesGet, creativeTemplateGet, connectionsGet } from "Apollo/Queries";
import { groupMarkAsSeen, creativeDelete } from "Apollo/Mutations";

// import { startup_page } from "../../definitions";
import { group as group_route } from "../../definitions";

import { Card, Modal } from "Components/elements";

import styles from "./Sharings.module.css";
import {
  Connection,
  Creative,
} from "pages/private/Dashboard/Connections/types";
import { Groups } from "Apollo/Queries/groupsGet";
import { connectionPut } from "Apollo/Mutations/index";
import { ViewSummary } from "pages/private/StartupPage/Facts/Facts";


// *********
// * TYPES *
// *********

enum InboxType {
  GROUP = "GROUP", SHARING = "SHARING", EXTERNAL_FORM = "EXTERNAL_FORM"
}

type Inbox = {
  timeStamp: string | Date;
  type: InboxType;
  data: InboxData;
  actionState?: "SAVE" | "DELETE" | "DETAILS";
}

type InboxData = {
  name: string;
  groupId: string;
  sharedBy?: string;
  connection?: any;
  creative?: Creative;
}

// *********



export default function Sharings({ history }:
                                   {
                                     history: History,
                                   }) {

  // STATES
  const [expanded, setExpanded] = useState(false);
  const [selectedInbox, setSelectedInbox] = useState<Inbox | null>(null);
  const [loadingMark, setLoadingMark] = useState<{ [key: string]: boolean }>({ ALL: false });

  // QUERIES
  const userGetQuery = useQuery(userGet);
  const groupsGetQuery = useQuery(groupsGet);
  const creativesGetQuery = useQuery(creativesGet);
  const connectionsGetQuery = useQuery(connectionsGet);
  const creativeTemplateQuery = useQuery(creativeTemplateGet);

  // MUTATIONS
  const [creativeDeleteQuery, { loading: creativeDeleteLoading}] = useMutation(creativeDelete);
  const [mutateConnection, { loading: connectionPutLoading}] = useMutation(connectionPut);

  const [markAsSeen] = useMutation(groupMarkAsSeen, {
    refetchQueries: [{ query: groupsGet }],
    awaitRefetchQueries: true
  });

  // DEFINITIONS
  const isLoading = userGetQuery.loading || groupsGetQuery.loading || creativesGetQuery.loading || connectionsGetQuery.loading;
  const hasError = userGetQuery.error || groupsGetQuery.error || creativesGetQuery.error || connectionsGetQuery.error;
  const missingData = !userGetQuery.data || !groupsGetQuery.data || !creativesGetQuery.data || !connectionsGetQuery.data;



  // ================
  // HELPER FUNCTIONS
  // ================

  function getUnbindedCreatives(connections: Connection[], creatives: Creative[]): Creative[] {
    const existCreativeIds = new Set(connections.map(({creativeId}) => creativeId));
    return creatives.filter((creative) => !existCreativeIds.has(creative.id));
  }

  if (isLoading)
    return (
    <Card label="Inbox" maxWidth={1200} style={{ paddingBottom: "20px" }}>
      <span>
            <i className="fa fa-spinner fa-spin"/>
      </span>
    </Card>
  );

  async function processCreative() {
    try {
      if (selectedInbox?.actionState === "DELETE") {
        await creativeDeleteQuery({
          variables: {
            id: selectedInbox?.data.creative?.id,
          },
          update: (proxy, { data: { creativeDelete } }) => {
            let data: any = proxy.readQuery({
              query: creativesGet,
            });
            proxy.writeQuery({
              query: creativesGet,
              data: {
                creativesGet: [
                ...data.creativesGet.filter((creative: Creative) => creative.id !== selectedInbox.data.creative?.id),
                ],
              },
            });
          },
        });
      } else if (selectedInbox?.actionState === "SAVE") {
         await mutateConnection(
          { variables: { creativeId: selectedInbox.data.creative?.id },
            update: (proxy, { data: { connectionPut } }) => {
              let data: any = proxy.readQuery({
                query: connectionsGet,
              });
              proxy.writeQuery({
                query: connectionsGet,
                data: {
                  connectionsGet: [
                    connectionPut,
                    ...data.connectionsGet,
                  ],
                },
              });
            },
          });
      }
      setSelectedInbox(null);
    } catch (error) {
      console.log("error", error);
    }
  }

  // ================




  // Loading state
  if (isLoading && missingData)
    return <span />;
  // Error
  if (hasError)
    return <span />;
  // No data
  if (missingData)
    return <span/>;



  // Definitions
  let creativeTemplate = creativeTemplateQuery.data?.creativeTemplateGet || {};
  let user = userGetQuery.data.userGet;
  let groups: Groups[] = groupsGetQuery.data.groupsGet;
  let creatives = creativesGetQuery.data.creativesGet || [];
  let connections = connectionsGetQuery.data.connectionsGet || [];
  // Item to be populated
  let inboxData: Inbox[] = [];

  // Populate list with group invitations
  for (let group of groups) {
    let { members } = group;

    let isAdmin = group.members.some(
      ({ email, role }) => email === user.email && role === "admin",
    );

    let member = members.find(({ email }) => email === user.email) || { latestActivity: null };

    let { latestActivity } = member;

    if (!latestActivity && !isAdmin) {
      inboxData.push({
        timeStamp: group.createdAt,
        type: InboxType.GROUP,
        data: {
          groupId: group.id,
          name: group.name,
        },
      });
    }

    // for (let startup of group.startups) {
    //   if (!startup.seen) {
    //     inboxData.push({
    //       timeStamp: startup.createdAt,
    //       type: InboxType.SHARING,
    //       data: {
    //         ...startup,
    //         name: group.name,
    //         groupId: group.id,
    //         connection: startup.connection,
    //       },
    //     });
    //   }
    // }

  }

  // Populate list with web form items
  for (let creative of getUnbindedCreatives(connections, creatives)) {
    inboxData.push({
      timeStamp: new Date(),
      type: InboxType.EXTERNAL_FORM,
      data: {
        name: creative.name || "New Company",
        groupId: "",
        creative: creative,
      }
    })
  }


  inboxData = inboxData
    .sort((a, b) =>
      new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
    )
    .filter(({ type }) =>
      type !== InboxType.SHARING
    );

  let capListAt = 5;

  if (!inboxData.length) return <span/>;
  return (
    <Card label="Inbox" maxWidth={1200} style={{ paddingBottom: "20px" }}>

      {
        /*
          <div
            className={styles.mark_all}
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
                <i className="fa fa-spinner fa-spin"/>{" "}
              </span>
            )}
            mark all as seen
          </div>
        */
      }

      {
        // inbox
        inboxData
        .filter((a, i) => (expanded ? true : i < capListAt))
        .map(({ timeStamp, type, data }, i) => {
          return (
            <div key={i} className={styles.list_item}>

              {type === "GROUP" && (
                <div className={styles.group_list_item}>
                  <div className={styles.list_icon}>
                    <i className="fal fa-users"/>
                  </div>

                  <div className={styles.time_stamp}>
                    {moment(timeStamp).format("lll")}
                  </div>
                  <div>
                    You have been invited to join the group{" "}
                    <span
                      className={styles.highlight_1}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        let path = `${group_route}/${data.groupId}`;
                        history.push(path);
                      }}
                    >
                      {data.name}
                    </span>
                  </div>

                  <div
                    className={styles.mark_as_seen}
                    onClick={async () => {
                      if (loadingMark[data.groupId]) return;

                      try {
                        setLoadingMark({ [data.groupId]: true });
                        await markAsSeen({ variables: { groupId: data.groupId } });

                      } catch (error) {
                        console.error(error)
                      }

                      setLoadingMark({ [data.groupId]: false });

                    }}
                  >
                    mark as seen maaan {" "}
                    {loadingMark[data.groupId] && (
                      <i className="fa fa-spinner fa-spin"/>
                    )}
                  </div>
                </div>
              )}

              {type === "SHARING" && (
                <div className={styles.sharing_list_item}>
                  <div className={styles.list_icon}>
                    <i className="fal fa-share-alt"/>
                  </div>

                  <div className={styles.time_stamp}>
                    {moment(timeStamp).format("lll")}
                  </div>
                  <div>
                    <span className={styles.highlight_2}>{data.sharedBy}</span>
                    <span> shared </span>

                    <span
                      className={styles.highlight_1}
                      onClick={() => {
                        let path = `${group_route}/${data.groupId}/${data?.connection?.id}`;
                        history.push(path);
                      }}
                    >
                      {data?.connection?.creative.name}
                    </span>

                    <span> with the group </span>

                    <span
                      className={styles.highlight_1}
                      onClick={() => {
                        let path = `${group_route}/${data.groupId}`;
                        history.push(path);
                      }}
                    >
                      {data.name}
                    </span>
                  </div>

                  <div
                    className={styles.mark_as_seen}
                    onClick={async () => {
                      if (loadingMark[`${data?.connection?.id}-${data.sharedBy}`])
                        return;
                      let variables = {
                        groupId: data.groupId,
                        connectionId: data?.connection?.id,
                        sharedBy: data.sharedBy,
                      };
                      setLoadingMark({
                        [`${data?.connection?.id}-${data.sharedBy}`]: true,
                      });
                      markAsSeen({ variables });
                    }}
                  >
                    mark as seen{" "}
                    {loadingMark[`${data?.connection?.id}-${data.sharedBy}`] && (
                      <i className="fa fa-spinner fa-spin"/>
                    )}
                  </div>
                </div>
              )}

              {type === "EXTERNAL_FORM" && (
                <div className={styles.sharing_list_item}>
                  <div className={styles.list_icon}>
                    <i className="fal fa-inbox"/>
                  </div>

                  <div className={styles.time_stamp}>
                    {moment(timeStamp).format("lll")}
                  </div>
                  <div>
                    <span> A new startup has submitted your web form </span>

                    <span
                      onClick={() =>
                        setSelectedInbox({ actionState: "DETAILS", timeStamp, type, data })
                      }
                      className={styles.highlight_1}
                      >
                      {data.name}
                    </span>
                  </div>
                  <div className={styles.mark_as_seen}
                       onClick={() => setSelectedInbox({ actionState: "SAVE", timeStamp, type, data })}>save
                  </div>
                  <div className={styles.delete_creative}
                       onClick={() => setSelectedInbox({ actionState: "DELETE", timeStamp, type, data })}>delete
                    permanently
                  </div>
                </div>
              )}
            </div>
          );
        })}

      {
        inboxData.length > capListAt && !expanded && (
        <div onClick={() => setExpanded(true)} className={styles.list_expander}>
          <span>View {inboxData.length - capListAt} more items...</span>
        </div>
      )}

      {expanded && (
        <div onClick={() => setExpanded(false)} className={styles.list_expander}>
          <span>View less</span>
        </div>
      )}

      {selectedInbox && selectedInbox.actionState !== "DETAILS" && (
        <Modal
          title={selectedInbox.actionState === "SAVE" ? "Save Startup" : "Delete Permanently"}
          submit={() => processCreative()}
          close={() => setSelectedInbox(null)}
          loading={ creativeDeleteLoading || connectionPutLoading }
          disableFoot={false}
          key={"actionModal"}
          noKill
          showScrollBar={false}
        >
          <span>{selectedInbox.actionState === "SAVE" ? "Save " : "Do you really want to delete "}</span>
          <span className={styles.highlight_1}>{selectedInbox.data.name}</span>
          <span>?</span>
        </Modal>
      )}

      {selectedInbox && selectedInbox.actionState === "DETAILS" && (
        <Modal
          title={selectedInbox.data.name}
          close={() => setSelectedInbox(null)}
          disableFoot={false}
          key={"actionModal"}
          noKill
          loading={false}
          submit={null}
          showScrollBar={true}
          >
          <ViewSummary
            creativeTemplate={creativeTemplate}
            answers={selectedInbox.data.creative?.answers}
          />
        </Modal>
      )}

    </Card>
  );
}



