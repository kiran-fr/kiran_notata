import * as React from "react";
import { startup_page } from "pages/definitions";
import { Button, Tag } from "Components/elements";
import {
  Connection,
  FunnelTag,
  highestFunnelTagIndex,
  subjectiveScore,
  tagCount,
} from "pages/private/Dashboard/Connections/types";

import styles from "../Connections.module.css";

import moment from "moment";
import { History } from "history";

import connectionGet from "Apollo/Queries/connectionGet";

export default ({
  history,
  setStar,
  setShowTagGroup,
  setShowEvaluate,
}: {
  history: History;
  setStar: Function;
  setShowTagGroup: Function;
  setShowEvaluate: Function;
}) => [
  {
    title: "",
    key: "starred",
    width: 20,
    className: styles.list_star,
    allowSorting: false,

    render: (connection: Connection) => {
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
    key: "creative.name",
    className: styles.max_width_200,
    type: "string",
    render: (connection: Connection) => {
      let _style: React.CSSProperties = {
        cursor: "pointer",
        fontWeight: connection.starred && ("var(--font-weight-bold)" as "bold"),
      } as React.CSSProperties;

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
    valueExpr: (connection: Connection) => highestFunnelTagIndex(connection.funnelTags),
    render: (funnelTags: FunnelTag[]) => {
      if (!funnelTags.length) {
        return <span style={{ color: "#DADEE2" }}>n/a</span>;
      }
      let highest = funnelTags.reduce(
        (max, tag) => (tag.index > max ? tag.index : max),
        funnelTags[0].index,
      );
      let tag = funnelTags.find(({ index }) => index === highest);
      return (
        <Tag className={styles.funnel_tag} active={false} isButton={false}>
          {tag?.name}
        </Tag>
      );
    },
  },
  {
    title: "Tags",
    // dataIndex: "tags",
    key: "tags",
    responsive: "md",
    valueExpr: (connection: Connection) => tagCount(connection.tags),
    render: (connection: Connection) => (
      <span>
        <span
          style={{
            color: "var(--color-primary)",
            cursor: "pointer",
          }}
          onClick={() => {
            setShowTagGroup(connection.id);
          }}
        >
          <i className="fal fa-tag" />
        </span>

        {(connection.tags || []).slice(0, 3).map(({ name, id }) => (
          <Tag key={id} isButton={false} active={false} className={""}>
            {name}
          </Tag>
        ))}
      </span>
    ),
  },
  {
    title: "Subjective score",
    // dataIndex: "subjectiveScores",
    key: "subjectiveScores",
    responsive: "sm",
    type: "number",
    width: 156,
    valueExpr: (connection: Connection) => subjectiveScore(connection) || 0,
    render: (connection: Connection) => {
      let avg = subjectiveScore(connection);
      return (
        <div
          onClick={() => {
            setShowEvaluate(connection.id);
          }}
        >
          {avg && (
            <div className={styles.average_score}>
              <span>{avg}</span>
            </div>
          )}

          {!avg && <span style={{ color: "#DADEE2" }}>n/a</span>}
        </div>
      );
    },
  },
  {
    title: "Last updated",
    dataIndex: "updatedAt",
    key: "updatedAt",
    responsive: "lg",
    className: styles.pre_space,
    type: "date",
    render: (date: string) => (
      <span className={styles.date_style}>{moment(date).format("ll")}</span>
    ),
  },
  {
    title: "",
    dataIndex: "id",
    key: "id",
    width: 30,
    allowSorting: false,

    render: (id: string) => (
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
