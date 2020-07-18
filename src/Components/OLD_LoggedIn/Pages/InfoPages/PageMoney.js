import React from "react";
import Page from "./Page";
import { color4_bg } from "../../../elements/Colors.module.css";

export const data = {
  title: 'Money',
  className: color4_bg,
  questions: [
    {
      title: 'How much soft money have they raised?',
      type: 'radio',
      field: 'money_soft',
      options: [
        {
          text: '> 100k NOK',
          val: '> 100k NOK'
        },
        {
          text: '100k - 500k NOK',
          val: '100k - 500k NOK'
        },
        {
          text: '500k - 1,5m NOK',
          val: '500k - 1,5m NOK'
        },
        {
          text: '< 1,5m NOK',
          val: '< 1,5m NOK'
        },
      ]
    },
    {
      title: 'How much hard money have they raised?',
      type: 'radio',
      field: 'money_hard',
      options: [
        {
          text: '> 1m NOK',
          val: '> 1m NOK'
        },
        {
          text: '1m - 3m NOK',
          val: '1m - 3m NOK'
        },
        {
          text: '3m - 8m NOK',
          val: '3m - 8m NOK'
        },
        {
          text: '8m - 15m NOK',
          val: '8m - 15m NOK'
        },
        {
          text: '> 15m NOK',
          val: '> 15m NOK'
        },
      ]
    },
    {
      title: 'How much money are they looking for?',
      type: 'radio',
      field: 'money_seeking',
      options: [
        {
          text: '1m - 3m NOK',
          val: '1m - 3m NOK'
        },
        {
          text: '3m - 8m NOK',
          val: '3m - 8m NOK'
        },
        {
          text: '8m - 15m NOK',
          val: '8m - 15m NOK'
        },
        {
          text: '> 15m NOK',
          val: '> 15m NOK'
        },
      ]
    }
  ]
}

export default ({history}) => (
  <Page
    history={history}
    data={data}
  />
)

