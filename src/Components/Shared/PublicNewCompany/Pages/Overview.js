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
import { noselect } from "../../../elements/GeneralStyle.module.css";
import BackButton from "../../../elements/BackButton";
import BigButton from "../../../elements/BigButton";
import { color1, color3 } from "../../../elements/Colors.module.css";

import {
  public_new_company,
  public_new_company_page_business,
  public_new_company_page_money,
  public_new_company_page_materials,
  public_new_company_page_info,
  public_edit_company_name
} from "../../../../routes";

import { Query, Mutation } from "react-apollo";
import data from "../../../LoggedIn/Pages/InfoPages/combinedData";
import { GhostLoader } from "../../../elements/GhostLoader";
import { centerBox, error_box } from "../../../elements/Style.module.css";
import {
  invited_class,
  not_invited_class
} from "../../../LoggedIn/Pages/Page.module.css";

import { public_getOrganization } from "../../../../Apollo/Queries";
import { public_updateOrganization } from "../../../../Apollo/Mutations";


const terms = "By accepting the terms and conditions you grant the receiver of this data full rights to share and distribute the data with people inside and outside their organization as they see fit. You may change, edit and delete information after you have submitted this data by accessing this url."


const TermsButton = props => {
  let outerStyle = {
    width: "300px",
    margin: "auto",
    marginTop: "40px",
    position: "relative"
  };

  let innerStyle = {
    background: "white",
    boxShadow:
      "0 7px 14px 0 rgba(50, 50, 93, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.07)",
    padding: "14px 20px"
  };

  let toggleStyle = {
    position: "absolute",
    top: "-2px",
    right: "15px",
    fontSize: "37px",
    cursor: "pointer"
  };

  let finishedButton = {
    fontSize: "12px",
    marginTop: "15px",
    color: "gray",
    lineHeight: 2,
    padding: "4px"
  };

  let terms_style = {
    textAlign: "center",
    margin: "auto",
    fontSize: "12px",
    color: "gray",
    maxWidth: "600px",
    marginTop: "50px"
  }

  return (
    <Mutation mutation={public_updateOrganization}>
      {(mutate, mRes) => {
        return (
          <div>

            <div style={terms_style}>
              {terms}
            </div>            

            <div style={outerStyle}>

              <div style={innerStyle}>
                <span>Accept terms and conditions</span>
                <div
                  style={toggleStyle}
                  onClick={() => {
                    let variables = {
                      id: props.orgId,
                      email: props.email,
                      input: {
                        accepted_terms: !props.data.accepted_terms,
                        terms
                      }
                    };
                    mutate({
                      variables,
                      optimisticResponse: {
                        __typename: "Mutation",
                        public_updateOrganization: {
                          ...props.data,
                          accepted_terms: !props.data.accepted_terms
                        }
                      }
                    });
                  }}
                >
                  {(props.data.accepted_terms && (
                    <i class="fal fa-toggle-on" style={{ color: "green" }} />
                  )) || <i class="fal fa-toggle-off" style={{ color: "gray" }} />}
                </div>
              </div>
            </div>

          </div>
        );
      }}
    </Mutation>
  );
};

const DoneButton = props => {
  let outerStyle = {
    width: "300px",
    margin: "auto",
    marginTop: "40px",
    position: "relative"
  };

  let innerStyle = {
    background: "white",
    boxShadow:
      "0 7px 14px 0 rgba(50, 50, 93, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.07)",
    padding: "14px 20px"
  };

  let toggleStyle = {
    position: "absolute",
    top: "-2px",
    right: "15px",
    fontSize: "37px",
    cursor: "pointer"
  };

  let finishedButton = {
    fontSize: "12px",
    marginTop: "15px",
    color: "gray",
    lineHeight: 2,
    padding: "4px"
  };

  let terms_style = {
    textAlign: "center",
    margin: "auto",
    fontSize: "12px",
    color: "gray",
    maxWidth: "600px",
    marginTop: "50px"
  }

  return (
    <Mutation mutation={public_updateOrganization}>
      {(mutate, mRes) => {
        return (
          <div>
            <div style={terms_style}>
              By toggeling the button below to the "on" state an email will be sent to the person that invited you to fill out this form. You will still have access to edit the information after clicking this button. If you toggle it to "off" and then back to "on" again, another email will be sent.
            </div>
            <div style={outerStyle}>
              <div style={innerStyle}>
                <span>I'm finished</span>
                <div
                  style={toggleStyle}
                  onClick={() => {
                    let variables = {
                      id: props.orgId,
                      email: props.email,
                      input: { isFinished: !props.data.isFinished }
                    };
                    // mutate({variables})
                    mutate({
                      variables,
                      optimisticResponse: {
                        __typename: "Mutation",
                        public_updateOrganization: {
                          ...props.data,
                          isFinished: !props.data.isFinished
                        }
                      }
                    });
                  }}
                >
                  {(props.data.isFinished && (
                    <i class="fal fa-toggle-on" style={{ color: "green" }} />
                  )) || <i class="fal fa-toggle-off" style={{ color: "gray" }} />}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Mutation>
  );
};

export class InfoOverviewComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirect: false };
  }

  componentDidMount() {
    this.routeMap = {
      Business: public_new_company_page_business,
      Money: public_new_company_page_money,
      Materials: public_new_company_page_materials,
      Info: public_new_company_page_info
    };
  }

  render() {
    let { history, qData, email, orgId, loading } = this.props;
    const getProgress = d => {
      if (!qData) return;
      let finished = 0;
      d.questions.forEach(q => {
        if (qData[q.field]) finished++;
      });
      return Math.round((finished / d.questions.length) * 100);
    };

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    return (
      <content>
        {loading && <GhostLoader />}
        <div className={classnames(page_title, color1)}>
          {qData.name || <span>&nbsp;</span>}
          <i
            className={classnames(edit_title, color3, "fal fa-pen")}
            onClick={() => {
              this.setState({
                redirect: `${public_edit_company_name}?orgId=${this.props.orgId}&email=${this.props.email}`
              });
            }}
          />
        </div>

        {
          <div className={gridContainer}>
            {data.map((d, i) => (
              <BigButton
                key={`k-${i}`}
                label={d.title}
                className={d.className}
                progress={getProgress(d)}
                onClick={() => {
                  this.setState({
                    redirect: `${this.routeMap[d.title]}?orgId=${
                      this.props.orgId
                    }&email=${this.props.email}`
                  });
                }}
              />
            ))}
          </div>
        }

        <TermsButton data={qData} email={email} orgId={orgId} /> 
        <DoneButton data={qData} email={email} orgId={orgId} />

      </content>
    );
  }
}

export class StartupCreateCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = { orgId: null, email: null };
  }

  componentDidMount() {
    let { orgId, email } = qp(this.props.location.search);
    this.setState({ orgId: orgId[0], email: email[0] });
  }

  render() {
    if (!this.state.orgId) return <span />;

    return (
      <Query
        query={public_getOrganization}
        variables={{ id: this.state.orgId, email: this.state.email }}
      >
        {({ data, error, loading }) => {
          console.log("{ data, error, loading }", { data, error, loading });

          if (error) {
            return (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "96px" }}>💥</div>
                <div className={error_box}>
                  Ooops. Seems like something went wrong...
                </div>
              </div>
            );
          }

          return (
            <InfoOverviewComp
              qData={(data || {}).public_getOrganization || {}}
              orgId={this.state.orgId}
              email={this.state.email}
              loading={loading}
              {...this.props}
            />
          );
        }}
      </Query>
    );
  }
}

export default StartupCreateCompany;
