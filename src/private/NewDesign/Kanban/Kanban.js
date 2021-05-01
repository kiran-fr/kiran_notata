import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import styles from "./Kanban.module.css";

import BarIcon1 from "./Assets/Bar_Icon_01.svg";
import BarIcon2 from "./Assets/Bar_Icon_02.svg";
import BarIcon3 from "./Assets/Bar_Icon_03.svg";
import BarIcon4 from "./Assets/Bar_Icon_04.svg";
import BarIcon5 from "./Assets/Bar_Icon_05.svg";

// Components
import BoardHeader from "./Components/BoardHeader";
import BoardItem from "./Components/BoardItem";

// Temporary Items, will be fetched from the backend in the future
const items = [
  { id: "i1", content: "Great Startup" },
  { id: "i2", content: "Greatest Startup" },
  { id: "i3", content: "Even Greater Startup" },
  { id: "i4", content: "Too Great A Startup" },
  { id: "i5", content: "No Words Startup" },
];

const boards = {
  c1: {
    name: "Reviewed",
    items: items,
    icon: BarIcon1,
  },
  c2: {
    name: "Met",
    items: [],
    icon: BarIcon2,
  },
  c3: {
    name: "Analyzed",
    items: [],
    icon: BarIcon3,
  },
  c4: {
    name: "IC",
    items: [],
    icon: BarIcon4,
  },
  c5: {
    name: "Invested",
    items: [],
    icon: BarIcon5,
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
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
  const [columns, setColumns] = useState(boards);
  return (
    <div
      style={{
        display: "flex",
        marginTop: "40px",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div className={styles.board} key={columnId}>
              <BoardHeader icon={column.icon}>{column.name}</BoardHeader>
              <div style={{ margin: 8 }}>
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
                        {column.items.map((item, index) => {
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
                                    <BoardItem>{item.content}</BoardItem>
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
