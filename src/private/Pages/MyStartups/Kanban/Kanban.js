import React, { useEffect, useState } from "react";

// Libraries
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// API Stuff
import { useQuery, useMutation } from "@apollo/client";
import { connectionFunnelTagAdd } from "private/Apollo/Mutations";
import { appsyncClient } from "../../../../awsconfig";
import {
  accountGet as accountGetData,
  connectionsGet,
} from "private/Apollo/Queries";

// Components
import BoardHeader from "./Components/BoardHeader";
import BoardItem from "./Components/BoardItem";
import { Loader } from "Components/UI_Kits";
import { GhostLoader } from "Components/elements";

// Styles
import styles from "./Kanban.module.css";

// Constants
import { dynamicIcons, sortArr } from "../../commonFunctions";

// Default Export
export const Kanban = ({ history, selectedfunnelGroup }) => {
  // States
  const [filters, setFilter] = useState({});
  const [columns, setColumns] = useState({});
  const [getConnections, setGetConnections] = useState(false);
  const [loadingAPI, setLoadingAPI] = useState(true);
  const [sortLoad, setSortLoad] = useState(false);
  const [funnelGroupIndex, setFunnelGroupIndex] = useState(0);

  // Queries
  const { data: accountGet, loading } = useQuery(accountGetData);
  let response =
    accountGet?.accountGet?.funnelGroups?.[funnelGroupIndex].funnelTags;

  // Mutations
  const [mutate] = useMutation(connectionFunnelTagAdd);

  // Effects
  let filterSortDirection = filters && filters.sortDirection;
  let filterSortBy = filters && filters.sortBy;

  useEffect(() => {
    setLoadingAPI(true);
    setGetConnections(false);
    setFunnelGroupIndex(selectedfunnelGroup);
  }, [selectedfunnelGroup]);

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
  }, [filterSortDirection, filterSortBy]);

  useEffect(() => {
    if ((loading === false && accountGet) || funnelGroupIndex) {
      if (funnelGroupIndex) {
        setLoadingAPI(false);
      }
      const indexSort = sortArr(response);
      setColumns({ ...indexSort });
      setGetConnections(true);
    }
  }, [loading, accountGet, funnelGroupIndex, response]);

  // Functions
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
        const indexSort = sortArr([removeCoulmn]);
        setColumns(...indexSort);
        setSortLoad(false);
      } else {
        const indexSort = sortArr(columnsCopy);
        setColumns({ ...indexSort });
      }
    });
  };

  const updateFunnelTag = (funnelTagId, connectionId) => {
    const variables = {
      connectionId,
      funnelTagId,
    };

    mutate({
      variables,
    });
  };

  // Handling the event that happens when the user stops dragging the Kanban Item
  const onDragEnd = (result, columns, setColumns, updateFunnelTag) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);

      destItems.splice(destination.index, 0, removed);
      updateFunnelTag(destColumn.id, result.draggableId);

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

  // If Loading
  if (!accountGet || loadingAPI) {
    return <GhostLoader />;
  }

  // JSX
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
                icon={dynamicIcons(index)}
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
                                            history={history}
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
