import React, { useState, useEffect } from "react";

// API STUFF
import { useMutation } from "@apollo/client";
import { userUpdate } from "private/Apollo/Mutations";

// COMPONENTS
import Sidebar from "./index";

// STYLES
import styles from "./sidebar.module.scss";

// OTHERS
import { manageColumn } from "./helpers.js";

export default function ManageSidebar({
  close,
  setManageColValue,
  manageColValue,
  evaluationTemplates,
}) {
  // CONST
  const allEvaluation =
    evaluationTemplates.length === manageColValue.evaluationTemplates.length;

  const options = [
    { value: "Groups", name: "groups" },
    { value: "Funnel Stage", name: "funnels" },
    { value: "Tags", name: "tags" },
    { value: "Subjective Score", name: "subjectiveScore" },
  ];

  const showAll =
    (manageColValue.evaluationTemplates.length === evaluationTemplates.length ||
      evaluationTemplates.length === 0) &&
    manageColValue.groups &&
    manageColValue.funnels &&
    manageColValue.tags &&
    manageColValue.subjectiveScore;

  // STATES
  const [render, setRender] = useState(false);
  const [mutate] = useMutation(userUpdate);

  // EFFECTS
  // update
  useEffect(() => {
    const input = { columnSettings: manageColValue };
    mutate({ variables: { input } });
  }, [manageColValue]);

  // FUNCTIONS
  const handleManageSection = (e, evaltionId) => {
    manageColumn(
      e,
      evaltionId,
      setManageColValue,
      manageColValue,
      evaluationTemplates,
      setRender,
      render
    );
  };

  return (
    <Sidebar title="Manage Columns" close={close}>
      <div className={styles.manage}>
        <ul>
          <li className={styles.firstOrderManage}>
            <label className={styles.customCheck}>
              <input
                type="checkbox"
                checked={showAll}
                name="showAll"
                autoComplete="off"
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
