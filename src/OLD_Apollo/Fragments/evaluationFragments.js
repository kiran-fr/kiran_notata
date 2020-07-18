import gql from "graphql-tag";

export default gql`
  fragment evaluationFields on Evaluation {
    id
    userId
    orgId
    createdAt

    tags

    n_tags
    n_funnel

    suggestedTags

    archived

    sharedByEmail
    sharedByName

    business_age
    business_insiders
    business_serial_entrepeneurs
    business_traction
    business_connected
    business_exit
    business_go_to_market
    business_product_market_fit
    business_investment_ready
    business_realistic_plan
    business_fits_me
    business_help
    business_consult_who

    comments_worries
    comments_excites
    comments_other
    comments_puma

    concept_easy_to_understand
    concept_easy_to_copy
    concept_need_or_nice
    concept_sustainability
    concept_makes_you_feel
    concept_disruptive_viral

    market_new_market
    market_region
    market_potential
    market_competition
    market_willingness

    problem_do_you_understand
    problem_is_it_real
    problem_why_not_solved
    problem_will_you_buy
    problem_why_will_it_fail
  }
`;
