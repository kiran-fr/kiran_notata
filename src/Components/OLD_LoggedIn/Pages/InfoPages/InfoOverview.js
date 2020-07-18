import React from "react";
import { Redirect, Switch, withRouter } from "react-router-dom";
import qp from "../../../../utils/queryParams";
import classnames from "classnames";
import {
  gridContainer,
  gridItem,
  progress_container,
  progress_inner,
  page_title,
  edit_title
} from "../../../elements/Grid.module.css";
import { color1, color3 } from "../../../elements/Colors.module.css";
import { noselect } from "../../../elements/GeneralStyle.module.css";
import BackButton from "../../../elements/BackButton";
import BigButton from "../../../elements/BigButton";

import {
  inviteStartup,
  info_page_business,
  info_page_money,
  info_page_materials,
  info_page_info,
  info_edit_company_name
} from "../../../../routes";

import data from "./combinedData";
import { Query, Mutation } from "react-apollo";
import { getOrganization } from "../../../../Apollo/Queries";
import { inviteStartupMutation } from "../../../../Apollo/Mutations";

import { GhostLoader } from "../../../elements/GhostLoader";
import { button_class } from "../../../elements/Style.module.css";
// import { invited_class } from "../Page.module.css";

import InviteStartup from "./InviteStartup";

export class InfoOverviewComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirect: false };
  }

  componentDidMount() {
    this.routeMap = {
      Business: info_page_business,
      Money: info_page_money,
      Materials: info_page_materials,
      Info: info_page_info
    };
  }

  render() {
    let { history, qData, loading } = this.props;

    if (!this.routeMap) return <div />;

    const getProgress = d => {
      if (!qData) return;
      let finished = 0;
      d.questions.forEach(q => {
        let d = qData[q.field];
        if (Array.isArray(d)) {
          let f = d.filter(a => a.url);
          if (f.length) finished++;
        } else {
          if (d) finished++;
        }
      });
      return Math.round((finished / d.questions.length) * 100);
    };

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    return (
      <content>
        <div>
          {loading && <GhostLoader />}

          <div className={classnames(page_title, color1)}>
            {qData.name || <span>&nbsp;</span>}
            <i
              className={classnames(edit_title, color3, "fal fa-pen")}
              onClick={() => {
                this.setState({
                  redirect: `${info_edit_company_name}?id=${this.props.id}`
                });
              }}
            />
          </div>

          <InviteStartup email={qData.invitedStartup} orgId={this.props.id} />

          <div className={gridContainer}>
            {data.map((d, i) => (
              <BigButton
                key={`k-${i}`}
                label={d.title}
                className={d.className}
                progress={getProgress(d)}
                link={`${this.routeMap[d.title]}?id=${this.props.id}`}
              />
            ))}
            {
              // <BackButton history={history} />
            }
          </div>
        </div>
      </content>
    );
  }
}

export class InfoOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: null };
  }

  componentDidMount() {
    let { id } = qp(this.props.location.search);
    this.setState({ id: id[0] });
  }

  render() {
    if (!this.state.id) return <span />;

    return (
      <Query query={getOrganization} variables={{ id: this.state.id }}>
        {({ data, error, loading }) => {
          return (
            <InfoOverviewComp
              qData={(data || {}).getOrganization || {}}
              id={this.state.id}
              loading={loading}
              {...this.props}
            />
          );
        }}
      </Query>
    );
  }
}
