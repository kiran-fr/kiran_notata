import React from "react";
import Page from "./Page";
import { color2_bg } from "../../../elements/Colors.module.css";

export const data = {
  title: 'Business',
  className: color2_bg,
  questions: [
    {
      title: 'What\'s the business model?',
      type: 'radio',
      field: 'business_model',
      options: [
        {
          text: '... as a Service',
          val: 'aas'
        },
        {
          text: 'Subscription model',
          val: 'subscription'
        },
        {
          text: 'One time fee',
          val: 'single'
        },
        {
          text: 'Cut of sales',
          val: 'cut'
        },
        {
          text: 'Freemium',
          val: 'freemium'
        },
        {
          text: 'Free',
          val: 'free'
        },
        {
          text: 'Hardware',
          val: 'hardware'
        },
        {
          text: 'Hardware + subscription',
          val: 'hardware_plus_subscription'
        }
      ]
    },
    {
      title: 'What\'s the pricing like?',
      type: 'radio',
      field: 'business_pricing',
      options: [
        {
          text: 'cheap',
          val: 'Cheap'
        },
        {
          text: 'Average',
          val: 'average'
        },
        {
          text: 'Expensive',
          val: 'expensive'
        },
        {
          text: 'No pricing model developed',
          val: 'no'
        },
      ]
    },
    {
      title: 'What are they selling?',
      type: 'check',
      field: 'business_selling_what',
      options: [
        {
          text: 'Software',
          val: 'software'
        },
        {
          text: 'Hardware',
          val: 'hardware'
        },
        {
          text: 'Services',
          val: 'services'
        },
      ]
    },
    {
      title: 'What kind of business are we talking about?',
      type: 'radio',
      field: 'business_b2',
      options: [
        {
          text: 'B2B',
          val: 'b2b'
        },
        {
          text: 'B2C',
          val: 'b2c'
        },
        {
          text: 'B2G',
          val: 'b2g'
        },
        {
          text: 'C2B',
          val: 'c2b'
        },
        {
          text: 'C2C',
          val: 'c2c'
        },
      ]
    },
    {
      title: 'Currently operating in these markets',
      type: 'check',
      field: 'business_currently_in_market',
      options: [
        {
          text: 'North America',
          val: 'northAmerica'
        },
        {
          text: 'South America',
          val: 'southAmerica'
        },
        {
          text: 'Africa',
          val: 'africa'
        },
        {
          text: 'Europe',
          val: 'europe'
        },
        {
          text: 'Asia',
          val: 'asia'
        },
        {
          text: 'Oceania',
          val: 'oceania'
        },
      ]
    },
    {
      title: 'How many founders are we talking about?',
      type: 'radio',
      field: 'business_no_of_founders',
      options: [
        {
          text: '1 founder',
          val: 'one'
        },
        {
          text: '2 founders',
          val: 'two'
        },
        {
          text: '+3 founders',
          val: 'three_plus'
        },

      ]
    },
    {
      title: 'What\'s the diversity of the founding team like?',
      type: 'check',
      field: 'business_team_diversity',
      options: [
        {
          text: 'Female founder in team',
          val: 'female'
        },
        {
          text: 'Minority founder in team',
          val: 'minority'
        },
      ]
    },
  ]
}

export default ({history}) => (
  <Page
    history={history}
    data={data}
  />
)

