import * as React from "react";
import { startup_page } from "pages/definitions";
import { Button, Tag } from "Components/elements";
import {
  Connection,
  FunnelTag,
  SubjectiveScore,
} from "pages/private/Dashboard/Connections/types";

// import {
//   list_star,
//   average_score,
//   date_style,
//   pre_space,
//   max_width_200,
//   funnel_tag,
// } from "../Connections.module.css";

import styles from "../Connections.module.css";

import moment from "moment";
import { History } from "history";
// var styles = require("../Connections.module.css");

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
    key: "creative",
    className: styles.max_width_200,
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
    render: (funnelTags: FunnelTag[]) => {
      if (!funnelTags.length) {
        return <span style={{ color: "#DADEE2" }}>n/a</span>;
      }
      let highest = funnelTags.reduce(
        (max, tag) => (tag.index > max ? tag.index : max),
        funnelTags[0].index
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
    render: (connection: Connection) => {
      let scores = connection.subjectiveScores;

      let avg;
      if (scores?.length) {
        let { score: ttl } = scores.reduce(
          (a, b) =>
            ({
              score: a.score + b.score,
            } as SubjectiveScore)
        );
        avg = (ttl / scores.length).toFixed(1);
      }

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
    render: (date: string) => (
      <span className={styles.date_style}>{moment(date).format("ll")}</span>
    ),
  },
  {
    title: "",
    dataIndex: "id",
    key: "id",
    width: 30,
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
