import gql from "graphql-tag";

export default gql`
  fragment settingsFields on Settings {
      userId

      evaluation_business_age { key val }
      evaluation_business_insiders { key val }
      evaluation_business_serial_entrepeneurs { key val }
      evaluation_business_traction { key val }
      evaluation_business_connected { key val }
      evaluation_business_exit { key val }
      evaluation_business_go_to_market { key val }
      evaluation_business_product_market_fit { key val }
      evaluation_business_investment_ready { key val }
      evaluation_business_realistic_plan { key val }
      evaluation_business_fits_me { key val }
      evaluation_business_help { key val }
      evaluation_business_consult_who { key val }
      evaluation_comments_worries { key val }
      evaluation_comments_excites { key val }
      evaluation_comments_other { key val }
      evaluation_comments_puma { key val }
      evaluation_concept_easy_to_understand { key val }
      evaluation_concept_easy_to_copy { key val }
      evaluation_concept_need_or_nice { key val }
      evaluation_concept_sustainability { key val }
      evaluation_concept_makes_you_feel { key val }
      evaluation_concept_disruptive_viral { key val }
      evaluation_market_new_market { key val }
      evaluation_market_region { key val }
      evaluation_market_potential { key val }
      evaluation_market_competition { key val }
      evaluation_market_willingness { key val }
      evaluation_problem_do_you_understand { key val }
      evaluation_problem_is_it_real { key val }
      evaluation_problem_why_not_solved { key val }
      evaluation_problem_will_you_buy { key val }
      evaluation_problem_why_will_it_fail { key val }
      facts_business_model { key val }
      facts_business_pricing { key val }
      facts_business_selling_what { key val }
      facts_business_b2 { key val }
      facts_business_currently_in_market { key val }
      facts_business_no_of_founders { key val }
      facts_business_team_diversity { key val }
      facts_info_company_one_liner { key val }
      facts_info_describe_problem { key val }
      facts_info_describe_solution { key val }
      facts_info_website { key val }
      facts_info_twitter { key val }
      facts_info_facebook { key val }
      facts_info_instagram { key val }
      facts_info_linkedin { key val }
      facts_info_address { key val }
      facts_info_contact_person { key val }
      facts_info_team_members { key val }
      facts_materials_slide_decks { key val }
      facts_materials_sites { key val }
      facts_materials_videos { key val }
      facts_money_soft { key val }
      facts_money_hard { key val }
      facts_money_seeking { key val }

  }
`;
