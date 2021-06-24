// OTHERS 
import { cloneDeep } from "lodash";

export const manageColumn = (
    e,
    evaltionId,
    setManageColValue,
    manageColValue,
    evaluationTemplates,
    setRender,
    render
    ) => {
    let checkboxValue = e.target.checked;
    let checked = e.target.checked;
    let unchecked = !e.target.checked;
    let checkboxName = e.target.name;
    let allEvaluationWithUnCheck = checkboxName === "evaluation" && unchecked;
    let allEvaluationWithCheck = checkboxName === "evaluation" && checked;
    let showAll = checkboxName === "showAll";
    let evaltionIDClick = evaltionId;

    // show all check logic
    const showAllArr = (checkVal, arr) => {
      setManageColValue({
        ...manageColValue,
        groups: checkVal,
        funnels: checkVal,
        tags: checkVal,
        subjectiveScore: checkVal,
        evaluationTemplates: arr,
      });
    };

    // global evaltion checkbox clik

    if (allEvaluationWithUnCheck || allEvaluationWithCheck) {
      switch (allEvaluationWithUnCheck || allEvaluationWithCheck) {
        case allEvaluationWithUnCheck:
          return setManageColValue({
            ...manageColValue,
            ["evaluationTemplates"]: [],
          });
        default:
          const evaluationArr = [];
          evaluationTemplates.forEach(summary => {
            evaluationArr.push(summary.id);
          });
          return setManageColValue(manageColValue => ({
            ...manageColValue,
            ["evaluationTemplates"]: [...evaluationArr],
          }));
      }
    }

    // show all checkbox clik

    if (showAll) {
      switch (showAll) {
        case unchecked:
          return showAllArr(checkboxValue, []);
        default:
          // showAll is checked
          let newArr = [];
          evaluationTemplates.forEach(summary => {
            newArr.push(summary.id);
          });

          return showAllArr(checkboxValue, newArr);
      }
    }

    // evaltion checkbox clik
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
        var checkedEvaltion = cloneDeep(manageColValue.evaluationTemplates)
          .length
          ? cloneDeep(manageColValue.evaluationTemplates)
          : [];
        checkedEvaltion.push(evaltionId);
        setManageColValue({
          ...manageColValue,
          ["evaluationTemplates"]: checkedEvaltion,
        });
      }
    }

    // check and unchecked rest

    if (
      checkboxName !== "evaluation" &&
      !showAll &&
      !evaltionIDClick &&
      (checked || unchecked)
    ) {
      setManageColValue({
        ...manageColValue,
        [checkboxName]: checkboxValue,
      });
    }

    setRender(!render);
  };