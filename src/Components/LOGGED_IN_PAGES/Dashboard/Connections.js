import React from "react";

// RESOURCES
import moment from "moment";

// API
import { useQuery } from "@apollo/client";
import { connectionsGet } from "../../../Apollo/Queries";
import { startup_page } from "../../../routes";

// COMPONENTS
import { GhostLoader } from "../../elements/GhostLoader";

import { Button, Table, Card, Tag } from "../../elements/NotataComponents/";

// STYLES
import classnames from "classnames";

import { list_star, average_score, date_style } from "./Connections.module.css";

export default function Connections({ history }) {
  const connectionsQuery = useQuery(connectionsGet);

  const loading = connectionsQuery.loading;
  const error = connectionsQuery.error;

  if (error) console.log("error", error);
  if (error) return <div>We are updating </div>;

  let connections;
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
      render: () => <i className="fal fa-star" />
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
      responsive: "sm",
      render: funnelTags => (
        <>
          {["funnel tag"].map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      )
    },

    {
      title: "Source of Dealflow",
      dataIndex: "tags",
      key: "tags",
      responsive: "md",
      render: tags => (
        <>
          {["dummy tag"].map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      )
    },

    {
      title: "Subjective score",
      dataIndex: "subjectiveScores",
      key: "subjectiveScores",
      responsive: "sm",
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
      responsive: "lg",
      render: date => (
        <span className={date_style}>{moment(date).format("ll")}</span>
      )
    },

    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: 30,
      render: id => (
        <Button
          type="tiny_right"
          onClick={() => {
            history.push(`${startup_page}/${id}`);
          }}
        />
      )
    }
  ];

  return (
    <Card maxWidth={1200}>
      <Table
        dataSource={connections || []}
        columns={columns}
        pagination={false}
        loading={loading}
      />
    </Card>
  );
}
