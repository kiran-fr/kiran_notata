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

// Your problem starts with this query.
// The tag group query is more extensive, and contains both group and tags.

// //set data query
// const STATIONS_QUERY = gql`
//   {
//     tagGroupsGet {
//       name
//       tags {
//         name
//       }
//     }
//   }
// `;

export default function TagsModel({ connection }) {
  console.log("connection", connection);

  // Queries
  const { data, loading, error } = useQuery(tagGroupsGet);

  // Good :D
  const tagGroups = data?.tagGroupsGet || [];

  // Mutations
  const [addTagMutation] = useMutation(connectionTagAdd);
  const [removeTagMutation] = useMutation(connectionTagRemove);

  // Add tag function
  // function addTag(tag) {

  // }

  let tagTypesState = {};
  const [selectedTags, setSelectedTags] = useState([]);

  //const [showDropDown, setShowDropDown] = useState(false);

  // const tags = [
  //   {
  //     type: "Business",
  //     id: "business",
  //     tags: ["Hardware", "Software", "Financal"],
  //   },
  //   {
  //     type: "Source",
  //     id: "source",
  //     tags: ["Hardware", "Software", "Financal"],
  //   },
  // ];

  const [tagsStates, setTagsStates] = useState(tagTypesState);

  console.log("tagsStates", tagsStates);

  // const { data, loading, error } = useQuery(STATIONS_QUERY); //create query

  if (loading) return "Loading..."; //query processing
  if (error) return <pre>{error.message}</pre>; //if query has issue

  // tagGroups.map(({ id }) => {
  //   tagTypesState[id] = "collapse";
  // });

  // This is not very react'y :P

  // setTimeout(function () {
  //   const divs = document.querySelectorAll(".Buttons_primary_color__1fBdS");
  //
  //   divs.forEach(el =>
  //     el.addEventListener("click", event => {
  //       //addTag(selectedTags);
  //       // addTagMutation(addTag(selectedTags, connection));
  //
  //       console.log("tag added");
  //       return false;
  //     })
  //   );
  // }, 10000);

  return (
    <div className="tags-container">
      <div className="tags-container__sub-heading">Write or choose Tags</div>
      <div className="mb-2 tags-container__heading ">Tags</div>

      <Tags
        setTags={connection?.tags || []}
        getSelectedTag={data => {
          console.log("data", data);

          // let variables = {
          //   connectionId: connection.id,
          //   tagId: data.id,
          // }

          // let optimisticResponse = {
          //   __typename: "Mutation",
          //     connectionTagRemove: {
          //   ...connection,
          //       tags: [
          //       ...connection.tags
          //         .filter(({ id }) => id !== data.id)
          //         .map(t => ({
          //           ...t,
          //           index: null,
          //           description: null,
          //           createdBy: "tmp",
          //           createdAt: 0,
          //         })),
          //     ],
          //       __typename: "Connection",
          //   },
          // }
          //
          // removeTagMutation({
          //   variables,
          //   optimisticResponse
          // })
        }}
      />

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

                              // let updatedselectedTags = [...selectedTags];
                              // updatedselectedTags.push(
                              //   `${item.name}:${tag.name}`
                              // );

                              // console.log(updatedselectedTags);

                              // Selected tags should come from API, and not
                              // a custom state like this. Apollo should be able
                              // to deal with the state of the tags, and you can
                              // remove API call delays by using "optimisticResponse"
                              // setSelectedTags(updatedselectedTags);
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
