export default function getEvaluationSummariesForTeam({ evaluations, hide }) {
  let data = [];

  // Cluster evaluations by template ID
  // ––––––––––––––––––––––––––––––––––
  let evaluationsByTemplate = {};
  for (let evaluation of evaluations) {
    evaluationsByTemplate[evaluation.templateId] =
      evaluationsByTemplate[evaluation.templateId] || [];
    evaluationsByTemplate[evaluation.templateId].push(evaluation);
  }

  for (let templateId in evaluationsByTemplate) {
    // Get all shared evaluations
    let evaluations = evaluationsByTemplate[templateId] || [];

    // Get possible score
    let scorePossible = evaluations[0]?.summary?.scorePossible;

    // Get template name
    let templateName = evaluations[0]?.summary?.templateName;

    // Get template sections
    let templateSections = evaluations[0]?.summary?.sections;

    // Get total score
    let scoreTotal = 0;
    let count = 0;
    for (let evaluation of evaluations) {
      if (!hide[evaluation.id]) {
        scoreTotal += evaluation.summary?.scoreTotal || 0;
        count += 1;
      }
    }

    // Get average score
    let averageScore = parseFloat((scoreTotal / count).toFixed(1));

    // Get average percentage score
    let averagePercentageScore =
      Math.round((averageScore / scorePossible) * 100) || 0;

    // Put it all together

    let d = {
      // groupName: thisGroup.name,
      // groupId: thisGroup.id,
      templateId: templateId,
      templateName: templateName,
      submissions: evaluations.length,
      averageScore: averageScore,
      scorePossible: scorePossible,
      averagePercentageScore: averagePercentageScore,
      templateSections: templateSections,
      evaluations: evaluations,
    };

    data.push(d);
  }

  return data;
}
