import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styles from "./Kanban.module.css";
import { useQuery, useMutation } from "@apollo/client";
import {
  accountGet as accountGetData,
  connectionsGet,
} from "private/Apollo/Queries";

import {
  Loader
} from "Components/UI_Kits";

import { connectionFunnelTagAdd } from "private/Apollo/Mutations";
import { appsyncClient } from "../../../awsconfig";

// common dynamic funnel img function

import { DynamicIcons, sortArr } from "../CommonFunctions";

// Components
import BoardHeader from "./Components/BoardHeader";
import BoardItem from "./Components/BoardItem";

const onDragEnd = (result, columns, setColumns, updateFunnelTag) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    updateFunnelTag(destColumn.id, result.draggableId);
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

export const Kanban = props => {
  const [filters, setFilter] = useState({});
  const [columns, setColumns] = useState({});
  const [getConnections, setGetConnections] = useState(false);
  const [loadingAPI, setLoadingAPI] = useState(true);
  const [sortLoad, setSortLoad] = useState(false);
  const [funnelGroupIndex, setFunnelGroupIndex] = useState(0);

  const { data: accountGet, loading, error } = useQuery(accountGetData);

  useEffect(() => {
    setFunnelGroupIndex(props.selectedfunnelGroup);
  }, [props.selectedfunnelGroup]);

  let response =
    accountGet?.accountGet?.funnelGroups?.[funnelGroupIndex].funnelTags;

  // Mutation updating funnel tag for connection
  const [mutate] = useMutation(connectionFunnelTagAdd);

  useEffect(() => {
    if (getConnections) {
      handleFunnels(columns);
    }
  }, [getConnections]);

  useEffect(() => {
    if (filters.sortDirection) {
      let sortingcolumns = columns[filters.indexNumber];
      setSortLoad(filters.indexNumber);
      handleFunnels(
        { sortingcolumns },
        filters.sortBy,
        filters.sortDirection,
        filters.indexNumber
      );
    }
  }, [filters && filters.sortDirection, filters && filters.sortBy]);

  const handleFunnels = (dataVal, sortBy, sortDirection, sortingIndex) => {
    let columnsCopy = [];
    let columnsSortObj = {};

    let apiPromise = Object.keys(dataVal).map((key, ind) => {
      return appsyncClient
        .query({
          query: connectionsGet,
          variables: {
            filters: sortBy
              ? {
                  sortBy: sortBy,
                  sortDirection: sortDirection,
                  funnelTag: dataVal[key].id,
                }
              : { funnelTag: dataVal[key].id },
          },
        })
        .then(result => {
          let columnUpdatedObj = Object.assign({}, dataVal[key], {
            items: result?.data?.connectionsGet || [],
          });
          if (sortingIndex || sortingIndex === 0) {
            columnsSortObj = columnUpdatedObj;
          } else {
            columnsCopy.push(columnUpdatedObj);
          }
        });
    });

    Promise.all(apiPromise).then(response => {
      setLoadingAPI(false);
      if (sortBy) {
        const removeCoulmn = columns;
        delete columns[sortingIndex];
        removeCoulmn[sortingIndex] = columnsSortObj;
        setColumns(removeCoulmn);
        setSortLoad(false);
      } else {
        setColumns({ ...columnsCopy });
      }
    });
  };

  useEffect(() => {
    if (loading === false && accountGet) {
      const indexSort = sortArr(response);
      setColumns({ ...indexSort });
      setGetConnections(true);
    }
  }, [loading, accountGet, funnelGroupIndex]);

  const updateFunnelTag = (funnelTagId, connectionId) => {
    const variables = {
      connectionId,
      funnelTagId,
    };
    mutate({
      variables,
    });
  };

  if (!accountGet || loadingAPI) {
    return <Loader size="medium" />;
  }

  return (
    <div className={styles.boardHolder}>
      <DragDropContext
        onDragEnd={result =>
          onDragEnd(result, columns, setColumns, updateFunnelTag)
        }
      >
        {Object.entries(columns)?.map(([columnId, column], index) => {
          return (
            <div className={styles.board} key={columnId}>
              <BoardHeader
                setFilter={setFilter}
                index={index}
                filters={filters}
                icon={DynamicIcons(index)}
                handleFunnels={() => handleFunnels}
              >
                {column.name}
              </BoardHeader>
              {sortLoad !== index ? (
                <div className={styles.droppable}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            width: "100%",
                            minHeight: 500,
                            transition: "all 0.15s ease-in",
                            backgroundColor: snapshot.isDraggingOver
                              ? "rgba(166, 248, 207, 0.32)"
                              : "transparent",
                          }}
                        >
                          {loadingAPI
                            ? "Loading..."
                            : column?.items?.map((item, index) => {
                                return (
                                  <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                  >
                                    {(provided, snapshot) => {
                                      return (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            ...provided.draggableProps.style,
                                          }}
                                        >
                                          <BoardItem
                                            history={props.history}
                                            connection={item}
                                          >
                                            {item.content}
                                          </BoardItem>
                                        </div>
                                      );
                                    }}
                                  </Draggable>
                                );
                              })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              ) : (
                <Loader />
              )}
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};
