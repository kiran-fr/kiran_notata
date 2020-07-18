import gql from "graphql-tag";

import { 
  tagFragments,
  funnelTagFragments,
  creativeFragments,
  connectionFragments,
  evaluationFragments
} from '../Fragments';

export default gql`
  query connectionGet($id: ID!) {

    connectionGet(id: $id) {

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






  

