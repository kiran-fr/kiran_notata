import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { groupDelete } from "../../../../Apollo/Mutations";
import { group } from "../../../../../definitions";

export default function CompanyNameAndDescription({ group, history }) {
  const [dropDownState, setDropDownState] = useState(false);

  const [deleteGroup] = useMutation(groupDelete);

  return (
    <>
      {
        // Heading
        <div className="group-dashboard-container__card-heading">
          <span className="material-icons">lock</span>
          <span>{group.name}</span>
          <span
            className="material-icons group-dashboard-container__browse-card"
            onClick={() => setDropDownState(!dropDownState)}
          >
            {" "}
            more_horiz{" "}
          </span>
        </div>
      }

      {
        // Dropdown menu
        dropDownState && (
          <div className="group-dashboard-container__browse-card__drop-dwon">
            <div
              className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
              onClick={() => null}
            >
              <span className="material-icons settings">content_copy</span>
              <span className="text">SETTINGS</span>
            </div>
            <div
              className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
              onClick={() => null}
            >
              <span className="material-icons settings">edit</span>
              <span className="text">EDIT</span>
            </div>
            <div
              className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
              onClick={() => null}
            >
              <span className="material-icons settings">groups</span>
              <span className="text">CREATE NEW GROUP</span>
            </div>
            <div
              className="material-icons group-dashboard-container__browse-card__drop-dwon__item leave"
              onClick={() => null}
            >
              <span className="material-icons leave">delete</span>

              <span
                className="text"
                onClick={async () => {
                  let variables = {
                    id: group.id,
                  };

                  try {
                    await deleteGroup({ variables });
                  } catch (error) {
                    console.log("error", error);
                  }

                  history.push(group);
                }}
              >
                DELETE GROUP
              </span>
            </div>
          </div>
        )
      }

      <div>
        <p className="group-dashboard-container__group-details">
          {group.description || group.settings?.isPublic
            ? "open group"
            : "closed group"}
          {/*Band of Angels was the first high-tech angel investment*/}
          {/*group in the Norway and continues today, with millions of*/}
          {/*dollars of annual investment into 20+ startups each year.*/}
        </p>
      </div>
    </>
  );
}
