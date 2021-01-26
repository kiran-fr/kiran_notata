import * as React from "react";
import { startup_page } from "pages/definitions";
import { Tag } from "Components/elements";
import {
  Connection,
  highestFunnelTagIndex,
  subjectiveScore,
  tagCount,
} from "pages/private/Dashboard/Connections/types";

import styles from "../Connections.module.css";
import tableStyles from "Components/elements/NotataComponents/Table.module.css";

import moment from "moment";
import { History } from "history";

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
}) => {
  const gotoStartup = (connection: Connection) => {
    history.push(`${startup_page}/${connection.id}`, {
      rightMenu: true,
    });
  };

  return [
    {
      title: "",
      key: "starred",
      width: 50,
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
          fontWeight:
            connection.starred && ("var(--font-weight-bold)" as "bold"),
        } as React.CSSProperties;

        return (
          <div style={_style} className={styles.company_name}>
            <div
              onClick={() => gotoStartup(connection)}
              className={tableStyles.background_clicker}
            />

            <div
              onClick={() => gotoStartup(connection)}
              className={styles.actual_content}
            >
              {connection.creative.name}
            </div>
          </div>
        );
      },
    },
    {
      title: "Funnels",
      // dataIndex: "funnelTags",
      key: "tags",
      responsive: "sm",
      valueExpr: (connection: Connection) =>
        highestFunnelTagIndex(connection.funnelTags),
      render: (connection: Connection) => {
        let { funnelTags } = connection;

        let tag;
        if (funnelTags.length) {
          let highest = funnelTags.reduce(
            (max, tag) => (tag.index > max ? tag.index : max),
            funnelTags[0].index
          );
          tag = funnelTags.find(({ index }) => index === highest);
        }

        return (
          <div>
            <div
              onClick={() => gotoStartup(connection)}
              className={tableStyles.background_clicker}
            />

            <div className={styles.actual_content}>
              {(!funnelTags.length && (
                <span style={{ color: "#DADEE2" }}>n/a</span>
              )) || (
                <Tag
                  className={styles.funnel_tag}
                  active={false}
                  isButton={false}
                  onClick={() => {}}
                  kill={false}
                >
                  {tag?.name}
                </Tag>
              )}
            </div>
          </div>
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
        <div>
          <div
            onClick={() => gotoStartup(connection)}
            className={tableStyles.background_clicker}
          />

          <div className={styles.actual_content}>
            {(connection.tags || []).slice(0, 3).map(({ name, id }) => (
              <Tag
                key={id}
                isButton={false}
                active={false}
                className={""}
                onClick={() => {}}
                kill={false}
              >
                {name}
              </Tag>
            ))}

            <Tag
              isButton={true}
              active={false}
              className={""}
              kill={false}
              onClick={() => {
                setShowTagGroup(connection.id);
              }}
            >
              +
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Subjective score",
      key: "subjectiveScores",
      responsive: "sm",
      type: "number",
      valueExpr: (connection: Connection) => subjectiveScore(connection) || 0,
      render: (connection: Connection) => {
        let avg = subjectiveScore(connection);
        return (
          <div>
            <div
              onClick={() => gotoStartup(connection)}
              className={tableStyles.background_clicker}
            />

            <div className={styles.actual_content}>
              {avg && (
                <div className={styles.average_score}>
                  <span>{avg}</span>
                </div>
              )}

              {/*{!avg && <span style={{ color: "#DADEE2" }}>n/a</span>}*/}

              {!avg && (
                <Tag
                  isButton={true}
                  active={false}
                  className={""}
                  onClick={() => {
                    setShowEvaluate(connection.id);
                  }}
                  kill={false}
                >
                  +
                </Tag>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Updated",
      key: "updatedAt",
      responsive: "lg",
      className: styles.pre_space,
      type: "date",
      render: (connection: Connection) => {
        return (
          <div>
            <div
              onClick={() => gotoStartup(connection)}
              className={tableStyles.background_clicker}
            />
            <div className={styles.actual_content}>
              <span className={styles.date_style}>
                {moment(connection.updatedAt).format("ll")}
              </span>
            </div>
          </div>
        );
      },
    },
  ];
};
