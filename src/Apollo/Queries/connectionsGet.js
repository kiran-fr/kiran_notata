import gql from "graphql-tag";

import { 
  tagFragments,
  funnelTagFragments,
  creativeFragments,
  connectionFragments
} from '../Fragments';

export default gql`
  query connectionsGet($filters: ConnectionFilters) {

    connectionsGet(filters: $filters) {        
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

    }
  }
  ${tagFragments}
  ${funnelTagFragments}
  ${creativeFragments}
  ${connectionFragments}
`
