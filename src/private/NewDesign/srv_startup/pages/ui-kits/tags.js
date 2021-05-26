import React, { useState } from "react";
import "./tags.scss";
import { Tags } from "./Tags/Tags";

export default function ShareTemplate() {
  let tagTypesState = {};
  const [selectedTags, setSelectedTags] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
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
  tags.map(item => {
    tagTypesState[item.id] = "collapse";
  });
  const [tagsStates, setTagsStates] = useState(tagTypesState);
  return (
    <div className="tags-container">
      <div className="tags-container__sub-heading">Write or choose Tags</div>
      <div className="mb-2 tags-container__heading ">Tags</div>
      <Tags setTags={selectedTags} getSelectedTag={setSelectedTags} />
      <div className="tags-container__dropdown">
        {tags.map(item => {
          return (
            <div className="row" key={item.id}>
              <div className="col-sm-10 col-xs-10 section-heading">
                {item.type}
              </div>
              <div className="col-sm-2 col-xs-2 expand-collapse-icon">
                <i
                  className={`fa ${
                    tagsStates[item.id] === ""
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                  aria-hidden="true"
                  onClick={() => {
                    let updatedTagsStates = { ...tagsStates };
                    updatedTagsStates[item.id] =
                      tagsStates[item.id] === "" ? "collapse" : "";
                    setTagsStates(updatedTagsStates);
                  }}
                ></i>
              </div>
              <div className={`col-sm-12 col-xs-12 ${tagsStates[item.id]}`}>
                <div className="type-tags-container">
                  {item.tags.map((tag, index) => {
                    return (
                      <div
                        className="tag suggested-tag"
                        key={`${item.id}-${index}`}
                        onClick={() => {
                          let updatedselectedTags = [...selectedTags];
                          updatedselectedTags.push(`${item.type}:${tag}`);
                          console.log(updatedselectedTags);
                          setSelectedTags(updatedselectedTags);
                        }}
                      >
                        {tag}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
