import React, { Component } from "react";
import classnames from "classnames";
import { cloneDeep, omit } from "lodash";

import { Mutation } from "react-apollo";
import { updateTags, createTag, deleteTag } from "../../../Apollo/Mutations";
import { Link } from "react-router-dom";
import { tagPage } from "../../../routes";
import {
  tag_class,
  tag_dropzone,
  tag_section,
  tag_section_title,
  tag_group_edit,
  tag_input,
  tag_edit_button,
  tags_container,
  modal_class,
  modal_class_inner,
  modal_container,
  close_modal,
  delete_tag,
  delete_tag_warning,
  tag_group_types,
  active,
  inactive,
  success_save,
  group_selector,
  grouped_tags,
  group_extend_button,
  selected_tag,
  funnel_tag,
  funnel_caret,
  funnel_filter,
  funnel_icon,
  tag_manage_link,
  with_button,
  tag_filter_input,
  section,
  section_title
} from "./TagCompleter.module.css";

import {
  color1_bg,
  color2_bg,
  color3_bg,
  color4_bg,
  color5_bg,
  color6_bg,
  color7_bg,
  color8_bg,
  color9_bg
} from "../../elements/Colors.module.css";

// *****************************
// * GETS TAGS THAT ARE GROUPS *
// *****************************
const getGroups = items => {
  return (
    items.filter(t => ["GROUP", "FUNNEL"].some(te => te === t.tag_type)) || []
  );
};

// ***********************
// * GETS TAGS IN GROUPS *
// ***********************
const getGroupedTags = items => {
  if (!items) return;

  // Get GROUP and FUNNEL tags
  const groups = getGroups(items);

  // Add placeholder for ungrouped tags
  let groupedTags = { no_group: [] };

  items.forEach(t => {
    // Addting ungrouped tags to the 'no_group'
    if ((!t.group && !t.tag_type) || t.group === "no_group") {
      groupedTags["no_group"].push(t);
    }

    // Stop if tag does not belong to group
    if (!t.group || t.group === "no_group") return;

    // Add tag to the right group
    groupedTags[t.group] = groupedTags[t.group] || [];
    groupedTags[t.group].push(t);
  });

  // Sort by index. If no index add to end.
  for (let groupId in groupedTags) {
    groupedTags[groupId] = groupedTags[groupId].sort((a, b) => {
      let A = a.index + 1 || groupedTags[groupId].length;
      let B = b.index + 1 || groupedTags[groupId].length;
      return A - B;
    });
  }

  return groupedTags;
};




// *************************
// * SELECT TAGS IN GROUPS *
// *************************
class GroupSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      value: "",
      selected: this.props.selected
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.selected === this.props.selected) return;
    this.setState({ selected: newProps.selected });
  }

  isSelected(tag) {
    let selected = this.state.selected.find(s => s.id === tag.id);
    return selected;
  }

  getSuggestedTags(groupId) {
    let tags = this.props.groupedTags[groupId] || [];
    if (this.state.value === "") {
      tags.filter(t => !this.isSelected(t))
    }
    let suggested = tags
      .filter(t => !this.isSelected(t))
      .filter(t =>
        t.name.toLowerCase().includes(this.state.value.toLowerCase())
      );
    return suggested;
  }

  getSelectedTags(groupId) {
    let groupedTags = this.props.groupedTags || {};
    let groupID = this.props.group.id;

    return (groupedTags[groupID] || []).filter(t => this.isSelected(t));
  }

  render() {
    let { group, groupedTags, selected, select, unSelect } = this.props;

    return (
      <div style={{ marginBottom: "5px" }}>
        <div
          className={group_selector}
          onClick={() => this.setState({ open: !this.state.open })}
          >
          <span>{group.name}</span>
          <span style={{ paddingLeft: "3px" }}>
            <i
              className={
                this.state.open ? "fas fa-caret-up" : "fas fa-caret-down"
              }
            />
          </span>
        </div>

        <div className={grouped_tags}>
          {!this.getSelectedTags(group.id).length && (
            <div style={{ marginBottom: "12px" }} />
          )}

          {/* SELECTED TAGS */}
          {this.getSelectedTags(group.id).map((t, o) => {
            return (
              <div
                key={`selected-${group.id}-tag-${t.id}`}
                className={classnames(
                  tag_class,
                  selected_tag,
                  this.state.open ? with_button : ""
                )}
                style={{ background: "#df715d" }}
                onClick={() => unSelect(t)}
              >
                {t.name}
                {this.state.open && (
                  <div className={tag_edit_button}>
                    <i className="fas fa-minus-circle" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={grouped_tags}>
          {this.state.open && (
            <div style={{ marginBottom: "10px" }}>
              {/* TAG INPUT */}
              {
                <div className={tag_filter_input}>
                  <input
                    type="text"
                    value={this.state.value}
                    onChange={e => this.setState({ value: e.target.value })}
                    placeholder={
                      this.props.placeholder ||
                      (this.props.noAdd
                        ? "Filter tags"
                        : "Search, or add new tag")
                    }
                  />
                  {
                    <Mutation mutation={createTag}>
                      {(mutate, { data, loading, error }) => {
                        if (
                          !loading &&
                          !error &&
                          data &&
                          this.state.submitting
                        ) {
                          this.setState({ submitting: false, value: "" });
                          this.props.addNewTag(data.createTag);
                        }

                        if (this.getSuggestedTags(group.id).length) {
                          return <span />;
                        }

                        if (this.state.submitting) {
                          return <i className="fas fa-spinner fa-spin" />;
                        }

                        if (this.props.noAdd) return <span />;

                        return (
                          <i
                            style={{
                              visibility:
                                this.state.value === "" ? "hidden" : "visible"
                            }}
                            className="fas fa-plus-circle"
                            onClick={() => {
                              if (loading) return;
                              let variables = {
                                input: {
                                  name: this.state.value,
                                  group: group.id
                                }
                              };
                              mutate({ variables });
                              this.setState({ submitting: true });
                            }}
                          />
                        );
                      }}
                    </Mutation>
                  }
                </div>
              }


              <TagSelector
                select={select}
                tags={this.getSuggestedTags(group.id)}
              />

            </div>
          )}
        </div>
      </div>
    );
  }
}


class TagSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  render() {

    let { tags, select } = this.props;

    return (
      <div>
        {
          tags.map((t, i) => (
            <div
              key={`tag-${t.id}`}
              className={classnames(tag_class, with_button)}
              style={{ display: i > 10 && !this.state.open ? "none" : "inline-block" }}
              onClick={() => select(t)}
            >
              {t.name}
              <div className={tag_edit_button}>
                <i className="fas fa-plus-circle" />
              </div>
            </div>
          ))
        }

        {
          tags.length > 10 && (
            <div
              className={classnames(tag_class, with_button)}
              style={{
                display: "inline-block",
                background: "#bbb"
              }}
              onClick={() => this.setState({open: !this.state.open})}
            >
              
              {
                this.state.open && (
                  <div>
                    Hide {tags.length - 10} tags
                    <div className={tag_edit_button}>
                      <i className="fas fa-minus-circle" />
                    </div>
                  </div>
                )
              }

              {
                !this.state.open && (
                  <div>
                    Show {tags.length - 10} tags
                    <div className={tag_edit_button}>
                      <i className="fas fa-plus-circle" />
                    </div>
                  </div>
                )
              }



            </div>
          )
        }


      </div>



    )
  }
}


// *****************
// * SELECT FUNNEL *
// *****************
class FunnelSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  getLastTag() {
    let tags = this.props.selected_funnel_tags.filter(
      t => t.group === this.props.funnel.id
    );
    return tags[tags.length - 1];
  }

  render() {
    let {
      funnel,
      groups,
      groupedTags,
      select,
      unSelect,
      selected_funnel_tags
    } = this.props;

    return (
      <div style={{ marginBottom: "5px" }}>
        <div
          className={group_selector}
          onClick={() => this.setState({ open: !this.state.open })}
        >
          <span style={{ paddingRight: "4px" }}>
            <i className="fas fa-filter" />
          </span>
          <span>{funnel.name}</span>
          <span style={{ paddingLeft: "3px" }}>
            <i
              className={
                this.state.open ? "fas fa-caret-up" : "fas fa-caret-down"
              }
            />
          </span>
        </div>

        <div className={grouped_tags}>
          {!this.getLastTag() && <div style={{ marginBottom: "12px" }} />}

          {this.getLastTag() && (
            <div
              className={classnames(
                tag_class,
                selected_tag,
                this.state.open ? with_button : ""
              )}
              style={{ background: "#454b6c" }}
            >
              {this.getLastTag().name}
              {this.state.open && (
                <div
                  className={tag_edit_button}
                  onClick={() => unSelect(funnel)}
                >
                  <i className="fas fa-minus-circle" />
                </div>
              )}
            </div>
          )}
        </div>

        {this.state.open &&
          groupedTags[funnel.id].map((t, i) => {
            let selected = selected_funnel_tags.some(tag => tag.id === t.id);
            return (
              <div key={`funnel-t-${i}`}>
                <div
                  className={tag_class}
                  style={{
                    // display: "block",
                    opacity: selected ? 1 : 0.7,
                    paddingLeft: "28px"
                  }}
                  onClick={() => select(t)}
                >
                  <span className={funnel_icon}>
                    {(selected && <i className="fas fa-check-circle" />) || (
                      <i className="far fa-circle" />
                    )}
                  </span>

                  <span>{t.name}</span>
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}

class Comp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupedTags: getGroupedTags(this.props.data || []),
      groups: getGroups(this.props.data || []),
      selected: this.props.selected || [],
      selected_funnel_tags: this.props.selected_funnel_tags || []
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.props === newProps) return;
    this.setState({
      groupedTags: getGroupedTags(newProps.data || []),
      groups: getGroups(newProps.data || []),
      selected: newProps.selected || [],
      selected_funnel_tags: newProps.selected_funnel_tags || []
    });
  }

  selectTag(tag) {
    this.props.selectTag(tag);
    this.setState({
      selected: [...this.state.selected, tag]
    });
  }

  unselectTag(tag) {
    this.props.unselectTag(tag);
    this.setState({
      selected: this.state.selected.filter(s => tag.id !== s.id)
    });
  }

  addNewTag(tag) {
    this.setState(
      {
        selected: [...this.state.selected, tag],
        groupedTags: {
          ...this.state.groupedTags,
          [tag.group]: [...this.state.groupedTags[tag.group], tag]
        }
      },
      () => {
        this.props.selectTag(tag);
      }
    );
  }

  selectFunnelTag(tag) {
    let funnelId = tag.group;
    let funnelTags = this.state.groupedTags[funnelId].map((t, index) => ({
      ...t,
      index
    }));
    let index = funnelTags.find(t => t.id === tag.id).index;
    let selectedFunnelTags = funnelTags.filter(t => t.index <= index);

    let otherTags = this.state.selected_funnel_tags.filter(
      t => t.group !== tag.group
    );
    let total = [...otherTags, ...selectedFunnelTags];

    this.setState({
      selected_funnel_tags: total
    });
    this.props.setFunnelTags(total);
  }

  unselectFunnel(tag) {
    let selected_funnel_tags = this.state.selected_funnel_tags.filter(
      t => t.group !== tag.id
    );

    this.props.setFunnelTags(selected_funnel_tags);
    this.setState({ selected_funnel_tags });
  }

  render() {
    return (
      <div
        style={{
          width: "100%",
          marginBottom: "0px"
          // borderBottom: "1px dashed #ddd",
          // paddingBottom: "10px"
        }}
      >
        {/* TAG INPUT */}
        <div className={tags_container}>
          {/* FUNNEL SELECTOR */}
          <div className={section}>
            <div className={section_title}>Funnels</div>

            {this.state.groups
              .filter(g => g.tag_type === "FUNNEL")
              .map((funnel, i) => (
                <FunnelSelector
                  key={`funnel-${i}`}
                  funnel={funnel}
                  groups={this.state.groups}
                  groupedTags={this.state.groupedTags}
                  selected_funnel_tags={this.state.selected_funnel_tags}
                  select={tag => {
                    this.selectFunnelTag(tag);
                  }}
                  unSelect={funnel => {
                    this.unselectFunnel(funnel);
                  }}
                />
              ))}
          </div>

          {/* GROUPED TAG INPUT */}
          <div className={section}>
            <div className={section_title}>Tags</div>

            {this.state.groups
              .filter(g => g.tag_type === "GROUP")
              .map((g, i) => (
                <GroupSelector
                  key={`group-${g.id}-${i}`}
                  group={g}
                  selectedTag={this.props.selectedTag}
                  groupedTags={this.state.groupedTags}
                  selected={this.state.selected}
                  select={tag => this.selectTag(tag)}
                  unSelect={tag => this.unselectTag(tag)}
                  addNewTag={tag => this.addNewTag(tag)}
                  noAdd={this.props.noAdd}
                />
              ))}
          </div>
        </div>

        {!this.props.noAdd && (
          <div className={tag_manage_link}>
            <Link to={tagPage}>Manage tags</Link>
          </div>
        )}
      </div>
    );
  }
}

export default Comp;
