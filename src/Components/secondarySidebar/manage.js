import React, { useState, useEffect } from "react";

import styles from "./sidebar.module.scss";

// API STUFF
import { useMutation } from "@apollo/client";

import { userUpdate } from "private/Apollo/Mutations";

import Sidebar from "./index";

export default function ManageSidebar({
  close,
  setManageColValue,
  manageColValue,
  evaluationTemplates,
}) {
  const [render, setRender] = useState(false);
  const [mutate] = useMutation(userUpdate);

  // update
  useEffect(() => {
    const input = { columnSettings: manageColValue };
    mutate({ variables: { input } });
  }, [manageColValue]);

  const handleManageSection = (e, evaltionId) => {
    let checked =  e.target.checked
    let unchecked = !e.target.checked
    let name = e.target.name
    let evaluationNameWithUnCheck = name === "evaluation" && unchecked
    let evaluationNameWithCheck =  name === "evaluation" && checked
    let showAll = name === "showAll"
    let evaltionIDClick = evaltionId


    if (evaltionIDClick) {
      if (unchecked) {
        const filteredItems = manageColValue.evaluationTemplates.filter(
          item => item !== evaltionId
        );
        setManageColValue({
          ...manageColValue,
          ["evaluationTemplates"]: filteredItems,
        });
      } else {
        var checkedEvaltion = manageColValue.evaluationTemplates
        .length
          ?
            manageColValue.evaluationTemplates
          :
            [];
        checkedEvaltion.push(evaltionId);
        setManageColValue({
          ...manageColValue,
          ["evaluationTemplates"]: checkedEvaltion,
        });

      }
    } else {
        if (evaluationNameWithUnCheck) {
          setManageColValue({
            ...manageColValue,
            ["evaluationTemplates"]: [],
          });
        } else if (evaluationNameWithCheck) {
          const evaluationArr = []
          evaluationTemplates.forEach(summary => {
            evaluationArr.push(summary.id)
          });

          setManageColValue(manageColValue => ({
            ...manageColValue,
            ["evaluationTemplates"]: [
              ...evaluationArr,
            ],
          }));
        } else {
          if (showAll) {
            if (unchecked) {
              setManageColValue({
                ...manageColValue,
                groups: false,
                funnels: false,
                tags: false,
                subjectiveScore: false,
                evaluationTemplates: [],
              });
            } else {
              // showAll is checked
              let newArr = [];
              evaluationTemplates.forEach(summary => {
                newArr.push(summary.id);
              });
              setManageColValue({
                ...manageColValue,
                groups: true,
                funnels: true,
                tags: true,
                subjectiveScore: true,
                evaluationTemplates: newArr,
              });
            }
        } else {
          // group, funnels, tags, subjective score check and uncheck logic
          setManageColValue({
            ...manageColValue,
            [e.target.name]: e.target.checked,
          });
        }
      }
    }
    setRender(render);
  };

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
