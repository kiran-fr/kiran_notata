import React, { useState } from "react";
import moment from "moment";

// API
import { useQuery, useMutation } from "@apollo/client";
import { connectionsGet, tagGroupGet } from "../../../Apollo/Queries";
import { connectionSetStar } from "../../../Apollo/Mutations";

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
  max_width_200,
  funnel_tag,
} from "./Connections.module.css";

function applyFilters({ connections, filters }) {
  if (filters.search && filters.search.length !== 0) {
    let firstTwo = filters.search.slice(0, 2);

    if (firstTwo === ":f") {
      let [, funnelName] = filters.search.split(" ");

      if (!funnelName) {
        connections = connections.filter(({ funnelTags }) => funnelTags.length);
      }

      if (funnelName) {
        connections = connections.filter(({ funnelTags }) => {
          let containsTag = funnelTags.find(({ name }) =>
            name.toLowerCase().includes((funnelName || "").toLowerCase())
          );

          if (!containsTag) return false;

          if (containsTag) {
            let highest = funnelTags.reduce(
              (max, tag) => (tag.index > max ? tag.index : max),
              funnelTags[0].index
            );
            return containsTag.index >= highest;
          }
          return false;
        });
      }
    }

    if (firstTwo === ":t") {
      let [, tagName] = filters.search.split(" ");
      connections = connections.filter(({ tags }) =>
        tags.some(({ name }) =>
          name.toLowerCase().includes((tagName || "").toLowerCase())
        )
      );
    }

    if (firstTwo !== ":f" && firstTwo !== ":t") {
      let search = filters.search.toLowerCase();
      connections = connections.filter(({ creative }) =>
        creative.name.toLowerCase().includes(search)
      );
    }
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
  const [setStar] = useMutation(connectionSetStar);

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
      key: "starred",
      width: 20,
      className: list_star,
      render: connection => {
        const { starred, id } = connection;
        return (
          <div
            onClick={() => {
              setStar({
                variables: { id },
                optimisticResponse: {
                  __typename: "Mutation",
                  connectionSetStar: {
                    ...connection,
                    starred: !starred,
                  },
                },
              });
            }}
          >
            {(!starred && <i className="fal fa-star" />) || (
              <i
                className="fas fa-star"
                style={{ color: "var(--color-orange)" }}
              />
            )}
          </div>
        );
      },
    },

    {
      title: "Company name",
      key: "creative",
      className: max_width_200,
      render: connection => {
        let _style = {
          cursor: "pointer",
        };

        if (connection.starred) {
          _style.fontWeight = "var(--font-weight-bold)";
        }

        return (
          <span
            style={_style}
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
      title: "Funnels",
      dataIndex: "funnelTags",
      key: "tags",
      responsive: "sm",
      render: funnelTags => {
        if (!funnelTags.length) {
          return <span style={{ color: "#DADEE2" }}>n/a</span>;
        }
        let highest = funnelTags.reduce(
          (max, tag) => (tag.index > max ? tag.index : max),
          funnelTags[0].index
        );
        let tag = funnelTags.find(({ index }) => index === highest);
        return <Tag className={funnel_tag}>{tag.name}</Tag>;
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
        return tags
          .slice(0, 3)
          .map(({ name, id }) => <Tag key={id}>{name}</Tag>);
      },
    },

    {
      title: "Subjective score",
      dataIndex: "subjectiveScores",
      key: "subjectiveScores",
      responsive: "sm",
      render: scores => {
        if (!scores || !scores.length) {
          return <span />;
          // return <span style={{ color: "#DADEE2" }}>n/a</span>;
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
