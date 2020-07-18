import gql from "graphql-tag";

export default gql`
  fragment organizationFields on Organization {
    id
    name
    createdAt
    createdBy
    invitedStartup

    isFinished
    accepted_terms
    terms

    business_model
    business_pricing
    business_selling_what
    business_b2
    business_currently_in_market
    business_no_of_founders
    business_team_diversity

    info_company_one_liner
    info_describe_problem
    info_describe_solution

    money_soft
    money_hard
    money_seeking

    info_address
    info_contact_person

    info_website {
      url
      provider
      title
      image
    }
    info_twitter {
      url
      provider
      title
      image
    }
    info_facebook {
      url
      provider
      title
      image
    }
    info_instagram {
      url
      provider
      title
      image
    }
    info_linkedin {
      url
      provider
      title
      image
    }
    info_team_members {
      url
      provider
      title
      image
    }

    materials_slide_decks {
      url
      provider
      title
      image
    }
    materials_sites {
      url
      provider
      title
      image
    }
    materials_videos {
      url
      provider
      title
      image
    }
  }
`;
