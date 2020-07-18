import React from "react";
import { Mutation } from "react-apollo";
import { cloneDeep, omit } from "lodash";
import classnames from "classnames";
import { color3 } from "../../elements/Colors.module.css";
import { gridContainer, gridTitle } from "../../elements/Grid.module.css";
import { multi_line_wrapper } from "../../elements/Form.module.css";
import { container, section, add_line_button } from "./Section.module.css";

import {
  InputTextArea,
  InputText,
  InputRadio,
  InputCheck,
  InputUrls
} from "../../elements/FormElements";

class SectionComp extends React.Component {
  constructor(props) {
    super(props);
    let { data } = this.props;

    if (data.type === "radio") {
      this.state = { selected: false };
    }

    if (data.type === "check") {
      this.state = {};
      (data.options || []).forEach(o => {
        this.state[o.val] = false;
      });
    }

    if (data.type === "textInput") {
      this.state = { val: "" };
    }

    if (data.type === "multi_line") {
      this.state = { vals: [""] };
    }

    if (data.type === "urls") {
      this.state = { vals: [""] };
    }

    this.ref = React.createRef();
  }

  componentWillUpdate(newProps) {
    if (newProps === this.props) return;

    if (newProps.qData) {
      let { field, type } = this.props.data;
      let { qData } = newProps;
      let val = qData[field];
      if (!val) return;

      if (type === "radio" && this.state.selected !== val) {
        this.setState({ selected: val });
      }

      if (type === "textInput" && this.state.val !== val) {
        this.setState({ val: val });
      }

      if (type === "check") {
        let vals = {};
        // Fallback for felter endret fra radio til check
        if (typeof val === "string") val = [val];
        val.forEach(v => (vals[v] = true));
        let cont = val.some(v => !this.state[v]);
        if (cont) this.setState({ ...vals });
      }

      if (type === "multi_line" && this.state.vals !== val) {
        this.setState({ vals: val.length ? val : [""] });
      }

      if (type === "urls" && this.state.vals !== val) {
        this.setState({ vals: val.length ? val : [""] });
      }
    }
  }

  componentDidMount() {
    this.props.registerTop(this.ref.current.offsetTop);
  }

  render() {
    let { data, mutation } = this.props;

    return (
      <div className={section} ref={this.ref}>
        <div>
          <div className={classnames(color3, gridTitle)}>{data.title}</div>
          <div className={gridContainer}>
            {data.type === "multi_line" && (
              <div className={multi_line_wrapper}>
                {(this.state.vals || []).map((v, i) => (
                  <InputText
                    key={`multi-${i}`}
                    val={v}
                    onChange={nVal => {
                      let newState = cloneDeep(this.state.vals);
                      newState[i] = nVal;
                      this.setState({ vals: newState });
                    }}
                    deleteLink={() => {
                      let newVals = this.state.vals
                        .filter((v, ii) => i !== ii)
                        .map(v => omit(v, ["__typename"]));
                      let variables = {
                        orgId: this.props.id,
                        input: { [data.field]: newVals }
                      };
                      mutation({ variables });
                    }}
                    save={() => {
                      let variables = {
                        orgId: this.props.id,
                        input: {
                          [data.field]: this.state.vals.filter(vv => vv !== "")
                        }
                      };
                      mutation({ variables });
                    }}
                  />
                ))}
                <div
                  onClick={() => {
                    let newState = cloneDeep(this.state.vals);
                    newState.push("");
                    this.setState({ vals: newState });
                  }}
                  className={add_line_button}
                >
                  + add line
                </div>
              </div>
            )}

            {data.type === "urls" && (
              <div className={multi_line_wrapper}>
                {(this.state.vals || []).map((v, i) => {
                  return (
                    <InputUrls
                      key={`multi-${i}`}
                      val={v}
                      onChange={nVal => {
                        let newState = cloneDeep(this.state.vals);
                        newState[i] = nVal;
                        this.setState({ vals: newState });
                      }}
                      deleteLink={() => {
                        let newVals = this.state.vals
                          .filter((v, ii) => i !== ii)
                          .map(v => omit(v, ["__typename"]));

                        let variables = {
                          orgId: this.props.id,
                          input: { [data.field]: newVals }
                        };
                        mutation({ variables });
                      }}
                      setData={nVal => {
                        let newState = cloneDeep(this.state.vals);
                        newState[i] = nVal;
                        this.setState({ vals: newState }, () => {
                          let vv = cloneDeep(this.state.vals).map(v => {
                            let r = {};
                            for (let key in v) {
                              if (v[key] && key !== "__typename")
                                r[key] = v[key];
                            }
                            return r;
                          });
                          let variables = {
                            orgId: this.props.id,
                            input: { [data.field]: vv }
                          };
                          mutation({ variables });
                        });
                      }}
                      save={() => {
                        let vv = cloneDeep(this.state.vals).map(v => {
                          let r = {};
                          for (let key in v) {
                            if (v[key] && key !== "__typename") r[key] = v[key];
                          }
                          return r;
                        });
                        let variables = {
                          orgId: this.props.id,
                          input: { [data.field]: vv }
                        };
                        mutation({ variables });
                      }}
                    />
                  );
                })}
                <div
                  onClick={() => {
                    let newState = cloneDeep(this.state.vals);
                    newState.push({ url: "" });
                    this.setState({ vals: newState });
                  }}
                  className={add_line_button}
                >
                  + add line
                </div>
              </div>
            )}

            {data.type === "textInput" && (
              <InputTextArea
                val={this.state.val}
                onChange={nVal => this.setState({ val: nVal })}
                save={() => {
                  let variables = {
                    orgId: this.props.id,
                    input: { [data.field]: this.state.val }
                  };
                  mutation({ variables });
                }}
              />
            )}

            {data.type === "radio" &&
              data.options.map((o, i) => (
                <InputRadio
                  key={`${o.field}-${i}`}
                  active={this.state.selected === o.val}
                  label={o.text}
                  onClick={() => {
                    this.setState({ selected: o.val });
                    let variables = {
                      orgId: this.props.id,
                      input: { [data.field]: o.val }
                    };
                    mutation({ variables });
                  }}
                />
              ))}

            {data.type === "check" &&
              data.options.map((o, i) => (
                <InputCheck
                  key={`${o.field}-${i}`}
                  active={this.state[o.val]}
                  label={o.text}
                  onClick={() => {
                    this.setState({ [o.val]: !this.state[o.val] }, () => {
                      let array = Object.keys(this.state).filter(
                        k => this.state[k]
                      );
                      let variables = {
                        orgId: this.props.id,
                        input: { [data.field]: array }
                      };
                      mutation({ variables });
                    });
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export const Section = ({ ...props }) => <SectionComp {...props} />;
