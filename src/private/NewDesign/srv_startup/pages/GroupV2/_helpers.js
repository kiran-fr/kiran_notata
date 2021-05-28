export function getAllUsedTemplates(startups) {
  /*

    Returns array of all evaluation templates used in this group.
    Takes groupGetV2.startups and returns an array like this:

    [
      {
        templateId: String,
        templateName: String
      }
    ]

  */

  if (!startups || !startups.length) return [];

  let obj = {};
  for (let item of startups) {
    let evaluationSummaries = item?.evaluationSummaries || [];
    for (let t of evaluationSummaries) {
      obj[t.templateId] = t.templateName;
    }
  }

  let arr = [];
  for (let templateId in obj) {
    arr.push({ templateId, templateName: obj[templateId] });
  }

  return arr;
}

export function getSubjectiveScoreSummary(startup) {
  // Gets subjective score summary for each startup.

  let scores = startup?.subjectiveScores.map(({ score }) => score);
  if (!scores || !scores.length) return;

  let min = Math.min(...scores);
  let max = Math.max(...scores);
  let average = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  let submissions = scores.length;

  return {
    min,
    max,
    average,
    submissions,
  };
}

export function getEvaluationsByTemplate(startup) {
  /*

    Groups evaluations by evaluation template for each startup

    [
      {
        summary: Summary,          <- templateId, templateName, etc...
        evaluations: [Evaluation]  <- each evaluation
      }
    ]

  */

  return startup?.evaluationSummaries?.map(summary => ({
    summary,
    evaluations: startup.evaluations?.filter(
      evaluation => evaluation.templateId === summary.templateId
    ),
  }));
}
