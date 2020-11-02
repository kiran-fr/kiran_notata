import React, { useState } from "react";
import TagSelector from "Components/TagSelector/TagSelector";
import { funnelGroupGet } from "Apollo/Queries";
import { useQuery } from "@apollo/client";
import { Tag, Modal } from "Components/elements/";
import { cloneDeep } from "lodash";
import classnames from "classnames";

import {
  container,
  content,
  footer,
  filter_star,
  filter_icon_container,
  filter_icon,
  tag_list,
  tag_each,
  tag_name,
  tag_kill,
  filter_container,
  filter_content,
  funnel_tag_container,
  funnel_tag,
  funnel_tag_active,
} from "./Filters.module.css";

const Tags = ({ filters, tagGroups, setFilters }) => {
  const [show, setShow] = useState(false);

  return (
    <div className={filter_icon_container}>
      <div className={filter_icon} onClick={() => setShow(!show)}>
        <i className="fal fa-tag" />
      </div>

      <TagSelector
        show={show}
        close={() => setShow(false)}
        tagGroups={tagGroups}
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
      />
    </div>
  );
};

const Funnels = ({ filters, setFilters }) => {
  const { data, error, loading } = useQuery(funnelGroupGet);

  const [show, setShow] = useState(false);

  let funnelGroups = [];
  if (data && !error && !loading) {
    funnelGroups = data.accountGet.funnelGroups;
  }

  const addFunnelTag = funnelTag => {
    let group = funnelGroups.find(({ id }) => funnelTag.funnelGroupId === id);

    if (filters.funnelTags.some(({ id }) => id === funnelTag.id)) {
      return setFilters([]);
    }

    setFilters([funnelTag]);
  };

  return (
    <div className={filter_icon_container}>
      <div className={filter_icon} onClick={() => setShow(!show)}>
        <i className="fal fa-filter" />
      </div>

      {show && (
        <Modal title="FUNNEL" close={() => setShow(false)}>
          {funnelGroups.map(funnelGroup => {
            let funnelTags = cloneDeep(funnelGroup.funnelTags);
            funnelTags = funnelTags.sort((a, b) => a.index - b.index);
            return (
              <div key={funnelGroup.id}>
                <div className={funnel_tag_container}>
                  {funnelTags.map((funnelTag, i) => (
                    <div
                      key={funnelTag.id}
                      className={classnames(
                        funnel_tag,
                        (filters.funnelTags || []).some(
                          ({ id }) => id === funnelTag.id
                        ) && funnel_tag_active
                      )}
                      style={{ width: `${100 - i * 10}%` }}
                      onClick={() => addFunnelTag(funnelTag)}
                    >
                      {funnelTag.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </Modal>
      )}
    </div>
  );
};

export default function Filters({ filters, setFilters, tagGroups }) {
  const defaultFilters = {
    search: "",
    tags: [],
    funnelTags: [],
    starred: false,
  };

  filters = filters || defaultFilters;

  // if (!tagGroups) return <span />;

  return (
    <div className={container}>
      <div className={footer}>
        <div className={filter_container}>
          {/*STAR*/}
          <div className={filter_content}>
            <div
              className={filter_star}
              onClick={() => {
                setFilters({
                  ...filters,
                  starred: !filters.starred,
                });
              }}
            >
              {(filters.starred && (
                <i
                  className="fas fa-star"
                  style={{ color: "var(--color-orange)" }}
                />
              )) || (
                <i
                  className="fal fa-star"
                  style={{ color: "var(--color-gray-light)" }}
                />
              )}
            </div>
          </div>

          {/*SEARCH*/}
          <div className={filter_content} style={{ width: "100%" }}>
            <div className="notata_form" style={{ width: "100%" }}>
              <input
                style={{
                  marginBottom: "6px",
                  width: "100%",
                }}
                type="text"
                value={filters.search}
                onChange={e =>
                  setFilters({ ...filters, search: e.target.value })
                }
                placeholder="Filter list..."
              />
            </div>
          </div>

          {/*FUNNEL*/}
          <div className={filter_content}>
            <Funnels
              filters={filters}
              setFilters={funnelTags => setFilters({ ...filters, funnelTags })}
            />
          </div>

          {/*TAG*/}
          <div className={filter_content}>
            <Tags
              setFilters={setFilters}
              tagGroups={tagGroups}
              filters={filters}
            />
          </div>

          {/*CALENDAR*/}
          {/*
              <div className={filter_content}>
                <div className={filter_icon_container}>
                  <div className={filter_icon} onClick={() => setShow(!show)}>
                    <i className="fal fa-calendar" />
                  </div>
                </div>
              </div>
            */}
        </div>
      </div>

      {(!!filters.tags.length || !!filters.funnelTags.length) && (
        <div className={content}>
          <div className={tag_list}>
            {filters.funnelTags.map(funnelTag => {
              return (
                <Tag key={funnelTag.id}>
                  <div className={tag_each}>
                    <div className={tag_name}>
                      <i className="fal fa-filter" /> {funnelTag.name}
                    </div>
                    <div
                      className={tag_kill}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          funnelTags: [],
                        });
                      }}
                    >
                      <i className="fal fa-times" />
                    </div>
                  </div>
                </Tag>
              );
            })}

            {filters.tags.map(tag => {
              const group =
                tagGroups.find(({ id }) => id === tag.tagGroupId) || {};
              return (
                <Tag key={tag.id}>
                  <div className={tag_each}>
                    <div className={tag_name}>
                      <i className="fal fa-tag" /> {group.name}: {tag.name}
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
        </div>
      )}
    </div>
  );
}
