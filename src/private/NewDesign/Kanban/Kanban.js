import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import styles from "./Kanban.module.css";
import { useQuery, useMutation } from "@apollo/client";
import {
  accountGet as accountGetData,
  connectionsGet,
} from "private/Apollo/Queries";
import { GhostLoader } from "Components/elements";

import BarIcon1 from "./../../../assets/images/Bar_Icon_01.svg";
import BarIcon2 from "./../../../assets/images/Bar_Icon_02.svg";
import BarIcon3 from "./../../../assets/images/Bar_Icon_03.svg";
import BarIcon4 from "./../../../assets/images/Bar_Icon_04.svg";
import BarIcon5 from "./../../../assets/images/Bar_Icon_05.svg";

import { connectionFunnelTagAdd } from "private/Apollo/Mutations";
import { appsyncClient } from "../../../awsconfig";

// Components
import BoardHeader from "./Components/BoardHeader";
import BoardItem from "./Components/BoardItem";

const onDragEnd = (result, columns, setColumns, updateFunnelTag) => {
  if (!result.destination) return;
  const { source, destination } = result;
  console.log("result", result);
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

export const Kanban = () => {
  const [columns, setColumns] = useState({});
  const [getConnections, setGetConnections] = useState(false);
  const [loadingAPI, setLoadingAPI] = useState(true);
  const { data: accountGet, loading, error } = useQuery(accountGetData);
  let response = accountGet?.accountGet?.funnelGroups?.[0].funnelTags;

  // Mutation updating funnel tag for connection
  const [mutate] = useMutation(connectionFunnelTagAdd);

  useEffect(() => {
    if (getConnections) {
      let columnsCopy = [];

      let apiPromise = Object.keys(columns).map((key, ind) => {
        return appsyncClient
          .query({
            query: connectionsGet,
            variables: {
              filters: { funnelTag: columns[key].id },
            },
          })
          .then(result => {
            let columnUpdatedObj = Object.assign({}, columns[key], {
              items: result?.data?.connectionsGet || [],
            });
            columnsCopy.push(columnUpdatedObj);
          });
      });

      Promise.all(apiPromise).then(response => {
        setLoadingAPI(false);
        setColumns({ ...columnsCopy });
      });
    }
  }, [getConnections]);

  useEffect(() => {
    if (loading === false && accountGet) {
      setColumns({ ...response });
      setGetConnections(true);
    }
  }, [loading, accountGet]);

  const updateFunnelTag = (funnelTagId, connectionId) => {
    const variables = {
      connectionId,
      funnelTagId,
    };
    mutate({
      variables,
    });
  };

  if (!accountGet) {
    return <GhostLoader />;
  }

  const icons = index => {
    const position = index + 1;
    return position === 1
      ? BarIcon1
      : position === 2
      ? BarIcon2
      : position === 3
      ? BarIcon3
      : position === 4
      ? BarIcon4
      : BarIcon5;
  };

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
              <BoardHeader icon={icons(index)}>{column.name}</BoardHeader>
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
                                        <BoardItem connection={item}>
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
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};
