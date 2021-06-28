import React, { useState } from "react";
import "./TagsModal.scss";
import { Tags } from "./Tags/Tags";
import { useQuery, useMutation } from "@apollo/client";
import { Loader } from "Components/UI_Kits";
import { Tag } from "Components/elements";

// API STUFF

import { tagGroupsGet } from "private/Apollo/Queries";

import {
  connectionTagAdd,
  connectionTagRemove,
} from "private/Apollo/Mutations";

export default function TagsModal({
  connection,
  tagSelected,
  setTagSelected,
  tagFlag,
}) {
  // Queries
  const { data, loading, error } = useQuery(tagGroupsGet);

  // Good :D
  const tagGroups = data?.tagGroupsGet || [];

  // Mutations
  const [addTagMutation] = useMutation(connectionTagAdd);
  const [removeTagMutation] = useMutation(connectionTagRemove);

  let tagTypesState = {};

  const [tagsStates, setTagsStates] = useState(tagTypesState);
  const [selectedTag, setSelectedTag] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const removeTag = tagId => {
    // doubleclick ID logic
    const removeTagId = selectedTag.filter(item => item !== tagId);
    setSelectedTag(removeTagId.length ? removeTagId : []);

    if (tagFlag) {
      let filterData = tagSelected.filter(data => data.id !== tagId);
      if (filterData.length === 0) {
        setTagSelected([...filterData]);
      }
    } else {
      let variables = {
        connectionId: connection.id,
        tagId: tagId,
      };
      let optimisticResponse = {
        __typename: "Mutation",
        connectionTagRemove: {
          ...connection,
          tags: [
            ...connection.tags
              .filter(({ id }) => id !== tagId)
              .map(t => ({
                ...t,
                index: null,
                description: null,
                createdBy: "tmp",
                createdAt: 0,
              })),
          ],
          __typename: "Connection",
        },
      };
      removeTagMutation({ variables, optimisticResponse });
    }
  };

  const addTags = (connection, tag) => {
    setSelectedTag(oldArray => [...oldArray, tag.id]);
    let doubleClick = selectedTag.filter(data => data === tag.id);

    if (doubleClick.length === 0) {
      if (tagFlag) {
        setTagSelected([...tagSelected, tag]);
      } else {
        let variables = {
          connectionId: connection.id,
          tagId: tag.id,
        };

        let optimisticResponse = {
          __typename: "Mutation",
          connectionTagAdd: {
            ...connection,
            tags: [
              ...connection.tags,
              {
                createdAt: new Date().getTime(),
                index: connection.tags.length,
                createdBy: "tmp",
                id: "tmp-id",
                description: null,
                name: tag.name,
                tagGroupId: tag.tagGroupId,
                __typename: "Tag",
              },
            ],
            __typename: "Connection",
          },
        };

        addTagMutation({
          variables,
          optimisticResponse,
        });
      }
    }
  };

  function handleSearch(value) {
    if (value && value !== " " && value.length !== 0) {
      setFiltered(true);
      setSearchValue(value);
    } else {
      setFiltered(false);
      setSearchValue("");
    }
  }

  if (error) return <pre>{error.message}</pre>; //if query has issue

  return (
    <div className="tags-container">
      {loading && !connection?.tags ? (
        /* //query processing with tagset data */
        <Loader size="medium" />
      ) : (
        <>
          <div className="tags-container__sub-heading">Selected Tags</div>
          <div className="selectedTags">
            {connection?.tags?.map(tag => {
              return (
                <div className="singleTag">
                  <span className="singleTagName" key={tag.id}>
                    {tag?.group?.name}: {tag?.name}
                  </span>
                  <span>
                    <i
                      className={"fal fa-times"}
                      onClick={() => removeTag(tag.id)}
                    />
                  </span>
                </div>
              );
            })}
          </div>
          <div className="tags-container__sub-heading">
            Search or choose Tags
          </div>
          <Tags onchange={handleSearch}></Tags>
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
                          tagsStates[tagGroup.id] || filtered ? "" : "collapse"
                        }`}
                      >
                        <div className="type-tags-container">
                          {!filtered ? (
                            <>
                              {tagGroup.tags.map((tag, index) => {
                                const tagArr = tagFlag
                                  ? tagSelected
                                  : connection.tags;
                                let filterData = tagArr.filter(
                                  data => data.id === tag.id
                                );
                                if (filterData.length === 0) {
                                  return (
                                    <div
                                      className="tag suggested-tag"
                                      key={tag.id}
                                      onClick={() => {
                                        addTags(connection, tag);
                                      }}
                                    >
                                      {tag.name}
                                    </div>
                                  );
                                }
                              })}
                            </>
                          ) : (
                            <>
                              {tagGroup.tags
                                .filter(tag =>
                                  tag.name
                                    .toLowerCase()
                                    .indexOf(searchValue.toLowerCase()) === -1
                                    ? false
                                    : true
                                )
                                .map((tag, index) => {
                                  const tagArr = tagFlag
                                    ? tagSelected
                                    : connection.tags;
                                  let filterData = tagArr.filter(
                                    data => data.id === tag.id
                                  );
                                  if (filterData.length === 0) {
                                    return (
                                      <div
                                        className="tag suggested-tag"
                                        key={tag.id}
                                        onClick={() => {
                                          addTags(connection, tag);
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
        </>
      )}
    </div>
  );
}
