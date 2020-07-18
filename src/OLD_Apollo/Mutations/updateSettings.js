import gql from "graphql-tag";
import { settingsFragments } from '../Fragments';

export default gql`
  mutation updateSettings($input: SettingsInput!) {
    updateSettings(input: $input) {
      ...settingsFields
    }
  }
  ${settingsFragments}
`;


