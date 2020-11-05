import React from "react";

import { Content, Card, Table } from "Components/elements";

import {
  profile,
  tags,
  team,
  templates,
  external_form,
} from "pages/definitions";

const Comp = ({ history }) => {
  const linkList = [
    {
      label: "Evaluation templates",
      iconClass: "fal fa-copy",
      link: templates,
    },
    {
      label: "Tags & Funnels",
      iconClass: "fal fa-tag",
      link: tags,
    },

    {
      label: "User profile",
      iconClass: "fal fa-user",
      link: profile,
    },
    {
      label: "Your team",
      iconClass: "fal fa-users",
      link: team,
    },
    {
      label: "Web Form",
      iconClass: "fal fa-inbox",
      link: external_form,
    },
  ];

  const columns = [
    {
      title: "Icon",
      key: "icon",
      width: 20,
      // className: list_star,
      render: listItem => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => history.push(listItem.link)}
          >
            <i className={listItem.iconClass} />
          </div>
        );
      },
    },

    {
      title: "Link name",
      key: "link name",
      render: listItem => {
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => history.push(listItem.link)}
          >
            {listItem.label}
          </span>
        );
      },
    },
  ];

  return (
    <Content maxWidth={600}>
      <h1>Settings</h1>

      <Card style={{ paddingTop: "5px" }}>
        <Table
          dataSource={linkList}
          columns={columns}
          disableHead={true}
          pagination={false}
        />
      </Card>
    </Content>
  );
};

export default Comp;
