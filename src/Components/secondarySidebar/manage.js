import React, { useState, useEffect } from "react";

import styles from "./sidebar.module.css";

// API STUFF
import { useQuery, useMutation } from "@apollo/client";

import { userUpdate } from "private/Apollo/Mutations";

import Sidebar from "./index";

export default function ManageSidebar({
  close,
  setManageColValue,
  manageColValue,
  evaluationTemplates,
  allEvaluation,
}) {
  const options = [
    { value: "Groups", name: "groups" },
    { value: "Funnel Stage", name: "funnels" },
    { value: "Tags", name: "tags" },
    { value: "Subjective Score", name: "subjectiveScore" },
    { value: "Updated", name: "updated" },
  ];

  const [mutate] = useMutation(userUpdate);

  // useEffect(() => {
  //   const input = manageColValue
  //   mutate({ variables: { input } });

  // }, [manageColValue]);

  const handleManageSection = (e, option) => {
    if (option) {
      var array = manageColValue.evaluationTemplates; //  array
      var index = array.indexOf(e); //e is id
      if (index !== -1) {
        array.splice(index, 1); // remove the arr value
        setManageColValue({
          ...manageColValue,
          ["evaluationTemplates"]: array,
        });
      }
    } else {
      if (e.target.name === "evaluation" && e.target.checked === false) {
        setManageColValue({
          ...manageColValue,
          ["evaluationTemplates"]: [],
        });
      } else if (e.target.name === "evaluation" && e.target.checked === true) {
        console.log("triggeralla");
      } else {
        setManageColValue({
          ...manageColValue,
          [e.target.name]: e.target.checked,
        });
      }
    }
  };

  const { showAll } = manageColValue;
  return (
    <Sidebar title="Manage Columns" icon="fas fa-cog" close={close}>
      <div className={styles.manage}>
        <ul>
          <li>
            <label className={styles.customCheck}>
              <input
                type="checkbox"
                defultChecked={showAll}
                name="showAll"
                onClick={handleManageSection}
              />
              <span class={styles.checkmark}></span>
            </label>
            <p>Show All</p>
          </li>
        </ul>
        <ul>
          {options.map(item => (
            <li>
              <label className={styles.customCheck}>
                <input
                  name={item.name}
                  defaultChecked={manageColValue[item.name]}
                  onClick={handleManageSection}
                  type="checkbox"
                />
                <span class={styles.checkmark}></span>
              </label>
              <p>{item.value}</p>
            </li>
          ))}

          {evaluationTemplates.length && (
            <li>
              <label className={styles.customCheck}>
                <input
                  defaultChecked={allEvaluation}
                  name={"evaluation"}
                  onClick={handleManageSection}
                  type="checkbox"
                />
                <span class={styles.checkmark}></span>
              </label>
              <p>Evaluation</p>

              <ul>
                {evaluationTemplates.map(summary => (
                  <li>
                    <label className={styles.customCheck}>
                      <input
                        type="checkbox"
                        onClick={handleManageSection(summary.id, "evaluation")}
                        defaultChecked={manageColValue.evaluationTemplates.includes(
                          summary.id
                        )}
                        name={summary.id}
                        onClick={handleManageSection}
                      />
                      <span class={styles.checkmark}></span>
                    </label>
                    <p>{summary.name}</p>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </div>
    </Sidebar>
  );
}
