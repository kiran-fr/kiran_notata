import React from "react";
import classnames from "classnames";
import { Link, Switch, withRouter } from "react-router-dom";
import { container } from "./Page.module.css";

import { NavButtons } from "./NavButtons_new";
import { PageHeader } from "./PageHeader_new";
import { color3_bg } from "../../elements/Colors.module.css";
import { saving_buttons, saving_button, saved_button } from "./Page.module.css";

import SectionNew from "./SectionNew";

class PageComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollTo: false
    };
  }

  tops = [];

  render() {
    let {
      id,
      sid,
      allOptions,
      option,
      options,
      questions,
      evaluation,
      history
    } = this.props;

    return (
      <div
        className={container}
        style={{
          maxWidth: "600px",
          margin: "auto"
        }}
      >
        <PageHeader name={evaluation.organization.name} />

        <div style={{ marginTop: "75px" }}>
          {option.options.map((o, i) => (
            <SectionNew
              key={`section-${i}`}
              data={o}
              id={id}
              sid={sid}
              option={option}
              questions={questions}
              allOptions={allOptions}
              evaluation={evaluation}
            />
          ))}
        </div>

        <NavButtons
          option={option}
          options={options}
          questions={questions}
          evaluation={evaluation}
          history={history}
        />
      </div>
    );
  }
}

export default PageComp;
