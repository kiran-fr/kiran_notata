import React, { useState } from "react";
import "./tags.scss";
import { Tags } from "./Tags/Tags";
import { useQuery, gql, useMutation } from "@apollo/client";

// API STUFF

import { tagGroupsGet } from "private/Apollo/Queries";

import {
  connectionTagAdd,
  connectionTagRemove,
} from "private/Apollo/Mutations";

const addTag = (tag, connection) => ({
  variables: {
    connectionId: connection.id,
    tagId: tag.id,
  },

  optimisticResponse: {
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
  },
});

const deleteTag = (tag, connection) => ({
  variables: {
    connectionId: connection.id,
    tagId: tag.id,
  },

  optimisticResponse: {
    __typename: "Mutation",
    connectionTagRemove: {
      ...connection,
      tags: [
        ...connection.tags
          .filter(({ id }) => id !== tag.id)
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
  },
});
//set data query
const STATIONS_QUERY = gql`
  {
    tagGroupsGet {
      name
      tags {
        name
      }
    }
  }
`;
export default function ShareTemplate({ connection }) {
  // Queries

  const tagGroupsQuery = useQuery(tagGroupsGet);
  const tagGroups = tagGroupsQuery?.data?.tagGroupsGet || [];
  // Mutations
  const [addTagMutation] = useMutation(connectionTagAdd);

  // Add tag function
  // function addTag(tag) {

  // }

  let tagTypesState = {};
  const [selectedTags, setSelectedTags] = useState([]);
  //const [showDropDown, setShowDropDown] = useState(false);

  const tags = [
    {
      type: "Business",
      id: "business",
      tags: ["Hardware", "Software", "Financal"],
    },
    {
      type: "Source",
      id: "source",
      tags: ["Hardware", "Software", "Financal"],
    },
  ];

  const [tagsStates, setTagsStates] = useState(tagTypesState);
  const { data, loading, error } = useQuery(STATIONS_QUERY); //create query
  if (loading) return "Loading..."; //query processing
  if (error) return <pre>{error.message}</pre>; //if query has issue
  data.tagGroupsGet &&
    data.tagGroupsGet.map(item => {
      tagTypesState[item.name] = "collapse";
    });

  setTimeout(function () {
    const divs = document.querySelectorAll(".Buttons_primary_color__1fBdS");

    divs.forEach(el =>
      el.addEventListener("click", event => {
        //addTag(selectedTags);
        // addTagMutation(addTag(selectedTags, connection));

        console.log("tag added");
        return false;
      })
    );
  }, 10000);

  return (
    <div className="tags-container">
      <div className="tags-container__sub-heading">Write or choose Tags</div>
      <div className="mb-2 tags-container__heading ">Tags</div>
      <Tags setTags={selectedTags} getSelectedTag={setSelectedTags} />
      <div className="tags-container__dropdown">
        {data.tagGroupsGet &&
          data.tagGroupsGet.map(item => {
            if (item.name !== null) {
              return (
                <div className="row" key={item.name}>
                  <div className="col-sm-10 col-xs-10 section-heading">
                    {item.name}
                  </div>
                  <div className="col-sm-2 col-xs-2 expand-collapse-icon">
                    <i
                      className={`fa ${
                        tagsStates[item.name] === ""
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                      aria-hidden="true"
                      onClick={() => {
                        let updatedTagsStates = { ...tagsStates };
                        updatedTagsStates[item.name] =
                          tagsStates[item.name] === "" ? "collapse" : "";
                        setTagsStates(updatedTagsStates);
                      }}
                    ></i>
                  </div>
                  <div
                    className={`col-sm-12 col-xs-12 ${
                      tagsStates[item.name] === "" ? "" : "collapse"
                    }`}
                  >
                    <div className="type-tags-container">
                      {item.tags.map((tag, index) => {
                        return (
                          <div
                            className="tag suggested-tag"
                            key={`${item.name}-${index}`}
                            onClick={() => {
                              let updatedselectedTags = [...selectedTags];
                              updatedselectedTags.push(
                                `${item.name}:${tag.name}`
                              );
                              console.log(updatedselectedTags);
                              setSelectedTags(updatedselectedTags);
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
          })}
      </div>
    </div>
  );
}
