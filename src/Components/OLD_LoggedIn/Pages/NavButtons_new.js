import React from "react";
import { findIndex } from "lodash";
import { Link, Redirect } from "react-router-dom";
import classnames from "classnames";
import {
  navButtonsContainer,
  navButtonLeft,
  navButtonCenter,
  navButtonRight
} from "./NavButtons.module.css";
import { color1_bg_h, color2_bg_h, color3_bg_h } from "../../elements/Colors.module.css";
import { evaluation_new, company_details } from "../../../routes";

export class NavButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    let { history, option, options, questions, evaluation } = this.props;

    let index;

    options.forEach((o, i) => {
      if (o.sid === option.sid) index = i;
    });

    let width = index === 0 ? "50%" : "33.33%";

    return (
      <div className={navButtonsContainer}>
        {index !== 0 && (
          <div
            className={classnames(navButtonLeft, color1_bg_h)}
            onClick={() => {
              let { sid } = options.find((o, i) => i === index - 1);
              let url = `${evaluation_new}/${evaluation.id}/${sid}`;
              history.push(url);
            }}
            style={{ width }}
          >
            <i className="fas fa-chevron-left" />
          </div>
        )}

        <div
          className={classnames(navButtonCenter, color2_bg_h)}
          onClick={() => {
            let url = `${evaluation_new}/${evaluation.id}`;
            history.push(url);
          }}
          style={{ width }}
        >
          <i className="fas fa-th" />
        </div>

        {
          <div
            className={classnames(navButtonRight, color3_bg_h)}
            onClick={() => {
              let url;
              if (index !== options.length - 1) {
                let { sid } = options.find((o, i) => i === index + 1);
                url = `${evaluation_new}/${evaluation.id}/${sid}`;
              } else {
                url = `${company_details}/${evaluation.id}`;
              }

              history.push(url);
            }}
            style={{ width }}
          >
            <i className="fas fa-chevron-right" />
          </div>
        }

        {
          // index !== options.length - 1 && (
          //   <div
          //     className={classnames(navButtonRight, color3_bg_h)}
          //     onClick={() => {
          //       let { sid } = options.find((o, i) => i === index + 1);
          //       let url = `${evaluation_new}/${evaluation.organization.id}/${sid}`;
          //       history.push(url);
          //     }}
          //     style={{ width }}
          //   >
          //     <i className="fas fa-chevron-right" />
          //   </div>
          // )
        }
      </div>
    );
  }
}
