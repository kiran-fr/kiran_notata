import React from "react";
import classnames from "classnames";

import {
  container,
  content,
  responsive_sm,
  responsive_md,
  responsive_lg,
  no_margin,
  no_head
} from "./Table.module.css";

let responsive_map = {
  sm: responsive_sm,
  md: responsive_md,
  lg: responsive_lg
};

export const Table = ({
  dataSource,
  columns,
  cell_content,
  loading,
  diableHead,
  noMargin
}) => {
  return (
    <table
      className={classnames(
        container,
        diableHead && no_head,
        noMargin && no_margin
      )}
    >
      {!diableHead && (
        <thead>
          <tr>
            {columns.map((c, i) => {
              return (
                <td
                  key={`head-${i}`}
                  style={{ width: c.width ? `${c.width}px` : "auto" }}
                  className={classnames(
                    c.responsive && responsive_map[c.responsive]
                  )}
                >
                  <div
                    className={classnames(
                      c.className && c.className,
                      cell_content
                    )}
                    style={{
                      textAlign: c.centered ? "center" : "left"
                    }}
                  >
                    {c.title}
                  </div>
                </td>
              );
            })}
          </tr>
        </thead>
      )}

      <tbody>
        {dataSource.map((d, i) => (
          <tr key={i}>
            {columns.map((c, ii) => (
              <td
                key={`${i}-${ii}`}
                style={{ width: c.width ? `${c.width}px` : "auto" }}
                className={classnames(
                  c.responsive && responsive_map[c.responsive]
                )}
              >
                <div
                  className={classnames(
                    c.className && c.className,
                    cell_content
                  )}
                  style={{
                    textAlign: c.centered ? "center" : "left"
                  }}
                >
                  {c.render(d[c.dataIndex])}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
