import React from "react";
import Page from "./Page";
import { color7_bg } from "../../../elements/Colors.module.css";

export const data = {
  title: 'Materials',
  className: color7_bg,
  questions: [
    {
      title: 'Slide decks',
      type: 'urls',
      field: 'materials_slide_decks'
    },
    {
      title: 'Blogs, articles, and other mentions',
      type: 'urls',
      field: 'materials_sites'
    },
    {
      title: 'Videos',
      type: 'urls',
      field: 'materials_videos'
    }
  ]
}

export default ({history}) => (
  <Page
    history={history}
    data={data}
  />
)

