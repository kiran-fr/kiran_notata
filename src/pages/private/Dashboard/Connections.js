import React, { useState } from "react";
import moment from "moment";

// API
import { useQuery } from "@apollo/client";
import { connectionsGet, tagGroupGet } from "../../../Apollo/Queries";

// COMPONENTS
import Filters from "./Filters";

import { startup_page } from "../../definitions";

import {
  Button,
  Table,
  Card,
  Tag,
  GhostLoader,
} from "../../../Components/elements";

import {
  list_star,
  average_score,
  date_style,
  void_list,
  void_list_label,
  void_list_icon,
  pre_space,
} from "./Connections.module.css";

function applyFilters({ connections, filters }) {
  if (filters.search && filters.search.length !== 0) {
    let search = filters.search.toLowerCase();
    connections = connections.filter(({ creative }) =>
      creative.name.toLowerCase().includes(search)
    );
  }

  if (filters.tags.length) {
    connections = connections.filter(({ tags }) =>
      filters.tags.every(ft => tags.map(({ id }) => id).includes(ft.id))
    );
  }

  return connections;
}

export default function Connections({ history }) {
  const defaultFilters = {
    search: "",
    tags: [],
  };

  const [filters, setFilters] = useState(defaultFilters);

  const connectionsQuery = useQuery(connectionsGet);
  const { data, loading, error } = connectionsQuery;

  const tagGroupsQuery = useQuery(tagGroupGet);
  const tagGroups =
    (tagGroupsQuery.data && tagGroupsQuery.data.accountGet.tagGroups) || [];

  if (error) console.log("error", error);

  if (error || tagGroupsQuery.error) return <div>We are updating </div>;
  if (!data && loading) return <GhostLoader />;
  if (!tagGroupsQuery.data && tagGroupsQuery.loading) return <GhostLoader />;

  let connections = data.connectionsGet;

  connections = applyFilters({ connections, filters });

  const columns = [
    {
      title: "",
      dataIndex: "star",
      key: "star",
      width: 20,
      className: list_star,
      render: () => <i className="fal fa-star" />,
    },

    {
      title: "Company name",
      // dataIndex: "creative",
      key: "creative",
      render: connection => {
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              history.push(`${startup_page}/${connection.id}`);
            }}
          >
            {connection.creative.name}
          </span>
        );
      },
    },

    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      responsive: "md",
      render: tags => {
        if (!tags.length) {
          return <span style={{ color: "#DADEE2" }}>n/a</span>;
        }
        return tags.map(({ name, id }) => <Tag key={id}>{name}</Tag>);
      },
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
          score: a.score + b.score,
        }));
        let avg = (ttl / scores.length).toFixed(1);

        return (
          <div className={average_score}>
            <span>{avg}</span>
          </div>
        );
      },
    },

    {
      title: "Last updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      responsive: "lg",
      className: pre_space,
      render: date => (
        <span className={date_style}>{moment(date).format("ll")}</span>
      ),
    },

    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: 30,
      render: id => (
        <Button
          type="right_arrow"
          size="small"
          onClick={() => {
            history.push(`${startup_page}/${id}`);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card maxWidth={1200}>
        <Filters
          setFilters={setFilters}
          filters={filters}
          tagGroups={tagGroups}
        />

        {!connections.length && (
          <div className={void_list}>
            <div className={void_list_label}>No results to show</div>
            <div className={void_list_icon}>
              <i className="fal fa-ghost" />
            </div>
          </div>
        )}

        <Table
          dataSource={connections || []}
          columns={columns}
          diableHead={true}
          pagination={false}
          loading={loading}
        />
      </Card>
    </>
  );
}
