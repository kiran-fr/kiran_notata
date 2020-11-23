import gql from "graphql-tag";

export default gql`
  fragment evaluationFields on Evaluation {
    id
    name
    description
    createdAt
    updatedAt
    createdBy
    templateId
    answers {
      id
      inputType
      questionId
      sid
      question
      val
    }
    createdByUser {
      email
      given_name
      family_name
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
  }
`;
