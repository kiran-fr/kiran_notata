import React, { useState } from "react";

import TagOverview from "../StartupPage/StartupPageComponents/TagOverview";
import TagPage from "../StartupPage/StartupPageComponents/TagPage";
import { Tag } from "../../../Components/elements";

import {
  container,
  content,
  footer,
  filter_icon_container,
  filter_icon,
  tag_list,
  tag_each,
  tag_name,
  tag_kill,
} from "./Filters.module.css";

export default function Filters({ filters, setFilters, tagGroups }) {
  const [show, setShow] = useState(false);
  const [showGroup, setShowGroup] = useState(null);

  if (!tagGroups) return <span />;

  return (
    <div className={container}>
      <div className={content}>
        {!!filters.tags.length && (
          <div className={tag_list}>
            {filters.tags.map(tag => {
              const group =
                tagGroups.find(({ id }) => id === tag.tagGroupId) || {};
              return (
                <Tag key={tag.id}>
                  <div className={tag_each}>
                    <div className={tag_name}>
                      {group.name}: {tag.name}
                    </div>
                    <div
                      className={tag_kill}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          tags: filters.tags.filter(({ id }) => id !== tag.id),
                        });
                      }}
                    >
                      <i className="fal fa-times" />
                    </div>
                  </div>
                </Tag>
              );
            })}
          </div>
        )}
      </div>

      <div className={footer}>
        <div className="notata_form">
          <input
            type="text"
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            placeholder="Filter list..."
          />
        </div>

        <div className={filter_icon_container}>
          <div className={filter_icon} onClick={() => setShow(!show)}>
            <i className="fal fa-filter" />
          </div>

          {show && tagGroups && !showGroup && (
            <TagOverview
              tagGroups={tagGroups}
              checkedTags={filters.tags}
              setShowGroup={setShowGroup}
              addTag={tag => {
                setFilters({
                  ...filters,
                  tags: [...filters.tags, tag],
                });
              }}
              deleteTag={tag => {
                setFilters({
                  ...filters,
                  tags: filters.tags.filter(({ id }) => id !== tag.id),
                });
              }}
              close={() => setShow(false)}
            />
          )}

          {/*PAGE*/}
          {show && showGroup && (
            <TagPage
              group={showGroup}
              checkedTags={filters.tags}
              addTag={tag => {
                setFilters({
                  ...filters,
                  tags: [...filters.tags, tag],
                });
              }}
              deleteTag={tag => {
                setFilters({
                  ...filters,
                  tags: filters.tags.filter(({ id }) => id !== tag.id),
                });
              }}
              close={() => setShowGroup(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
