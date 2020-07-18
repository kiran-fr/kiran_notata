import React from "react";
import classnames from "classnames";
import TagCompleter from "../../TagCompleter/TagCompleter";
import {
  section,
  tagClass,
  groupClass,
  funnelClass,
  selectedTag,
  selected_tags_container,
  selected_tag,
  open_close
} from "./NewTagsFilter.module.css";

import {
  container,
  each,
  hamburger_container,
  open_container,
  hamburger,
  icons
} from "./Filters.module.css";

import { tag_class } from "../../TagCompleter/TagCompleter.module.css";

import { color3_bg } from "../../../elements/Colors.module.css";

class NewTagsFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  getTag(tagID) {
    return this.props.tags.find(d => d.id === tagID) || {};
  }

  render() {
    let { n_tags, n_funnel, setTags, setFunnel, tags } = this.props;

    let populated_tags = n_tags.map(t => tags.find(d => d.id === t));

    let getSelectedTags = () => {
      let res =
        n_tags
          .filter(t => tags.find(d => d.id === t))
          .map(t => tags.find(d => d.id === t)) || [];
      return res;
    };

    let getSelectedFunnelTags = () => {
      let res =
        n_funnel
          .filter(t => tags.find(d => d.id === t))
          .map(t => tags.find(d => d.id === t)) || [];

      let groups = {};
      for (const r of res) {
        if (!groups[r.group]) groups[r.group] = [];
        groups[r.group].push(r);
      }

      let result = [];
      for (const funnelId in groups) {
        let _tags = groups[funnelId];
        result.push(_tags[_tags.length - 1]);
      }

      return result;
    };

    let getGroupName = tag => {
      if (!tag.group) return "";
      let group = tags.find(d => d.id === tag.group);
      if (!group) return "";
      return `${group.name}: `;
    };

    return (
      <div>
        <div className={container}>
          <div className={selected_tags_container}>
            {getSelectedFunnelTags().map((f, i) => (
              <div
                key={`funneltag-${f.id}-${i}`}
                className={classnames(tag_class, selected_tag)}
              >
                <span style={{ paddingRight: "4px" }}>
                  <i className="fas fa-filter" />
                </span>
                <span>
                  {getGroupName(f)} {f.name}
                </span>
              </div>
            ))}

            {getSelectedTags().map((t, i) => (
              <div
                key={`group-tag-${t.id}-${i}`}
                className={classnames(tag_class, selected_tag)}
              >
                {getGroupName(t)} {t.name}
              </div>
            ))}

            <div
              className={hamburger}
              style={{ position: "absolute", right: "10px" }}
            >
              <i className="fas fa-tag" />
            </div>
          </div>
        </div>

        {this.props.isOpen && (
          <div
            className={section}
            style={{ background: "white", padding: "2px" }}
          >
            <TagCompleter
              placeholder="Search for tag"
              noAdd
              data={tags}
              tagClass={tagClass}
              groupClass={groupClass}
              funnelClass={funnelClass}
              selectedTag={selectedTag}
              selected={getSelectedTags()}
              selected_funnel_tags={getSelectedFunnelTags()}
              selectTag={tag => {
                n_tags.push(tag.id);
                setTags(n_tags);
              }}
              unselectTag={tag => {
                n_tags = n_tags.filter(t => t !== tag.id);
                setTags(n_tags);
              }}
              setFunnelTags={tags => {
                setFunnel(tags);
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default NewTagsFilter;
