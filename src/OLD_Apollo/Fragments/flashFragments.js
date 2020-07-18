import gql from "graphql-tag";

export default gql`
  fragment flashFields on Flash {
    id
    title
    subTitle
    sections {
      image
      evaluation
      preHeader
      header
      body
      talks {
        title
        body
        talkers {
          name
          roles {
            title
            company
          }
        }
        quotes {
          index
          text
        }
      }
      numberBalls {
        key
        val
      }
      startups {
        logo
        name
        description
        link
        tags
      }
      calendar {
        name
        date
        location
        description
      }
    }
    freeInput
  }
`;
