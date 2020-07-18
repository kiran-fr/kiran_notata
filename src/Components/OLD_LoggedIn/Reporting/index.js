import React from "react";
import classnames from "classnames";
import { Query, Mutation } from "react-apollo";
import { adopt } from "react-adopt";
import moment from "moment";
import DatePicker from "../ViewCompanies/FilterSection/Date";
import {
  getEvaluations,
  getTags,
  getReportData
} from "../../../Apollo/Queries";

import { putReportData } from "../../../Apollo/Mutations";
import { GhostLoader } from "../../elements/GhostLoader";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import FunnelChart from "./FunnelChart";
import FilterSection from "./FilterSection/";

import {
  color2_bg,
  color3_bg,
  color4_bg,
  color5_bg,
  color6_bg,
  color7_bg,
  color8_bg,
  color9_bg
} from "../../elements/Colors.module.css";

import {
  wrapper,
  container,
  header,
  content,
  chart_style,
  chart_style_inner,
  bar_chart_header,
  bar_chart_title,
  funnel_chart_header,
  funnel_chart_title,
  selector,
  selector_title,
  settings_buttons,
  type_toggler,
  type_compressor,
  type_compressor_icon,
  active,
  inactive,
  selector_button,
  full_width,
  half_width,
  selector_dropdown
} from "./index.module.css";

const getFunnelData = ({ evaluations, tags, id }) => {
  let selectedFunnel = tags.find(t => t.id === id) || [];
  let funnelStages = tags
    .filter(t => t.group === selectedFunnel.id)
    .sort((a, b) => a.index - b.index);
  let res = funnelStages.map(t => {
    let val = evaluations.filter(e => (e.n_funnel || []).some(f => f === t.id))
      .length;
    let label = t.name;
    let id = t.id;
    return { label, val, id };
  });
  return res;
};

const getGroupData = ({ evaluations, tags, id, collectOn }) => {
  let selectedGroup = tags.find(t => t.id === id) || [];
  let groupTags = tags
    .filter(t => t.group === selectedGroup.id)
    .sort((a, b) => a.index - b.index);

  let res = groupTags.map(t => {
    let val = evaluations.filter(e => (e.n_tags || []).some(f => f === t.id))
      .length;
    let label = t.name;
    let id = t.id;
    return { label, val, id };
  });

  res = res.filter(d => d.val).sort((a, b) => b.val - a.val);

  if (collectOn) {
    let collected = 0;
    res = res.filter(s => {
      if (s.val <= collectOn) {
        collected += s.val;
        return false;
      }
      return true;
    });
    res.push({ label: `< ${collectOn}`, val: collected });
  }

  return res;
};

class Comp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      filters: {}
    };
  }

  render() {
    let { tags, report, evaluations } = this.props;
    let funnels = tags.filter(t => t.tag_type === "FUNNEL");
    let groups = tags.filter(t => t.tag_type === "GROUP");

    let isSelectedFunnel = id => report.funnels.some(f => f.id === id);

    let isSelectedGroup = id => report.groups.some(g => g.id === id);

    let getFunnelMutationData = ({ f, view_type }) => {
      let exists = report.funnels.find(fn => fn.id === f.id);

      let funnels;
      if (exists) {
        funnels = report.funnels
          .filter(fn => fn.id !== f.id)
          .map(f => JSON.stringify(f));
      } else {
        let funnel = { id: f.id, name: f.name, view_type: view_type || "PIE" };
        funnels = [
          ...report.funnels.map(f => JSON.stringify(f)),
          JSON.stringify(funnel)
        ];
      }

      let variables = { input: { funnels } };
      return variables;
    };

    let getGroupMutationData = ({ g, view_type }) => {
      let exists = report.groups.find(gr => gr.id === g.id);
      let groups;
      if (exists) {
        groups = report.groups
          .filter(gr => gr.id !== g.id)
          .map(f => JSON.stringify(f));
      } else {
        groups = [
          ...report.groups.map(f => JSON.stringify(f)),
          JSON.stringify({
            id: g.id,
            name: g.name,
            view_type: view_type || "BAR"
          })
        ];
      }
      let variables = { input: { groups } };
      return variables;
    };

    let updateGroupsData = g => {
      let groups = report.groups
        .map(gr => (gr.id === g.id ? g : gr))
        .map(f => JSON.stringify(f));
      let variables = { input: { groups } };
      return variables;
    };

    let suggestCollectOn = (g, data) => {
      let allow = false;
      if (!g.view_type || g.view_type === "BAR") {
        allow = g.half ? 6 : 12;
      }
      if (g.view_type === "PIE") {
        allow = g.half ? 10 : 20;
      }
      let clipHere = data[allow + 1];
      if (!clipHere) return;
      return clipHere.val;
    };

    let firstEntry;
    if (evaluations.length && (!evaluations.length === 1)) {
      firstEntry = (evaluations || []).reduce((a, b) =>
        a.createdAt < b.createdAt ? a : b
      );      
    } else {
      firstEntry = (evaluations || [])[0]    
    }

    let startDate = (firstEntry || {}).createdAt;

    return (
      <Mutation mutation={putReportData}>
        {(mutate, { data, loading, error }) => (
          <div className={wrapper}>
            <div className={container}>
              <div className={header}>
                <div className={selector} style={{ width: "200px" }}>
                  <div className={selector_title}>Funnels</div>
                  {funnels.map((f, i) => (
                    <div
                      key={`funnel-${f.id}`}
                      className={classnames(
                        selector_button,
                        isSelectedFunnel(f.id) ? active : inactive
                      )}
                      onClick={() => {
                        let variables = getFunnelMutationData({ f });
                        mutate({
                          variables,
                          optimisticResponse: {
                            __typename: "Mutation",
                            putReportData: {
                              ...report,
                              funnels: variables.input.funnels
                            }
                          }
                        });
                      }}
                    >
                      {(isSelectedFunnel(f.id) && (
                        <i className="fas fa-toggle-on" />
                      )) || <i className="fas fa-toggle-off" />}
                      <span>{f.name}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <DatePicker
                    date={
                      report.filters.from_date ||
                      moment(startDate, "x").format()
                    }
                    label="From date"
                    setNewDate={from_date => {
                      let variables = {
                        input: {
                          filters: JSON.stringify({
                            ...report.filters,
                            from_date
                          })
                        }
                      };

                      mutate({
                        variables,
                        optimisticResponse: {
                          __typename: "Mutation",
                          putReportData: {
                            ...report,
                            filters: variables.input.filters
                          }
                        }
                      });
                    }}
                  />

                  <DatePicker
                    date={report.filters.to_date || moment().format()}
                    label="To date"
                    setNewDate={to_date => {
                      let variables = {
                        input: {
                          filters: JSON.stringify({
                            ...report.filters,
                            to_date
                          })
                        }
                      };

                      mutate({
                        variables,
                        optimisticResponse: {
                          __typename: "Mutation",
                          putReportData: {
                            ...report,
                            filters: variables.input.filters
                          }
                        }
                      });
                    }}
                  />
                </div>

                <div className={selector} style={{ width: "500px" }}>
                  <div
                    className={selector_title}
                    style={{ cursor: "pointer", paddingBottom: "3px" }}
                    onClick={() =>
                      this.setState({ isOpen: !this.state.isOpen })
                    }
                  >
                    <span>Filters </span>
                    {(this.state.isOpen && (
                      <i className="fas fa-caret-up" />
                    )) || <i className="fas fa-caret-down" />}
                  </div>

                  <FilterSection
                    isOpen={this.state.isOpen}
                    tags={tags}
                    filters={report.filters || {}}
                    setFilters={filters => {
                      let variables = {
                        input: { filters: JSON.stringify(filters) }
                      };

                      mutate({
                        variables,
                        optimisticResponse: {
                          __typename: "Mutation",
                          putReportData: {
                            ...report,
                            filters: variables.input.filters
                          }
                        }
                      });
                    }}
                  />
                </div>
              </div>

              <div className={content}>
                {report.funnels.map((f, i) => (
                  <div
                    className={classnames(chart_style, full_width)}
                    key={`funnel-${f.id}-${i}`}
                  >
                    <div className={chart_style_inner}>
                      <div className={funnel_chart_header}>
                        <div className={funnel_chart_title}>{f.name}</div>
                      </div>
                      <FunnelChart
                        data={getFunnelData({ evaluations, tags, id: f.id })}
                        evaluations={evaluations}
                        tags={tags}
                      />
                    </div>
                  </div>
                ))}

                {report.groups.map((g, i) => {
                  let groupData = getGroupData({ evaluations, tags, id: g.id });
                  let suggestedCollect = suggestCollectOn(g, groupData);
                  let collectOn = g.collectOn;
                  if (!(g.collectOn || g.collectOn === "")) {
                    collectOn = suggestedCollect;
                  }

                  return (
                    <div
                      className={classnames(
                        chart_style,
                        g.half ? half_width : full_width
                      )}
                      key={`bar-${g.id}-${i}`}
                    >
                      <div className={chart_style_inner}>
                        <div className={bar_chart_header}>
                          <div
                            className={bar_chart_title}
                            onClick={() => {
                              this.setState({
                                open:
                                  this.state.open === `${g.id}-${i}`
                                    ? false
                                    : `${g.id}-${i}`
                              });
                            }}
                          >
                            <i className="fas fa-caret-right" />
                            <span> {g.name}</span>
                          </div>

                          {this.state.open === `${g.id}-${i}` && (
                            <div
                              className={selector_dropdown}
                              onMouseLeave={() => this.setState({ open: null })}
                            >
                              {groups.map((gr, i) => (
                                <div
                                  key={`groupss-${gr.id}`}
                                  className={classnames(
                                    selector_button,
                                    gr.name === g.name ? active : inactive
                                  )}
                                  onClick={() => {
                                    this.setState({ open: null });
                                    let res = report.groups
                                      .map(rg => {
                                        if (rg.id === g.id) {
                                          return {
                                            ...rg,
                                            id: gr.id,
                                            name: gr.name
                                          };
                                        } else {
                                          return rg;
                                        }
                                      })
                                      .map(f => JSON.stringify(f));

                                    let variables = { input: { groups: res } };
                                    mutate({
                                      variables,
                                      optimisticResponse: {
                                        __typename: "Mutation",
                                        putReportData: {
                                          ...report,
                                          groups: variables.input.groups
                                        }
                                      }
                                    });
                                  }}
                                >
                                  <span>{gr.name}</span>
                                </div>
                              ))}

                              <div
                                className={classnames(selector_button)}
                                onClick={() => {
                                  let variables = getGroupMutationData({ g });
                                  mutate({
                                    variables,
                                    optimisticResponse: {
                                      __typename: "Mutation",
                                      putReportData: {
                                        ...report,
                                        groups: variables.input.groups
                                      }
                                    }
                                  });
                                }}
                              >
                                <span style={{ color: "red" }}>Remove</span>
                              </div>
                            </div>
                          )}

                          <div className={settings_buttons}>
                            <div className={type_compressor}>
                              <div
                                className={classnames(
                                  type_compressor_icon,
                                  color2_bg
                                )}
                                style={{ opacity: collectOn ? 1 : 0.5 }}
                              >
                                <i className="fas fa-compress" />
                              </div>
                              <input
                                type="text"
                                value={collectOn}
                                onChange={e => {
                                  let variables = updateGroupsData({
                                    ...g,
                                    collectOn: e.target.value
                                  });
                                  mutate({
                                    variables,
                                    optimisticResponse: {
                                      __typename: "Mutation",
                                      putReportData: {
                                        ...report,
                                        groups: variables.input.groups
                                      }
                                    }
                                  });
                                }}
                              />
                            </div>

                            <div
                              className={classnames(type_toggler, color9_bg)}
                              onClick={() => {
                                let variables = updateGroupsData({
                                  ...g,
                                  half: !g.half
                                });
                                mutate({
                                  variables,
                                  optimisticResponse: {
                                    __typename: "Mutation",
                                    putReportData: {
                                      ...report,
                                      groups: variables.input.groups
                                    }
                                  }
                                });
                              }}
                            >
                              {(g.half && (
                                <i className="fas fa-expand-alt" />
                              )) || <i className="fas fa-compress-alt" />}
                            </div>

                            <div
                              className={classnames(type_toggler, color3_bg)}
                            >
                              {g.view_type === "BAR" && (
                                <span
                                  onClick={() => {
                                    let variables = updateGroupsData({
                                      ...g,
                                      view_type: "PIE"
                                    });
                                    mutate({
                                      variables,
                                      optimisticResponse: {
                                        __typename: "Mutation",
                                        putReportData: {
                                          ...report,
                                          groups: variables.input.groups
                                        }
                                      }
                                    });
                                  }}
                                >
                                  <i className="fas fa-chart-pie-alt" />
                                </span>
                              )}
                              {g.view_type === "PIE" && (
                                <span
                                  onClick={() => {
                                    let variables = updateGroupsData({
                                      ...g,
                                      view_type: "BAR"
                                    });

                                    mutate({
                                      variables,
                                      optimisticResponse: {
                                        __typename: "Mutation",
                                        putReportData: {
                                          ...report,
                                          groups: variables.input.groups
                                        }
                                      }
                                    });
                                  }}
                                >
                                  <i className="fas fa-chart-bar" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {g.view_type === "BAR" && (
                          <BarChart
                            data={getGroupData({
                              evaluations,
                              tags,
                              id: g.id,
                              collectOn
                            })}
                            half={g.half}
                            evaluations={evaluations}
                            collectOn={collectOn}
                          />
                        )}

                        {g.view_type === "PIE" && (
                          <PieChart
                            score={getGroupData({
                              evaluations,
                              tags,
                              id: g.id,
                              collectOn
                            })}
                            half={g.half}
                            collectOn={collectOn}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className={classnames(chart_style, full_width)}>
                  <div className={chart_style_inner}>
                    <div className={bar_chart_header}>
                      <div>Add Graph for:</div>

                      {groups.map((g, i) => (
                        <div
                          key={`groupss-${g.id}`}
                          className={classnames(
                            selector_button,
                            isSelectedGroup(g.id) ? active : inactive
                          )}
                          onClick={() => {
                            if (report.groups.some(gg => gg.id === g.id))
                              return;

                            let variables = getGroupMutationData({ g });
                            mutate({
                              variables,
                              optimisticResponse: {
                                __typename: "Mutation",
                                putReportData: {
                                  ...report,
                                  groups: variables.input.groups
                                }
                              }
                            });
                          }}
                        >
                          <span>{g.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

const cleanReportData = report => {
  let r = {
    ...report,
    funnels: report.funnels.map(f => {
      let rf;
      try {
        rf = JSON.parse(f);
      } catch (err) {
        rf = f;
      }
      return rf;
    }),
    groups: report.groups.map(g => {
      let rg;
      try {
        rg = JSON.parse(g);
      } catch (err) {
        rg = g;
      }
      return rg;
    })
  };
  try {
    r.filters = JSON.parse(r.filters);
  } catch (err) {
    r.filters = r.filters || {};
  }
  return r;
};

const getMergedData = ({ evaluations, evaluationsSharedWithMe, filters }) => {
  let merged = evaluations;

  if (evaluationsSharedWithMe) {
    merged = [...merged, ...evaluationsSharedWithMe];
  }

  merged = merged.filter(m => m.organization);

  // if (filters.last_14_days) {
  //   merged = merged.filter(m => {
  //     let now = new Date().getTime();
  //     let then = m.createdAt;
  //     let diff = now - then;
  //     let milliDay = 60 * 60 * 24 * 1000;
  //     if (milliDay * 14 - diff > 0) return m;
  //   });
  // }

  if (filters.from_date) {
    // console.log('filters.from_date', filters.from_date)
    merged = merged.filter(
      m => m.createdAt >= moment(filters.from_date).format("x")
    );
  }

  if (filters.to_date) {
    // console.log('filters.to_date', filters.to_date)
    merged = merged.filter(
      m => m.createdAt <= moment(filters.to_date).format("x")
    );
  }

  if (!filters.include_archived) {
    merged = merged.filter(m => !m.archived);
  }

  if (filters.n_tags && filters.n_tags.length) {
    merged = merged.filter(m => {
      if (!m.n_tags || !m.n_tags.length) return false;
      return filters.n_tags.some(nt => {
        let match = m.n_tags.some(mnt => mnt === nt);
        return match;
      });
    });
  }

  if (filters.n_funnel && filters.n_funnel.length) {
    merged = merged.filter(m => {
      if (!m.n_funnel || !m.n_funnel.length) return false;
      return filters.n_funnel.every(v => m.n_funnel.includes(v));
    });
  }

  return merged;
};

const ComposedComponent = () => {
  const Composed = adopt({
    evaluationsQuery: ({ render }) => (
      <Query query={getEvaluations}>{render}</Query>
    ),
    tagsQuery: ({ render }) => <Query query={getTags}>{render}</Query>,
    reportQuery: ({ render }) => <Query query={getReportData}>{render}</Query>
  });

  return (
    <Composed>
      {({ evaluationsQuery, tagsQuery, reportQuery }) => {
        const loading =
          evaluationsQuery.loading || tagsQuery.loading || reportQuery.loading;

        const error =
          evaluationsQuery.error || tagsQuery.error || reportQuery.error;

        if (loading) return <GhostLoader />;
        if (error) return <div>ERROR</div>;

        const evaluations = evaluationsQuery.data.getEvaluations;
        const evaluationsSharedWithMe =
          evaluationsQuery.data.getEvaluationsSharedWithMe;
        const tags = tagsQuery.data.getTags;
        const report = reportQuery.data.getReportData;

        let r = cleanReportData(report);

        const mergedData = getMergedData({
          evaluations,
          // evaluationsSharedWithMe: [],
          filters: r.filters
        });

        return (
          <Comp
            evaluations={mergedData}
            // evaluationsSharedWithMe={evaluationsSharedWithMe}
            tags={tags}
            report={r}
          />
        );
      }}
    </Composed>
  );
};

export default ComposedComponent;
