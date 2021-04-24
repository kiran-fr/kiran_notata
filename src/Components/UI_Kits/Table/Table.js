import React, { useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import styles from "./Table.module.css";
const classnames = require("classnames");

let responsive_map = {
  sm: styles.responsive_sm,
  md: styles.responsive_md,
  lg: styles.responsive_lg,
};

const DataType = {
  DATE: "date",
  NUMBER: "number",
  STRING: "string",
  BOOLEAN: "boolean",
};

const SortType = {
  NONE: "none",
  ASC: "asc",
  DESC: "desc",
};

const sortValues = {
  0: SortType.NONE,
  1: SortType.ASC,
  2: SortType.DESC,
};

export const Tables = ({
  dataSource,
  columns,
  cell_content,
  loading,
  disableHead,
  noMargin,
  paginateAt,
  allowSorting,
  emptyLabel,
}) => {
  const [sort, setSort] = React.useState(new Map());

  let [dataSourceProcessed, setDataSourceProcessed] = React.useState([]);

  useEffect(() => {
    const sortKey = [...sort]
      .filter(([key, val]) => val === SortType.ASC || val === SortType.DESC)
      .map(([key, val]) => key)[0];
    if (sortKey == null) {
      const sortMap = sort;
      columns.forEach((column, index) => {
        if (allowSorting && column.allowSorting !== false) {
          sortMap.set(index, SortType.NONE);
        }
        setSort(sort);
      });
      setDataSourceProcessed(dataSource);
    } else {
      applySorting(sortKey);
    }
  }, [dataSource]);

  const setNextSortValue = index => {
    const currentValue = sort.get(index);
    const currentIndex = Object.values(sortValues).indexOf(
      currentValue || SortType.NONE
    );
    sort.forEach((value, key) => {
      sort.set(key, SortType.NONE);
    });
    currentIndex < 2
      ? sort.set(index, sortValues[currentIndex + 1])
      : sort.set(index, SortType.NONE);
    setSort(new Map(sort));
    applySorting(index);
  };

  function applySorting(index) {
    const columnSettings = columns[index];
    const dataType = columnSettings?.type;
    const sortingField = columns[index].key ? columns[index].key : "";
    const sortValue = sort.get(index) || SortType.NONE;

    if (sortValue && sortValue !== SortType.NONE) {
      if (sortingField && !columnSettings.valueExpr) {
        switch (dataType) {
          case DataType.STRING:
            dataSourceProcessed = dataSource
              .slice()
              .sort((a, b) =>
                sortValue === SortType.ASC
                  ? resolveField(sortingField, a).localeCompare(
                      resolveField(sortingField, b)
                    )
                  : resolveField(sortingField, b).localeCompare(
                      resolveField(sortingField, a)
                    )
              );
            break;
          case DataType.DATE:
            dataSourceProcessed = dataSource
              .slice()
              .sort((a, b) =>
                sortValue === SortType.ASC
                  ? new Date(resolveField(sortingField, b)).getTime() -
                    new Date(resolveField(sortingField, a)).getTime()
                  : new Date(resolveField(sortingField, a)).getTime() -
                    new Date(resolveField(sortingField, b)).getTime()
              );
            break;
          case DataType.BOOLEAN || DataType.NUMBER:
            dataSourceProcessed = dataSource
              .slice()
              .sort((a, b) =>
                sortValue === SortType.ASC
                  ? resolveField(sortingField, b) -
                    resolveField(sortingField, a)
                  : resolveField(sortingField, a) -
                    resolveField(sortingField, b)
              );
            break;
        }
      } else if (columnSettings.valueExpr) {
        dataSourceProcessed = dataSource
          .slice()
          .sort((a, b) =>
            sortValue === SortType.ASC
              ? columnSettings.valueExpr(b) - columnSettings.valueExpr(a)
              : columnSettings.valueExpr(a) - columnSettings.valueExpr(b)
          );
      }
    } else {
      dataSourceProcessed = dataSource.slice();
    }
    setDataSourceProcessed(dataSourceProcessed);
  }

  function resolveField(field, obj) {
    return field.split(".").reduce((p, c) => p?.[c], obj);
  }

  // endregion

  return (
    <div>
      <TableContainer component={Paper}>
        <Table
          className={classnames(
            styles.container,
            disableHead && styles.no_head,
            noMargin && styles.no_margin
          )}
          aria-label="simple table"
        >
          <TableHead>
            {!disableHead && (
              <TableRow>
                {columns.map((c, i) => {
                  return (
                    <TableCell
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
                          textAlign: c.centered ? "center" : "left",
                        }}
                      >
                        <span>{c.title}</span>
                        <span
                          className={styles.sort_icon}
                          onClick={() => setNextSortValue(i)}
                        >
                          <i
                            // style={{opacity: sort.get(i) === SortType.NONE ? 0.5 : 1}}
                            className={classnames({
                              "fal fa-sort-alt": sort.get(i) === SortType.NONE,
                              "fal fa-sort-amount-down":
                                sort.get(i) === SortType.ASC,
                              "fal fa-sort-amount-up":
                                sort.get(i) === SortType.DESC,
                            })}
                          />
                        </span>
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {dataSourceProcessed.map((d, i) => (
              <TableRow
                key={`t-${i}`}
                // onClick={() => rowLinkFn(d)}
              >
                {columns.map((c, ii) => {
                  return (
                    <TableCell
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
                          textAlign: c.centered ? "center" : "left",
                        }}
                      >
                        {c.render(c.dataIndex ? d[c.dataIndex] : d, i)}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {loading && (
        <div className={styles.loader}>
          <i className={"fa fa-spinner fa-spin"} />
        </div>
      )}

      {!dataSourceProcessed.length && (
        <div className={styles.empty_list}>
          {emptyLabel || "This list is empty"}
        </div>
      )}
    </div>
  );
};
