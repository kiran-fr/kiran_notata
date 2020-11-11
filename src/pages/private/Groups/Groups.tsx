import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import {
  groupsGet,
  userGet,
  // groupGetListOfStartups,
  GroupsType,
  UserType as User,
} from "Apollo/Queries";
import { groupPut } from "Apollo/Mutations";

import CreateNewGroup from "./CreateGroup";
import { group } from "pages/definitions";

import {
  Content,
  Card,
  Table,
  Button,
  Modal,
  BreadCrumbs,
  GhostLoader,
} from "Components/elements";
import groupsColumns from "./TableColumns/Groups";

interface UserData {
  userGet: User;
}

export interface GroupsData {
  groupsGet: GroupsType[];
}


export default function Groups({
                                 history, showModalOnly,
                                 showModalState,
                               }: { history: any, showModalOnly?: boolean, showModalState?: boolean }) {
  const [showModal, setShowModal] = useState(showModalState);

  const [mutate, { loading: groupPutLoading }] = useMutation(groupPut);
  const { data, loading, error } = useQuery<GroupsData>(groupsGet);
  const userQuery = useQuery<UserData>(userGet);

  useEffect(() => {
    setShowModal(showModalState);
  }, [showModalState]);

  let user = userQuery.data?.userGet;

  if (error) {
    console.log("error", error);
    return <div>We are updating </div>;
  }

  if (!data && loading && !showModalOnly) return <GhostLoader/>;

  let groups = data?.groupsGet;

  const columns = groupsColumns({
    history,
    mutate,
    user,
    groups,
    groupPutLoading,
  });

  return (
    <>
      {!showModalOnly && (
        <>
        <BreadCrumbs
          list={[
            {
              val: "All Groups",
              link: group,
            },
          ]}
        />

        <Content maxWidth={600}>
          <h1>Groups</h1>
          {!!groups?.length && (
            <Card
              style={{ paddingTop: "5px" }}
            >
              <Table
                dataSource={groups}
                columns={columns}
                loading={loading}
                disableHead={true}
                cell_content={""}
                noMargin={false}
              />
            </Card>
          )}

          {!groups?.length && (
            <Card style={{ paddingBottom: "20px" }}>
              <div style={{ fontSize: "18px" }}>
                You don't have any groups yet
              </div>
              <div
                style={{
                  padding: "20px 0px",
                  color: "var(--color-gray-medium)",
                }}
              >
                This is your sharing space. When other ivestors share startups
                with you they will appear here. You can also create a group to
                share your startups with other investors in your network. You will
                be able to choose what data you want to share.
              </div>
            </Card>
          )}

          <div style={{ marginTop: "20px" }}>
            <Button
              onClick={() => setShowModal(true)}
              type="right_arrow"
              size="large"
            >
              Create New Group
            </Button>
          </div>
        </Content>
      </>
      )}
      {showModal && (
        <Modal
          title="New Group"
          close={() => setShowModal(false)}
          disableFoot={true}
          loading={false}
          showScrollBar={false}
        >
          <CreateNewGroup
            mutate={mutate}
            setDone={(id: any) => {
              let path = `${group}/${id}`;
              history.push(path);
            }}
          />
        </Modal>
      )}
    </>
  );
}
