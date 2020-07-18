import gql from "graphql-tag";
import { settingsFragments } from '../Fragments'

export default gql`
  query getSettings {
    getSettings {
      ...settingsFields
    }
  }
  ${settingsFragments}
`;