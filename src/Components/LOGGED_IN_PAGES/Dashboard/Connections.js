import React from "react";

// RESOURCES
import moment from "moment";

// API
import { useQuery } from "@apollo/client";
import { connectionsGet } from "../../../Apollo/Queries";

// COMPONENTS
import { GhostLoader } from "../../elements/GhostLoader";
import { Card, List, Button, Table, Tag } from "antd";

// STYLES
import classnames from "classnames";

import {
  list_star,
  ant_tag,
  average_score
} from "../../elements/Ant.module.css";

const ComposedComponent = ({ createdConnection }) => {
  const connectionsQuery = useQuery(connectionsGet, {
    notifyOnNetworkStatusChange: true
  });

  const loading = connectionsQuery.loading; // || userQuery.loading;
  const error = connectionsQuery.error; // || userQuery.error;

  if (error) console.log("error", error);
  if (error) return <div>We are updating </div>;

  let connections = [];

  if (!error && !loading) {
    connections = connectionsQuery.data.connectionsGet;
  }

  const columns = [
    {
      title: "",
      dataIndex: "star",
      key: "star",
      width: 20,
      className: list_star,
      render: () => <i className="fal fa-star" style={{ color: "#DADEE2" }} />
    },

    {
      title: "Company name",
      dataIndex: "creative",
      key: "creative",
      render: creative => creative.name
    },

    {
      title: "Stage",
      dataIndex: "funnelTags",
      key: "funnelTags",
      responsive: ["sm"],
      render: funnelTags => (
        <>
          {["funnel tag"].map(tag => (
            <Tag className={ant_tag} key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      )
    },

    {
      title: "Source of Dealflow",
      dataIndex: "tags",
      key: "tags",
      responsive: ["md"],
      render: tags => (
        <>
          {["dummy tag"].map(tag => (
            <Tag className={ant_tag} border={false} key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      )
    },

    {
      title: "Subjective score",
      dataIndex: "subjectiveScores",
      key: "subjectiveScores",
      responsive: ["md"],
      render: scores => {
        if (!scores || !scores.length) {
          return <span style={{ color: "#DADEE2" }}>n/a</span>;
        }

        let { score: ttl } = scores.reduce((a, b) => ({
          score: a.score + b.score
        }));
        let avg = (ttl / scores.length).toFixed(1);

        return (
          <div className={average_score}>
            <span>{avg}</span>
          </div>
        );
      }
    },

    {
      title: "Last updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      responsive: ["lg"],
      render: date => (
        <span
          style={{
            color: "#A0A8B1",
            fontWeight: "300"
          }}
        >
          {moment(date).format("ll")}
        </span>
      )
    },

    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: 30,
      render: id => (
        <Button type="link" size="small">
          <i className="fal fa-chevron-right" />
        </Button>
      )
    }
  ];

  return (
    <Card
      style={{
        borderRadius: "10px",
        overflow: "hidden"
      }}
      bodyStyle={{
        padding: "0px"
      }}
    >
      <Table
        dataSource={connections}
        columns={columns}
        // showHeader={false}
        pagination={false}
        loading={loading}
      />
    </Card>
  );
};

export default ComposedComponent;
