import React from "react";

// COMPONENTS 
import PopupMenu from "../PopupMenu";

// OTHERS
import Filterr from "../../../../assets/images/filter.png";
import Column from "../../../../assets/images/column.png";
import KanbanIcon from "../../../../assets/images/KanbanIcon.svg";

export const handleOptional = (setState, filterType, disabled) => {
    if (disabled === "") {
      setState(filterType);
    }
};

export const OptionalFilterSidebar = ({ setOptionalFilter, grayFadeOut, styles }) => {
    return (
      <div className={grayFadeOut}>
        <div className={styles.filterContainer}>
          <button
            className={styles.filterButton + " " + styles.manageButton}
            style={{ marginRight: "10px" }}
            onClick={() =>
              handleOptional(setOptionalFilter, "column", grayFadeOut)
            }
          >
            <img src={Column} alt="" /> <span>Manage Columns</span>
          </button>
          <button
            className={styles.filterButton}
            onClick={() =>
              handleOptional(setOptionalFilter, "filter", grayFadeOut)
            }
          >
            <img src={Filterr} alt="" /> <span>Filter</span>
          </button>
        </div>
      </div>
    );
};

// clear Button 
export const handleclearTxt = (filters) => {
    const hideTxt =
      (filters.tags && filters.tags.length > 0) ||
      (filters.funnelTag && filters.funnelTag.length > 0) ||
      filters.search ||
      filters.starred ||
      (filters.fromDate && filters.toDate);
  
    if (hideTxt) {
      return true;
    } else {
      return false;
    }
}

export const tabArrValue = (
    setKanbanPopup,
    kanbanPopup,
    kanbanDropDown,
    setSelectedfunnelGroup,
    activeTab
    ) => {
    return [
        {
        value: "kanban",
        text: (
            <div>
            <img
                style={{
                width: 15,
                height: 15,
                marginRight: "4px",
                transform: "rotateZ(360deg)",
                opacity: activeTab === "kanban" ? 1 : 0.5,
                }}
                src={KanbanIcon}
                alt=""
            />
            <span>KANBAN</span>
            <i
                onClick={() => setKanbanPopup(!kanbanPopup)}
                style={{ marginLeft: "5px" }}
                className="fas fa-chevron-down"
            ></i>
            <PopupMenu
                title="Kanban"
                items={kanbanDropDown}
                isOpen={kanbanPopup}
                setSelectedfunnelGroup={setSelectedfunnelGroup}
                setIsOpen={setKanbanPopup}
            ></PopupMenu>
            </div>
        ),
        },
        {
        value: "spreadsheet",
        text: (
            <div>
            <img
                style={{
                width: 15,
                height: 15,
                marginRight: "4px",
                opacity: activeTab === "kanban" ? 0.5 : 1,
                }}
                src={Column}
                alt=""
            />
            <span>SPREADSHEET</span>
            </div>
        ),
        },
    ];
}