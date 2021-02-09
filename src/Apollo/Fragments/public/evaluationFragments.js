import gql from "graphql-tag";

export default gql`
  fragment evaluationFields on PublicEvaluation {
    id
    name
    description
    createdAt
    updatedAt
    templateId
    answers {
      id
      inputType
      questionId
      sid
      question
      val
    }
    summary {
      templateName
      sections {
        sectionId
        name
        score
        possibleScore
        scorePerAnswer {
          score
          possibleScore
          questionId
          question
        }
      }
      totalScore
      possibleScore
    }
    email
    given_name
    family_name
  }
`;
