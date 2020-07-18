import React from "react";
import classnames from "classnames";
import TagCompleter from "../../TagCompleter/TagCompleter";
import {
  section,
  tagClass,
  groupClass,
  funnelClass,
  selectedTag,
  filter_tag,
  suggested_container,
  suggested_each,
  tags_filter_container,
  tags_filter_close
} from "./NewTagsFilter.module.css";
import {
  container as search_container,
  input_style,
  icon as input_icon
} from "./Search.module.css";
import {
  container,
  each,
  icon,
  hamburger_container,
  open_container,
  hamburger,
  icons
} from "./Filters.module.css";

import { color3_bg } from "../../../elements/Colors.module.css";

class NewTagsFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      tags: this.props.tags || [],
      n_tags: this.props.n_tags || [],
      n_funnel: this.props.n_funnel || [],
      selectedTags: this.getSelectedTags(this.props) || [],
      selectedFunnelTags: this.getSelectedFunnelTags(this.props) || []
    };
  }

  componentDidMount() {
    // this.setState({
    // })
  }

  componentWillUpdate(newProps) {
    if (this.props === newProps) return;
    // this.setState({ input_val: newProps.tagSearch });
    this.setState({
      tags: newProps.tags || [],
      n_tags: newProps.n_tags || [],
      n_funnel: newProps.n_funnel || [],
      selectedTags: this.getSelectedTags(newProps) || [],
      selectedFunnelTags: this.getSelectedFunnelTags(newProps) || []
    });
  }

  getSelectedTags(props) {
    let { n_tags, tags } = props;
    tags = tags || [];
    n_tags = n_tags || [];
    let selectedTags =
      n_tags
        .filter(t => tags.find(d => d.id === t))
        .map(t => tags.find(d => d.id === t)) || [];

    // console.log('selectedTags.length', selectedTags.length)
    return selectedTags;
  }

  getSelectedFunnelTags(props) {
    let { n_funnel, tags } = props;
    tags = tags || [];
    n_funnel = n_funnel || [];

    let funnel_tags =
      n_funnel
        .filter(t => tags.find(d => d.id === t))
        .map(t => tags.find(d => d.id === t)) || [];

    return funnel_tags;
  }

  getTag(tagID) {
    return this.state.tags.find(d => d.id === tagID) || {};
  }

  getLastFunnelTag() {
    if (!this.state.selectedFunnelTags.length) return;
    return this.state.selectedFunnelTags[
      this.state.selectedFunnelTags.length - 1
    ];
  }

  render() {
    let { setTags, setFunnel } = this.props;
    let {
      n_tags,
      n_funnel,
      tags,
      selectedTags,
      selectedFunnelTags
    } = this.state;
    let populated_tags = n_tags.map(t => tags.find(d => d.id === t));

    let lastFunnelTag = this.getLastFunnelTag();

    let getGroupName = tag => {
      if (!tag.group) return "";
      let group = tags.find(d => d.id === tag.group);
      if (!group) return "";
      return `${group.name}: `;
    };

    return (
      <div>
        <div className={container}>
          {lastFunnelTag && (
            <div
              className={each}
              onClick={() => setFunnel([])}
              style={{ paddingRight: "50px" }}
            >
              <span style={{ paddingRight: "4px" }}>
                <i className="fas fa-filter" />
              </span>
              <span>
                {getGroupName(lastFunnelTag)} {lastFunnelTag.name}
              </span>
              <div className={icon} style={{ opacity: "0.2" }}>
                <i className={"far fa-times-circle"} />
              </div>
            </div>
          )}

          {
            // selectedFunnelTags.map((f, i) => (
            //   <div
            //     key={`funneltag-${f.id}-${i}`}
            //     className={each}
            //     onClick={() => setFunnel([])}
            //     style={{ paddingRight: "50px" }}
            //   >
            //     <span style={{ paddingRight: "4px" }}>
            //       <i className="fas fa-filter" />
            //     </span>
            //     <span>
            //       {getGroupName(f)} {f.name}
            //     </span>
            //     <div className={icon} style={{ opacity: "0.2" }}>
            //       <i className={"far fa-times-circle"} />
            //     </div>
            //   </div>
            // ))
          }

          {selectedTags.map((t, i) => (
            <div
              key={`group-tag-${t.id}-${i}`}
              className={each}
              onClick={() => {
                n_tags = n_tags.filter(tt => tt !== t.id);
                setTags(n_tags);
              }}
              style={{ paddingRight: "50px" }}
            >
              {getGroupName(t)} {t.name}
              <div className={icon} style={{ opacity: "0.2" }}>
                <i className={"far fa-times-circle"} />
              </div>
            </div>
          ))}

          <div
            className={each}
            onClick={() => this.setState({ open: !this.state.open })}
            style={{ paddingRight: "50px" }}
          >
            Filter by tags
            <div className={icon} style={{ opacity: "0.2" }}>
              <i className={"fas fa-plus-circle"} />
            </div>
          </div>
        </div>

        {this.state.open && (
          <div className={tags_filter_container}>
            <div
              className={tags_filter_close}
              onClick={() => this.setState({ open: false })}
            >
              close
            </div>
            <TagCompleter
              noAdd
              data={tags}
              selected={selectedTags}
              selected_funnel_tags={selectedFunnelTags}
              selectTag={tag => setTags([...n_tags, tag.id])}
              unselectTag={tag => {
                setTags(n_tags.filter(tt => tt !== tag.id));
              }}
              setFunnelTags={funnel => {
                setFunnel(funnel);
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default NewTagsFilter;
