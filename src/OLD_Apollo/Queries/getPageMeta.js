import gql from "graphql-tag";

export default gql`
  query getPageMeta($url: String!) {

    getPageMeta(url: $url) {
      title
      image
      provider
      url
    }

  }
`;

