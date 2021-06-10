import React, { useState, useEffect } from "react";

import styles from "./sidebar.module.scss";
import { cloneDeep } from "lodash";

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
    let checkboxValue = e.target.checked
    let checked =  e.target.checked
    let unchecked = !e.target.checked
    let checkboxName = e.target.name
    let allEvaluationWithUnCheck = checkboxName === "evaluation" && unchecked
    let allEvaluationWithCheck =  checkboxName === "evaluation" && checked
    let showAll = checkboxName === "showAll"
    let evaltionIDClick = evaltionId 

    // show all check logic 
    const showAllArr = (checkVal, arr) => {
      setManageColValue({
        ...manageColValue,
        groups: checkVal,
        funnels: checkVal,
        tags: checkVal,
        subjectiveScore: checkVal,
        evaluationTemplates: arr,
      })
    }

    // global evaltion checkbox clik 

    if(allEvaluationWithUnCheck || allEvaluationWithCheck) {
      switch(allEvaluationWithUnCheck || allEvaluationWithCheck) {
        case allEvaluationWithUnCheck:
          return (
            setManageColValue({
              ...manageColValue,
              ["evaluationTemplates"]: [],
            })
          )
        default:
          const evaluationArr = []
          evaluationTemplates.forEach(summary => {
            evaluationArr.push(summary.id)
          });
          return (
            setManageColValue(manageColValue => ({
              ...manageColValue,
              ["evaluationTemplates"]: [
                ...evaluationArr,
              ],
            }))
          )
      }
    }

    // show all checkbox clik 

    if(showAll) {
      switch(showAll) {
        case unchecked:
          return (
            showAllArr(checkboxValue, [])
          )
        default:
          // showAll is checked
          let newArr = [];
          evaluationTemplates.forEach(summary => {
            newArr.push(summary.id);
          });
        
          return (
            showAllArr(checkboxValue, newArr)
          )
      }
    }

    // evaltion checkbox clik 
    if(evaltionIDClick) {
      if(unchecked) {
        const filteredItems = manageColValue.evaluationTemplates.filter(
          item => item !== evaltionId
        );
        setManageColValue({
          ...manageColValue,
          ["evaluationTemplates"]: filteredItems,
        })
      } else {
        var checkedEvaltion = cloneDeep(manageColValue.evaluationTemplates).length
          ?
            cloneDeep(manageColValue.evaluationTemplates)
          :
            [];
        checkedEvaltion.push(evaltionId);
          setManageColValue({
            ...manageColValue,
            ["evaluationTemplates"]: checkedEvaltion,
          })
      }
    }
    
    // check and unchecked rest

    if( checkboxName !== "evaluation" &&
      !showAll &&
      !evaltionIDClick &&
      (checked || unchecked)
    ) {
      setManageColValue({
        ...manageColValue,
        [checkboxName]: checkboxValue,
      });
    }

    setRender(!render)

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
