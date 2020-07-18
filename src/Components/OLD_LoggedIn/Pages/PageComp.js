import React from "react";
import classnames from "classnames";
import { Link, Switch, withRouter } from "react-router-dom";
import { container } from "./Page.module.css";
import { Section } from "./Section";
import { NavButtons } from "./NavButtons";
import { scroll_down } from "./NavButtons.module.css";
import { PageHeader } from "./PageHeader_new";
import { color3_bg } from "../../elements/Colors.module.css";
import { saving_buttons, saving_button, saved_button } from "./Page.module.css";


export class PageComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollTo: false
    };
  }

  tops = [];

  render() {
    let { history, data, qData, loading, dd, mutation } = this.props;

    let name = "";
    if (qData) {
      name = qData.organization ? qData.organization.name : qData.name;
    }

    return (
      <div className={container}>
        <PageHeader name={name} />

        {data.questions.map((d, i) => (
          <Section
            key={`section-${i}`}
            data={d}
            id={this.props.id}
            qData={qData}
            registerTop={top => this.tops.push(top)}
            mutation={mutation}
          />
        ))}

        <div className={saving_buttons}>
          {(loading && (
            <div className={saving_button}>
              <span>Saving</span>
              <i className="fa fa-spinner fa-spin" />
            </div>
          )) || (
            <div className={saved_button}>
              <span>Saved</span>
              <i className="fas fa-thumbs-up" />
            </div>
          )}
        </div>

        <NavButtons
          history={history}
          title={data.title}
          id={this.props.id}
          dd={dd}
          routeMap={this.props.routeMap}
          overview={this.props.overviewPage}
          search={this.props.search}
        />
      </div>
    );
  }
}
