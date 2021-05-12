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
  summaryIdData,
}) {
  const options = [
    { value: "Groups", name: "groups" },
    { value: "Funnel Stage", name: "funnels" },
    { value: "Tags", name: "tags" },
    { value: "Subjective Score", name: "subjectiveScore" },
  ];

  const [render, setRender] = useState(false);

  const [mutate] = useMutation(userUpdate);

  // update
  useEffect(() => {
    const input = { columnSettings: manageColValue };
    mutate({ variables: { input } });
  }, [manageColValue.groups]);

  const handleManageSection = (e, evaltionId) => {
    if (evaltionId) {
      if (e.target.checked === false) {
        var array = manageColValue.evaluationTemplates; //  array
        var index = array.indexOf(evaltionId); //e is id
        if (index !== -1) {
          array.splice(index, 1); // remove the arr value
          setManageColValue({
            ...manageColValue,
            ["evaluationTemplates"]: array,
          });
        }
      } else {
        var array = manageColValue.evaluationTemplates;
        array.push(evaltionId);
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
        evaluationTemplates.forEach(summary => {
          setManageColValue(manageColValue => ({
            ...manageColValue,
            ["evaluationTemplates"]: [
              ...manageColValue.evaluationTemplates,
              summary.id,
            ],
          }));
        });
      } else {
        if (e.target.name === "showAll") {
          if (e.target.checked === false) {
            setManageColValue({
              ...manageColValue,
              groups: false,
              funnels: false,
              tags: false,
              subjectiveScore: false,
              evaluationTemplates: [],
            });
          } else {
            setManageColValue({
              ...manageColValue,
              groups: true,
              funnels: true,
              tags: true,
              subjectiveScore: true,
              evaluationTemplates: [...summaryIdData],
            });
          }
        } else {
          setManageColValue({
            ...manageColValue,
            [e.target.name]: e.target.checked,
          });
        }
      }
    }
    setRender(render);
  };

  const showAll =
    manageColValue.evaluationTemplates.length === evaluationTemplates.length &&
    manageColValue.groups &&
    manageColValue.funnels &&
    manageColValue.tags &&
    manageColValue.subjectiveScore;

  console.log("sivawas", showAll);

  return (
    <Sidebar title="Manage Columns" close={close}>
      <div className={styles.manage}>
        <ul>
          <li>
            <label className={styles.customCheck}>
              <input
                type="checkbox"
                checked={showAll}
                name="showAll"
                onChange={handleManageSection}
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
                  checked={manageColValue[item.name]}
                  onChange={handleManageSection}
                  type="checkbox"
                />
                <span class={styles.checkmark}></span>
              </label>
              <p>{item.value}</p>
            </li>
          ))}

          {evaluationTemplates.length ? (
            <li>
              <label className={styles.customCheck}>
                <input
                  checked={allEvaluation}
                  name={"evaluation"}
                  onChange={handleManageSection}
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
                        onChange={e => handleManageSection(e, summary.id)}
                        checked={manageColValue.evaluationTemplates.includes(
                          summary.id
                        )}
                        name={summary.id}
                      />
                      <span class={styles.checkmark}></span>
                    </label>
                    <p>{summary.name}</p>
                  </li>
                ))}
              </ul>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
    </Sidebar>
  );
}
