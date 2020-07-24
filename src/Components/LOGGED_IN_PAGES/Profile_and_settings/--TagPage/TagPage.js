import React, { Component } from "react";
import { cloneDeep, omit } from "lodash";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GhostLoader } from "../../../elements/GhostLoader";
import { Query, Mutation } from "@apollo/client/react/components";
import { getTags } from "../../../../Apollo/Queries";
import { updateTags, createTag, deleteTag } from "../../../../Apollo/Mutations";
import {
  tag_class,
  tag_dropzone,
  tag_section,
  tag_section_title,
  tag_group_edit,
  tag_input,
  tag_edit_button,
  modal_class,
  modal_class_inner,
  modal_container,
  close_modal,
  delete_tag,
  delete_tag_warning,
  tag_group_types,
  active,
  inactive,
  success_save
} from "./TagPage.module.css";
import {
  color1_bg,
  color2_bg,
  color3_bg,
  color4_bg,
  color5_bg,
  color6_bg
} from "../../../elements/Colors.module.css";
import { content_tag } from "../../../../routes.module.css";

// *****************************
// * GETS TAGS THAT ARE GROUPS *
// *****************************
const getGroups = items =>
  items.filter(t => ["GROUP", "FUNNEL"].some(te => te === t.tag_type));

// ***********************
// * GETS TAGS IN GROUPS *
// ***********************
const getGroupedTags = items => {
  // Get GROUP and FUNNEL tags
  const groups = getGroups(items);

  console.log("groups", groups);

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
// * ADD NEW TAG COMPONENT *
// *************************
class AddTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || "",
      submitting: false
    };
  }

  render() {
    let { groupId, index } = this.props;

    return (
      <Mutation mutation={createTag}>
        {(mutate, { data, loading, error }) => {
          if (!loading && !error && data && this.state.submitting) {
            this.setState({ submitting: false, value: "" });
            this.props.setVal(data.createTag);
          }

          return (
            <div className={tag_input}>
              <label>
                <input
                  type="text"
                  value={this.state.value}
                  onChange={e => this.setState({ value: e.target.value })}
                  placeholder="Add tag"
                />

                {!this.state.submitting && (
                  <i
                    style={{
                      visibility: this.state.value === "" ? "hidden" : "visible"
                    }}
                    className="fas fa-plus-circle"
                    onClick={() => {
                      if (this.state.submitting) return;
                      let variables = {
                        input: {
                          name: this.state.value,
                          group: groupId,
                          index
                        }
                      };
                      mutate({ variables });
                      this.setState({ submitting: true });
                    }}
                  />
                )}

                {this.state.submitting && (
                  <i className="fas fa-spinner fa-spin" />
                )}
              </label>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

// *******************************
// * EDIT EXISTING TAG COMPONENT *
// *******************************
class EditTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.tag.name,
      submitting: false,
      success: false
    };
  }

  render() {
    let { tag, setLoading } = this.props;
    let { groupId, index, name, tag_type } = tag;

    return (
      <Mutation mutation={updateTags}>
        {(mutate, { data, loading, error }) => {
          if (!loading && !error && data && this.state.submitting) {
            this.setState({ submitting: false, success: true });
            this.props.setVal(data.updateTags[0]);
          }
          return (
            <div>
              {this.state.success && (
                <div className={success_save}>Successfully saved</div>
              )}
              <div className={tag_input}>
                <label>
                  <input
                    type="text"
                    value={this.state.value}
                    onChange={e =>
                      this.setState({ value: e.target.value, success: false })
                    }
                    placeholder="Cannot be empty"
                  />
                  {!this.state.submitting && (
                    <i
                      style={{
                        visibility:
                          this.state.value === "" ? "hidden" : "visible"
                      }}
                      className="fas fa-plus-circle"
                      onClick={() => {
                        if (this.state.submitting) return;
                        let variables = {
                          input: [
                            {
                              ...omit(tag, [
                                "createdBy",
                                "createdAt",
                                "updatedAt",
                                "__typename"
                              ]),
                              name: this.state.value
                            }
                          ]
                        };
                        mutate({ variables });
                        this.setState({ submitting: true });
                      }}
                    />
                  )}

                  {this.state.submitting && (
                    <i className="fas fa-spinner fa-spin" />
                  )}
                </label>

                {tag_type && (
                  <div className={tag_group_types}>
                    <div
                      className={tag_type === "GROUP" ? color3_bg : inactive}
                      onClick={() => {
                        if (tag_type === "GROUP") return;
                        let variables = {
                          input: [
                            {
                              ...omit(tag, [
                                "createdBy",
                                "createdAt",
                                "updatedAt",
                                "__typename"
                              ]),
                              tag_type: "GROUP"
                            }
                          ]
                        };
                        mutate({ variables });
                        setLoading();
                        this.setState({ submitting: true });
                      }}
                    >
                      Group
                    </div>
                    <div
                      className={tag_type === "FUNNEL" ? color3_bg : inactive}
                      onClick={() => {
                        if (tag_type === "FUNNEL") return;
                        let variables = {
                          input: [
                            {
                              ...omit(tag, [
                                "createdBy",
                                "createdAt",
                                "updatedAt",
                                "__typename"
                              ]),
                              tag_type: "FUNNEL"
                            }
                          ]
                        };
                        mutate({ variables });
                        setLoading();
                        this.setState({ submitting: true });
                      }}
                    >
                      Funnel
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

// *******************************
// * MODAL TO EDIT OR DELETE TAG *
// *******************************
class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      deleting: false
    };
  }

  render() {
    let { tag, show, close, updatedTag, deletedTag } = this.props;

    if (!show || !tag) return <span />;

    return (
      <div className={modal_class}>
        <div className={modal_class_inner}>
          <div className={modal_container}>
            <div className={close_modal} onClick={() => close()}>
              Close
            </div>

            <EditTag
              index={tag.index}
              groupId={tag.group || "no_group"}
              tag={tag}
              setVal={nVal => {
                updatedTag(nVal);
                this.setState({ loading: false });
              }}
              setLoading={() => {
                this.setState({ loading: true });
              }}
            />

            <Mutation mutation={deleteTag}>
              {(mutate, { data, loading, error }) => {
                if (!loading && !error && data && this.state.loading) {
                  this.setState({ loading: false, deleting: false });
                  this.props.deletedTag(tag);
                }

                return (
                  <div
                    className={delete_tag}
                    onClick={() => {
                      if (
                        window.confirm(
                          tag.tag_type
                            ? "Are you sure you want to delete this tag group?."
                            : "Are you sure you want to delete this tag and remove it from all items it's been added to? This action cannot be undone."
                        )
                      ) {
                        this.setState({ loading: true, deleting: true });
                        let variables = { id: tag.id };
                        mutate({ variables });
                      } else {
                        /* Do nothing */
                      }
                    }}
                  >
                    {tag.tag_type
                      ? "Delete tag group"
                      : "Delete tag permanently"}
                  </div>
                );
              }}
            </Mutation>

            <div className={delete_tag_warning}>
              {tag.tag_type
                ? 'No tags will be deleted. All tags within this group will be transfered to the "ungrouped section"'
                : "This will permanently remove tag from all items you've added it to previously."}
            </div>
          </div>

          {this.state.deleting && <GhostLoader />}
        </div>
      </div>
    );
  }
}

// **********************************
// * CREATE NEW TAG GROUP COMPONENT *
// **********************************
class CreateNewGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      submitting: false,
      show: true
    };
  }

  render() {
    return (
      <Mutation mutation={createTag}>
        {(mutate, { data, loading, error }) => {
          if (!loading && !error && data && this.state.submitting) {
            this.setState({ submitting: false, value: "" });
            this.props.setVal(data.createTag);
          }
          return (
            <div>
              <div
                onClick={() => {
                  this.setState({
                    show: true
                  });
                }}
              >
                Create new tag group
              </div>
              {this.state.show && (
                <div className={tag_input}>
                  <label>
                    <input
                      type="text"
                      value={this.state.value}
                      placeholder="Group name"
                      onChange={e => this.setState({ value: e.target.value })}
                    />

                    {!this.state.submitting && (
                      <i
                        style={{
                          visibility:
                            this.state.value === "" ? "hidden" : "visible"
                        }}
                        className="fas fa-plus-circle"
                        onClick={() => {
                          this.setState({ submitting: true });
                          let variables = {
                            input: {
                              name: this.state.value,
                              tag_type: "GROUP",
                              index: this.props.index
                            }
                          };
                          mutate({ variables });
                          this.setState({ submitting: true });
                        }}
                      />
                    )}

                    {this.state.submitting && (
                      <i className="fas fa-spinner fa-spin" />
                    )}
                  </label>
                </div>
              )}
            </div>
          );
        }}
      </Mutation>
    );
  }
}

class Comp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupedTags: getGroupedTags(this.props.data),
      groups: getGroups(this.props.data),
      showModal: false
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) return;

    let groupedTags = cloneDeep(this.state.groupedTags);
    let { groups } = this.state;

    let fromGroupId = result.source.droppableId;
    let fromGroup = groupedTags[fromGroupId];
    let fromIndex = result.source.index;

    let toGroupId = result.destination.droppableId;
    let toGroup = groupedTags[toGroupId];
    let toIndex = result.destination.index;
    if (!toGroup) toGroup = groupedTags[toGroupId] = [];

    let [removed] = fromGroup.splice(fromIndex, 1);
    toGroup.splice(toIndex, 0, {
      ...removed,
      group: toGroupId,
      index: toIndex
    });

    let parentFromGroup = groups.find(g => g.id === fromGroupId);
    if (parentFromGroup) {
      fromGroup = fromGroup.map((t, index) => ({ ...t, index }));
    }

    let parentToGroup = groups.find(g => g.id === toGroupId);
    if (parentToGroup) {
      toGroup = toGroup.map((t, index) => ({ ...t, index }));
    }

    let input = [...toGroup];
    if (fromGroupId !== toGroupId) {
      input = [...fromGroup, ...toGroup];
    }

    let inp = input.map(ii =>
      omit(ii, ["createdBy", "createdAt", "updatedAt", "__typename"])
    );
    let unique = [...new Set(inp)];

    this.props.mutate({ variables: { input: unique } });

    this.setState({
      groupedTags: {
        ...groupedTags,
        ...fromGroup,
        ...toGroup
      }
    });
  }

  render() {
    return (
      <div>
        {
          // <ShareTags
          //   data={this.props.data}
          // />
        }

        <DragDropContext onDragEnd={this.onDragEnd}>
          {/* GROUPS */}
          {this.state.groups
            .sort((a, b) => a.index - b.index)
            .map(group => {
              let isFunnel = group.tag_type === "FUNNEL";
              return (
                <div className={tag_section} key={`group-${group.id}`}>
                  <div className={tag_section_title}>
                    <span>{group.name}</span>
                    <span
                      className={tag_group_edit}
                      onClick={() => {
                        this.setState({
                          showModal: true,
                          modalContent: group
                        });
                      }}
                    >
                      <i className="far fa-edit" />
                    </span>
                  </div>
                  <Droppable droppableId={group.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={tag_dropzone}
                      >
                        {(this.state.groupedTags[group.id] || []).map(
                          (t, i) => {
                            return (
                              <Draggable
                                key={t.id}
                                draggableId={t.id}
                                index={i}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    className={tag_class}
                                    style={{
                                      marginLeft: isFunnel
                                        ? `${10 * i}px`
                                        : "0px",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    <span>{t.name}</span>
                                    <div
                                      className={tag_edit_button}
                                      onClick={() => {
                                        this.setState({
                                          showModal: true,
                                          modalContent: t
                                        });
                                      }}
                                    >
                                      <i className="far fa-edit" />
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          }
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <AddTag
                    index={(this.state.groupedTags[group.id] || []).length}
                    groupId={group.id || "no_group"}
                    setVal={tag => {
                      this.setState({
                        groupedTags: {
                          ...this.state.groupedTags,
                          [tag.group]: [
                            ...(this.state.groupedTags[tag.group] || []),
                            tag
                          ]
                        }
                      });
                    }}
                  />
                </div>
              );
            })}

          {/* CREATE NEW GROUP */}
          <CreateNewGroup
            index={this.state.groups.length}
            setVal={newGroup => {
              this.setState({ groups: [...this.state.groups, newGroup] });
            }}
          />

          {/* UNGROUPED TAGS */}
          {
            <div className={tag_section}>
              <Droppable droppableId={"no_group"}>
                {(provided, snapshot) => (
                  <div
                    {...[provided.droppableProps]}
                    ref={provided.innerRef}
                    className={tag_dropzone}
                  >
                    {this.state.groupedTags["no_group"].map((t, i) => {
                      return (
                        <Draggable
                          key={`one-${t.id}`}
                          draggableId={`one-${t.id}`}
                          index={i}
                        >
                          {(provided, snapshot) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className={tag_class}
                            >
                              <span>{t.name}</span>
                              <div
                                className={tag_edit_button}
                                onClick={() => {
                                  this.setState({
                                    showModal: true,
                                    modalContent: t
                                  });
                                }}
                              >
                                <i className="far fa-edit" />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <AddTag
                index={(this.state.groupedTags["no_group"] || []).length}
                groupId={"no_group"}
                setVal={tag => {
                  this.setState({
                    groupedTags: {
                      ...this.state.groupedTags,
                      ["no_group"]: [
                        ...(this.state.groupedTags["no_group"] || []),
                        tag
                      ]
                    }
                  });
                }}
              />
            </div>
          }
        </DragDropContext>

        <Modal
          tag={this.state.modalContent}
          show={this.state.showModal}
          close={() => {
            this.setState({ showModal: false });
          }}
          updatedTag={updatedTag => {
            if (!updatedTag.tag_type) {
              let group = this.state.groupedTags[updatedTag.group];
              this.setState(
                {
                  groupedTags: {
                    ...this.state.groupedTags,
                    [updatedTag.group]: [
                      ...group.map(g =>
                        g.id === updatedTag.id ? updatedTag : g
                      )
                    ]
                  }
                },
                () => this.setState({ modalContent: updatedTag })
              );
              return;
            }

            this.setState(
              {
                groups: this.state.groups.map(g =>
                  g.id !== updatedTag.id ? g : updatedTag
                )
              },
              () => this.setState({ modalContent: updatedTag })
            );
          }}
          deletedTag={deletedTag => {
            if (!deletedTag.tag_type) {
              let group = this.state.groupedTags[deletedTag.group] || [];
              this.setState({
                groupedTags: {
                  ...this.state.groupedTags,
                  [deletedTag.group]: [
                    ...group.filter(g => g.id !== deletedTag.id)
                  ]
                },
                showModal: false
              });
              return;
            }

            let groupedTags = {};
            for (let gid in this.state.groupedTags) {
              if (gid !== deletedTag.id)
                groupedTags[gid] = this.state.groupedTags[gid];
            }

            this.setState({
              groupedTags: {
                ...groupedTags,
                no_group: [
                  ...this.state.groupedTags.no_group,
                  ...this.state.groupedTags[deletedTag.id]
                ]
              },
              groups: [
                ...this.state.groups.filter(g => g.id !== deletedTag.id)
              ],
              showModal: false
            });
          }}
        />
      </div>
    );
  }
}

const CompWithQuery = ({ ...props }) => (
  <div className={content_tag}>
    <Query query={getTags} fetchPolicy="cache-and-network">
      {({ data, error, loading }) => {
        if (loading || error || !data.getTags) return <GhostLoader />;
        return <Comp data={data.getTags} {...props} />;
      }}
    </Query>
  </div>
);

const CompWithMutation = ({ ...props }) => (
  <Mutation mutation={updateTags}>
    {(mutate, { data, loading, error }) => {
      console.log("{ data, loading, error }", { data, loading, error });

      return (
        <CompWithQuery
          mutate={mutate}
          mData={data}
          mLoading={loading}
          mError={error}
          {...props}
        />
      );
    }}
  </Mutation>
);

export default CompWithMutation;
