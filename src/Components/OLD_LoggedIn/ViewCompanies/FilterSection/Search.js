import React from "react";
import classnames from "classnames";
import { container, input_style, icon } from "./Search.module.css";

import { color3_bg } from "../../../elements/Colors.module.css";

import {
  suggested_container,
  suggested_each
} from "./NewTagsFilter.module.css";

class Search extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      search,
      setSearch
      // tagSearch,
      // setTagSearch,
      // n_tags,
      // n_funnel,
      // tags,
      // setTags,
      // setFunnel
    } = this.props;

    // let populated_tags = n_tags.map(t => tags.find(d => d.id === t));

    // let getSelectedTags = () => {
    //   let res =
    //     n_tags
    //       .filter(t => tags.find(d => d.id === t))
    //       .map(t => tags.find(d => d.id === t)) || [];
    //   return res;
    // };

    // let getSelectedFunnelTags = () => {
    //   let res =
    //     n_funnel
    //       .filter(t => tags.find(d => d.id === t))
    //       .map(t => tags.find(d => d.id === t)) || [];

    //   let groups = {};
    //   for (const r of res) {
    //     if (!groups[r.group]) groups[r.group] = [];
    //     groups[r.group].push(r);
    //   }

    //   let result = [];
    //   for (const funnelId in groups) {
    //     let _tags = groups[funnelId];
    //     result.push(_tags[_tags.length - 1]);
    //   }

    //   return result;
    // };

    // let getGroupName = tag => {
    //   if (!tag.group) return "";
    //   let group = tags.find(d => d.id === tag.group);
    //   if (!group) return "";
    //   return `${group.name}: `;
    // };

    // let getSuggestedTags = () => {
    //   if (!tagSearch || tagSearch === "") return [];
    //   let suggested = tags
    //     .filter(
    //       t =>
    //         t.name.toLowerCase().includes(tagSearch.toLowerCase()) ||
    //         getGroupName(t)
    //           .toLowerCase()
    //           .includes(tagSearch.toLowerCase())
    //     )
    //     .filter(t => {
    //       if (!t.group) return false;
    //       if (n_tags.some(nt => nt === t.id)) return false;
    //       // if (n_funnel.some(nf => nf === t.id)) return false;
    //       return true;
    //     });
    //   if (suggested.length > 10) suggested.length = 10;
    //   return suggested;
    // };

    return (
      <div style={{ padding: "4px", marginTop: "15px" }}>
        {
          // <div className={classnames(container)}>
          //   <input
          //     className={input_style}
          //     type="text"
          //     placeholder="Search tags"
          //     value={tagSearch}
          //     onChange={e => setTagSearch(e.target.value)}
          //   />
          //   <div className={icon}>
          //     {tagSearch !== "" && (
          //       <i
          //         className="fas fa-times-circle"
          //         style={{ cursor: "pointer" }}
          //         onClick={() => setTagSearch("")}
          //       />
          //     )}
          //   </div>
          //   <div className={suggested_container}>
          //     {getSuggestedTags().map((stag, i) => (
          //       <div
          //         key={`stag-${i}`}
          //         className={suggested_each}
          //         onClick={() => {
          //           let isFunnel;
          //           let parent = tags.find(tt => tt.id === stag.group);
          //           if (parent && parent.tag_type === "FUNNEL") {
          //             isFunnel = true;
          //           }
          //           if (!isFunnel) {
          //             n_tags.push(stag.id);
          //             return setTags(n_tags);
          //           }
          //           let allFunnelTags = tags
          //             .filter(tt => tt.group === stag.group)
          //             .sort((a, b) => a.index - b.index);
          //           allFunnelTags.length = (stag.index || 0) + 1;
          //           setFunnel(allFunnelTags);
          //           setTagSearch("");
          //         }}
          //       >
          //         {getGroupName(stag)} {stag.name}
          //       </div>
          //     ))}
          //   </div>
          // </div>
        }

        <div className={classnames(container)}>
          <input
            className={input_style}
            type="text"
            placeholder="Search startups"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className={icon}>
            {search !== "" && (
              <i
                className="fas fa-times-circle"
                style={{ cursor: "pointer" }}
                onClick={() => setSearch("")}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
