import gql from "graphql-tag";

export default gql`
  fragment evaluationFields_new on Evaluation_new {
    id
    userId
    orgId
    seen
    createdAt
    updatedAt
    n_tags
    n_funnel
    archived
    sharedByEmail
    sharedByName
    comments_worries
    comments_excites
    comments_other
    comments_puma
    options {
      val
      sid
      input_type
      question
      questionID
    }
    shared_options {
      name
      options {
        val
        sid
        input_type
        question
        questionID
      }
    }
    userInfo {
      family_name
      given_name
      email
    }
  }
`;
