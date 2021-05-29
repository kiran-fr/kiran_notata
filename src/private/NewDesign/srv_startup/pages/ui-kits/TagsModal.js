import React, { useState } from "react";
import "./TagsModal.scss";
import { Tags } from "./Tags/Tags";
import { useQuery, gql, useMutation } from "@apollo/client";

// API STUFF

import { tagGroupsGet } from "private/Apollo/Queries";

import {
  connectionTagAdd,
  connectionTagRemove,
} from "private/Apollo/Mutations";
//import { GhostLoader } from "Components/elements";

export default function TagsModal({ connection }) {
  // Queries
  const { data, loading, error } = useQuery(tagGroupsGet);

  // Good :D
  const tagGroups = data?.tagGroupsGet || [];

  // Mutations
  const [addTagMutation] = useMutation(connectionTagAdd);
  const [removeTagMutation] = useMutation(connectionTagRemove);

  let tagTypesState = {};
  const [selectedTags, setSelectedTags] = useState([]);

  const [tagsStates, setTagsStates] = useState(tagTypesState);

  const removeTag = tagId => {
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
  };

  if (loading) return "Loading..."; //query processing
  if (error) return <pre>{error.message}</pre>; //if query has issue

  return (
    <div className="tags-container">
      <div className="tags-container__sub-heading">Write or choose Tags</div>
      {/*}
      <GhostLoader></GhostLoader>
  {*/}
      <Tags
        setTags={connection?.tags || []}
        removeTag={removeTag}
        getSelectedTag={d => {
          if (!d.id) {
            // You need to get the ID of the tag object you are deleting...
            // Right now that does not seem to be passed in the "data" object
            return;
          }

          let variables = {
            connectionId: connection.id,
            tagId: d.id,
          };

          let optimisticResponse = {
            __typename: "Mutation",
            connectionTagRemove: {
              ...connection,
              tags: [
                ...connection.tags
                  .filter(({ id }) => id !== d.id)
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

          removeTagMutation({
            variables,
            optimisticResponse,
          });
        }}
      />
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
                      tagsStates[tagGroup.id] ? "" : "collapse"
                    }`}
                  >
                    <div className="type-tags-container">
                      {tagGroup.tags.map((tag, index) => {
                        return (
                          <div
                            className="tag suggested-tag"
                            key={tag.id}
                            onClick={() => {
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
                            }}
                          >
                            {tag.name}
                          </div>
                        );
                      })}
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
