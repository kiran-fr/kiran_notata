import gql from "graphql-tag";
import { 
  tagFragments,
  funnelTagFragments,
  creativeFragments,
  connectionFragments,
  evaluationFragments
} from '../Fragments';

export default gql`
  mutation connectionSubjectiveScorePut($id: ID!, $score: Int!) {
    connectionSubjectiveScorePut(id: $id, score: $score) {
      
      ...connectionFields
      
      creative {
        ...creativeFields
      }

      tags {
        ...tagFields
      }

      funnelTags {
        ...funnelTagFields
      }

      evaluations {
        ...evaluationFields
      }

    }

  }
  ${tagFragments}
  ${funnelTagFragments}
  ${creativeFragments}
  ${connectionFragments}
  ${evaluationFragments}
`






  

