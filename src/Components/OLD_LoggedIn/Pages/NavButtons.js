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

    let { history, title, id, dd, overview, routeMap, search } = this.props;
    let index = findIndex(dd, d => d.title === title);

    let width = index === 0 || index === dd.length - 1 ? "50%" : "33.33%";

    return (
      <div className={navButtonsContainer}>
        {index !== 0 && (
          <div
            className={classnames(navButtonLeft, color1_bg_h)}
            onClick={() => {
              this.setState({
                redirect: `${routeMap[dd[index - 1].title]}${search}`
              });
              // history.push(`${routeMap[dd[index-1].title]}${search}`)
            }}
            style={{ width }}
          >
            <i className="fas fa-chevron-left" />
          </div>
        )}

        <div
          className={classnames(navButtonCenter, color2_bg_h)}
          onClick={() => {
            this.setState({ redirect: `${overview}${search}` });
          }}
          style={{ width }}
        >
          <i className="fas fa-th" />
        </div>

        {index !== dd.length - 1 && (
          <div
            className={classnames(navButtonRight, color3_bg_h)}
            onClick={() => {
              this.setState({
                redirect: `${routeMap[dd[index + 1].title]}${search}`
              });
              // history.push(`${routeMap[dd[index+1].title]}${search}`)
            }}
            style={{ width }}
          >
            <i className="fas fa-chevron-right" />
          </div>
        )}
      </div>
    );
  }
}
