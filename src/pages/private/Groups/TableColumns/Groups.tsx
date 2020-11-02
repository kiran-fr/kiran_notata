import React from "react";

import {
  groupsGet,
  GroupsType as Groups,
  UserType as User,
} from "Apollo/Queries";
import { group } from "pages/definitions";

import { Button } from "Components/elements";
import { History } from "history";

export default ({
  history,
  mutate,
  user,
  groups,
  groupPutLoading,
}: {
  history: History;
  mutate: Function;
  user: User | undefined;
  groups: Groups[] | undefined;
  groupPutLoading: any;
}) => [
  {
    title: "",
    key: "delete",
    width: 20,
    className: "delete_bucket",
    render: (group: Groups) => {
      let isAdmin = group.members.some(
        ({ email, role }) => email === user?.email && role === "admin"
      );

      if (!isAdmin) return <span />;

      if (groupPutLoading) return <i className="fa fa-spinner fa-spin" />;

      return (
        <i
          className="fal fa-trash-alt"
          onClick={() => {
            let variables = {
              id: group.id,
              input: { deleteGroup: true },
            };
            mutate({
              variables,
              update: (proxy: any) => {
                const data = proxy.readQuery({
                  query: groupsGet,
                });
                proxy.writeQuery({
                  query: groupsGet,
                  data: {
                    groupsGet: data.groupsGet.filter((g: any) => g.id !== group.id),
                  },
                });
              },
            });
          }}
        />
      );
    },
  },
  {
    title: "Group name",
    dataIndex: "id",
    key: "name",
    render: (id: string) => {
      let gr = groups?.find(g => g.id === id);
      let { name, members, startups } = gr || {};

      let isAdmin = gr?.members.some(
        ({ email, role }) => email === user?.email && role === "admin"
      );

      let settings = gr?.settings;
      let startupLength = [
        ...new Set(startups?.map(({ creativeId }) => creativeId)),
      ].length;
      let member = members?.find(({ email }) => email === user?.email);
      let { latestActivity } = member || {};

      return (
        <span>
          {(!latestActivity && (
            <div
              style={{
                fontWeight: "var(--font-weight-bold)" as "bold",
              }}
            >
              {name}
            </div>
          )) || <div>{name}</div>}

          <div style={{ opacity: 0.5, fontSize: "12px" }}>
            {(isAdmin || settings?.showUsers) && (
              <>{(members || []).length} members - </>
            )}
            {startupLength} startups
          </div>
        </span>
      );
    },
  },
  {
    title: "",
    dataIndex: "id",
    key: "id",
    width: 30,
    render: (id: string) => (
      <Button
        // type="tiny_right"
        type="right_arrow"
        size="small"
        onClick={() => {
          let path = `${group}/${id}`;
          history.push(path);
        }}
      >
        View
      </Button>
    ),
  },
];
