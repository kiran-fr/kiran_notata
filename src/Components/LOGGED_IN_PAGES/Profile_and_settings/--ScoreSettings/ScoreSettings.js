import React from "react";
import {
  container,
  section,
  questions_class,
  question_class,
  options_class,
  option_class,
  option_input,
  section_title,
  question_title,
  option_title,
  red,
  green,
  open_settings,
  option_not_selected
} from "./ScoreSettings.module.css";
import classnames from "classnames";
import BackButton from "../../elements/BackButton";
import { GhostLoader } from "../../elements/GhostLoader";
import { cloneDeep, findIndex, omit } from "lodash";
import { Query, Mutation } from "@apollo/client/react/components";
import { getSettings } from "../../../Apollo/Queries";
import { updateSettings } from "../../../Apollo/Mutations";
import { viewCompanies } from "../../../routes";

import evaluationData from "../Pages/EvaluationPages/combinedData";
import factsData from "../Pages/InfoPages/combinedData";

import {
  color3_bg,
  color1_bg,
  color1,
  color3,
  color2
} from "../../Colors.module.css";
import { content_tag } from "../../../../routes.module.css";

const Options = ({ d, i, o, set, settings, field, prefix }) => {
  return (
    <div className={options_class}>
      {d.map((op, u) => {
        let hit = (settings[`${prefix}_${field}`] || []).find(
          ff => ff.key === op.val
        );
        let currentVal = hit ? hit.val : 0;
        return (
          <div key={`dd-${i}-${o}-${u}`}>
            <div className={option_class}>
              <div className={classnames(option_title, color1)}>{op.text}</div>

              <div>
                {[-1, 0, 1, 2, 3, 4, 5].map((iv, i) => (
                  <div
                    key={`dd-${i}-${o}-${u}-iv-${iv}`}
                    className={classnames(
                      option_input,
                      currentVal === iv ? color3_bg : option_not_selected
                    )}
                    onClick={() => {
                      set({
                        key: op.val,
                        val: iv,
                        field: `${prefix}_${field}`
                      });
                    }}
                  >
                    {iv}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Questions = ({ d, i, set, settings, prefix }) => (
  <div className={questions_class}>
    {d.map((q, o) => (
      <div key={`dd-${i}-${o}`} className={question_class}>
        {(q.options || []).length !== 0 && (
          <div>
            <div className={classnames(question_title, color1)}>{q.title}</div>
            <Options
              d={q.options}
              i={i}
              o={o}
              field={q.field}
              set={set}
              settings={settings}
              prefix={prefix}
            />
          </div>
        )}
      </div>
    ))}
  </div>
);

class ScoreSettingsComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let d = cloneDeep(this.props.qData);
    let rr = omit(d, ["__typename", "userId"]);
    let dd = {};
    Object.keys(rr).forEach(k => {
      if (rr[k]) dd[k] = rr[k].map(rk => ({ key: rk.key, val: rk.val }));
    });
    this.setState(dd);
  }

  set(d, cb) {
    let { key, val, field } = d;
    let f = this.state[field] ? cloneDeep(this.state[field]) : [];
    let index = findIndex(f, _f => _f.key === key);
    index === -1 ? f.push({ key, val }) : (f[index] = { key, val });
    this.setState({ [field]: f }, cb);
  }

  render() {
    let eData = (evaluationData || []).filter(cd => {
      if (cd.title === "Comments") return false;
      return true;
    });

    let fData = (factsData || []).filter(cd => {
      if (cd.title === "Materials") return false;
      if (cd.title === "Info") return false;
      return true;
    });

    return (
      <Mutation mutation={updateSettings}>
        {(mutate, { data, loading, error }) => {
          return (
            <div className={container}>
              {eData.map((d, i) => (
                <div className={section} key={`ed-${i}`}>
                  <div className={classnames(section_title, color1_bg)}>
                    {d.title}
                  </div>
                  {(d.questions || []).length !== 0 && (
                    <Questions
                      d={d.questions}
                      i={`ed-${i}`}
                      prefix="evaluation"
                      settings={this.state}
                      set={d => {
                        this.set(d, () => {
                          mutate({ variables: { input: this.state } });
                        });
                      }}
                    />
                  )}
                </div>
              ))}

              {fData.map((d, i) => (
                <div className={section} key={`fd-${i}`}>
                  <div className={section_title}>{d.title}</div>
                  {(d.questions || []).length !== 0 && (
                    <Questions
                      d={d.questions}
                      i={`fd-${i}`}
                      prefix="facts"
                      settings={this.state}
                      set={d => {
                        this.set(d, () => {
                          mutate({ variables: { input: this.state } });
                        });
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export class ScoreSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    return (
      <div className={content_tag}>
        <div style={{ maxWidth: "500px", margin: "auto" }}>
          <Query query={getSettings} fetchPolicy="cache-and-network">
            {({ data, error, loading }) => {
              if (loading) return <GhostLoader />;
              return (
                <ScoreSettingsComp
                  {...this.props}
                  qData={(data || {}).getSettings}
                />
              );
            }}
          </Query>
          <BackButton link={viewCompanies} />
        </div>
      </div>
    );
  }
}
