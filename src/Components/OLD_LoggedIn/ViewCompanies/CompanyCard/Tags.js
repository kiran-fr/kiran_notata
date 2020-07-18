import React from "react";
import { Mutation } from "react-apollo";
import { putEvaluation_new } from "../../../../Apollo/Mutations";
import TagCompleter from "../../TagCompleter/TagCompleter";
import { section, section_title } from "./index.module.css";
import {
  tag_class,
  tag_edit_button
  // section,
  // section_title
} from "../../TagCompleter/TagCompleter.module.css";

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    const { item, tags, selected, selected_funnel_tags } = this.props;

    let getGroupName = tag => {
      if (!tag.group) return "";
      let group = tags.find(d => d.id === tag.group);
      if (!group) return "";
      return `${group.name}: `;
    };

    let getLastFunnelTags = () => {
      let funnels = {};
      for (let ft of selected_funnel_tags) {
        funnels[ft.group] = funnels[ft.group] || [];
        funnels[ft.group].push(ft);
      }

      let lastTags = [];
      for (let id in funnels) {
        let highestIndex = Math.max.apply(
          Math,
          funnels[id].map(o => o.index)
        );
        lastTags.push(funnels[id][highestIndex]);
      }
      return lastTags;
    };

    return (
      <div className={section}>
        <div className={section_title}>Tags:</div>
        {getLastFunnelTags().map((f, i) => (
          <div
            key={`f-${i}`}
            className={tag_class}
            // style={{ background: "#454b6c" }}
            style={{ background: "#df715d" }}
          >
            <span style={{ paddingRight: "4px" }}>
              <i className="fas fa-filter" />
            </span>
            <span>
              {getGroupName(f)} {f.name}
            </span>
          </div>
        ))}
        {selected.map((s, i) => (
          <div
            key={`s-${i}`}
            className={tag_class}
            style={{ background: "#df715d" }}
          >
            {getGroupName(s)} {s.name}
          </div>
        ))}
        <div
          className={tag_class}
          onClick={() => this.setState({ open: !this.state.open })}
          style={{
            paddingRight: "30px",
            background: "#bbb"
          }}
        >
          <span>add/remove tags</span>
          <div className={tag_edit_button}>
            <i className="fas fa-plus-circle" />
          </div>
        </div>

        {this.state.open && (
          <div
            style={{
              borderLeft: "2px solid #ddd",
              paddingLeft: "20px"
            }}
          >
            <Mutation mutation={putEvaluation_new}>
              {(mutate, res) => {
                return (
                  <TagCompleter
                    data={tags}
                    selected={selected}
                    selected_funnel_tags={selected_funnel_tags}
                    selectTag={tag => {
                      let n_tags = [...(item.n_tags || []), tag.id];
                      let variables = { input: { n_tags } };
                      variables.id = item.id;
                      mutate({
                        variables,
                        optimisticResponse: {
                          __typename: "Mutation",
                          putEvaluation_new: {
                            ...item,
                            n_tags
                          }
                        }
                      });
                    }}
                    unselectTag={tag => {
                      let n_tags = item.n_tags || [];
                      n_tags = n_tags.filter(t => t !== tag.id);
                      let variables = { input: { n_tags } };
                      variables.id = item.id;
                      mutate({
                        variables,
                        optimisticResponse: {
                          __typename: "Mutation",
                          putEvaluation_new: {
                            ...item,
                            n_tags
                          }
                        }
                      });
                    }}
                    setFunnelTags={tags => {
                      let n_funnel = tags.map(t => t.id);
                      let variables = { input: { n_funnel } };
                      variables.id = item.id;
                      mutate({
                        variables,
                        optimisticResponse: {
                          __typename: "Mutation",
                          putEvaluation_new: {
                            ...item,
                            n_funnel
                          }
                        }
                      });
                    }}
                  />
                );
              }}
            </Mutation>
          </div>
        )}
      </div>
    );
  }
}

export default Tags;
