import React, { useState } from "react";
import "./TagsModal.scss";
import { Tags } from "./Tags/Tags";
import { useQuery } from "@apollo/client";
import { Loader } from "Components/UI_Kits";
import { Tag } from "Components/elements";
import { tagGroupsGet } from "private/Apollo/Queries";

export default function TagsModal({ preSelectedTags, addTag, removeTag }) {
  // Queries
  const { data, loading, error } = useQuery(tagGroupsGet);

  // Good :D
  const tagGroups = data?.tagGroupsGet || [];

  const [tagsStates, setTagsStates] = useState({});
  const [selectedTag, setSelectedTag] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const removeTagFn = tagId => {
    const removeTagId = selectedTag.filter(item => item !== tagId);
    setSelectedTag(removeTagId.length ? removeTagId : []);
    removeTag(tagId);
  };

  const addTagFn = tag => {
    setSelectedTag(oldArray => [...oldArray, tag.id]);
    let doubleClick = selectedTag.filter(data => data === tag.id);
    if (doubleClick.length !== 0) {
      return;
    }
    addTag(tag);
  };

  function handleSearch(value) {
    if (value && value !== " " && value.length !== 0) {
      setSearchValue(value);
    } else {
      setSearchValue("");
    }
  }

  if (error) return <pre>{error.message}</pre>; //if query has issue

  if (!data && loading) {
    return (
      <div className="tags-container">
        <Loader size="medium" />
      </div>
    );
  }

  return (
    <div className="tags-container">
      <div className="tags-container__sub-heading">Selected Tags</div>
      <div className="selectedTags">
        {preSelectedTags.map(tag => {
          return (
            <div className="singleTag">
              <span className="singleTagName" key={tag.id}>
                {tag?.group?.name}: {tag?.name}
              </span>
              <span>
                <i
                  className={"fal fa-times"}
                  onClick={() => removeTagFn(tag.id)}
                />
              </span>
            </div>
          );
        })}
      </div>
      <div className="tags-container__sub-heading">Search or choose Tags</div>
      <Tags onchange={handleSearch} />
      <div className="mb-2 tags-container__heading ">Suggested Tags</div>

      <div className="tags-container__dropdown">
        {
          // data.tagGroupsGet && data.tagGroupsGet.map(item => {
          tagGroups.map(tagGroup => {
            if (!!tagGroup?.tags?.length) {
              return (
                <div className="row" key={tagGroup.id}>
                  <div className="col-sm-10 col-xs-10 section-heading">
                    {tagGroup.name}
                  </div>
                  <div className="col-sm-2 col-xs-2 expand-collapse-icon">
                    <i
                      className={`fa ${
                        tagsStates[tagGroup.id]
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                      aria-hidden="true"
                      onClick={() => {
                        setTagsStates({
                          ...tagsStates,
                          [tagGroup.id]: !tagsStates[tagGroup.id],
                        });
                      }}
                    />
                  </div>
                  <div
                    className={`col-sm-12 col-xs-12 ${
                      tagsStates[tagGroup.id] || searchValue.length
                        ? ""
                        : "collapse"
                    }`}
                  >
                    <div className="type-tags-container">
                      {!searchValue.length && (
                        <>
                          {tagGroup.tags.map((tag, index) => {
                            let filterData = preSelectedTags.filter(
                              data => data.id === tag.id
                            );
                            if (filterData.length === 0) {
                              return (
                                <div
                                  className="tag suggested-tag"
                                  key={tag.id}
                                  onClick={() => {
                                    addTagFn(tag);
                                  }}
                                >
                                  {tag.name}
                                </div>
                              );
                            }
                          })}
                        </>
                      )}

                      {!!searchValue.length && (
                        <>
                          {tagGroup.tags
                            .filter(({ name }) =>
                              name
                                .toLowerCase()
                                .includes(searchValue.toLowerCase())
                            )
                            .map((tag, index) => {
                              let filterData = preSelectedTags.filter(
                                ({ id }) => id === tag.id
                              );

                              if (filterData.length === 0) {
                                return (
                                  <div
                                    className="tag suggested-tag"
                                    key={tag.id}
                                    onClick={() => {
                                      addTagFn(tag);
                                    }}
                                  >
                                    {tag.name}
                                  </div>
                                );
                              }
                            })}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          })
        }
      </div>
    </div>
  );
}
