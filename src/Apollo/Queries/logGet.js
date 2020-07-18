import gql from "graphql-tag";

import { 
  logItemFragments
} from '../Fragments';

export default gql`
  query logGet($connectionId: ID!) {
    logGet(connectionId: $connectionId) {
        ...logItemFields
    }
  }
  ${logItemFragments}
`

