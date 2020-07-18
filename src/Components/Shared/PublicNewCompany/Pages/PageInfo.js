import React from "react";
import Page from "./Page";
import { color8_bg } from "../../../elements/Colors.module.css";

export const data = {
  title: 'Info',
  className: color8_bg,
  questions: [
    {
      title: 'Company one-liner:',
      type: 'textInput',
      field: 'info_company_one_liner'
    },
    {
      title: 'Describe the problem:',
      type: 'textInput',
      field: 'info_describe_problem'
    },
    {
      title: 'Describe the solution:',
      type: 'textInput',
      field: 'info_describe_solution'
    },
    {
      title: 'Website',
      type: 'urls',
      field: 'info_website'
    },
    {
      title: 'Twitter',
      type: 'urls',
      field: 'info_twitter'
    },
    {
      title: 'Facebook',
      type: 'urls',
      field: 'info_facebook'
    },
    {
      title: 'Instagram',
      type: 'urls',
      field: 'info_instagram'
    },
    {
      title: 'LinkedIn',
      type: 'urls',
      field: 'info_linkedin'
    },
    {
      title: 'Address',
      type: 'textInput',
      field: 'info_address'
    },
    {
      title: 'Contact person',
      type: 'textInput',
      field: 'info_contact_person'
    },
    {
      title: 'Team members LinkedIn',
      type: 'urls',
      field: 'info_team_members'
    },
  ]
}

export default ({history}) => (
  <Page
    history={history}
    data={data}
  />
)

