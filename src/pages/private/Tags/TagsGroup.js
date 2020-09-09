import React, { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { debounce } from "lodash";
import { Card, SimpleInputForm } from "../../../Components/elements";

import {
  tagGroupPut,
  tagPut,
  funnelGroupPut,
  funnelTagPut,
} from "../../../Apollo/Mutations";
import { tagGroupGet, funnelGroupGet } from "../../../Apollo/Queries";

import {
  option_dashed_container,
  option_save,
  tag_group_footer,
} from "./TagGroup.module.css";

function TagGroupNameAndDescription({ id, name, description, type }) {
  const [mutateTags] = useMutation(tagGroupPut);
  const delayedTagsMutation = useCallback(
    debounce(options => mutateTags(options), 1000),
    []
  );

  const [mutateFunnels] = useMutation(funnelGroupPut);
  const delayedFunnelsMutation = useCallback(
    debounce(options => mutateFunnels(options), 1000),
    []
  );

  return (
    <form className="focus_form" style={{ marginBottom: "20px" }}>
      <textarea
        rows={1}
        className="form_h2"
        name="input.name"
        defaultValue={name}
        onChange={event => {
          const variables = {
            variables: {
              id,
              input: { name: event.target.value },
            },
          };

          if (type === "funnels") {
            delayedFunnelsMutation(variables);
          } else {
            delayedTagsMutation(variables);
          }
        }}
      />
      {/*
          <textarea
            rows={1}
            className="form_p2"
            name="input.description"
            defaultValue={description}
            onChange={event => {
              const variables = {
                variables: {
                  id,
                  input: { description: event.target.value },
                },
              };

              if (type === "funnels") {
                delayedFunnelsMutation(variables);
              } else {
                delayedTagsMutation(variables);
              }
            }}
          />
        */}

      <hr />
    </form>
  );
}

function TagInput({ tag, tagGroupId, funnelGroupId, index, type }) {
  const [mutateTags] = useMutation(tagPut, {
    refetchQueries: [{ query: tagGroupGet }],
    awaitRefetchQueries: true,
  });

  const [mutateFunnels] = useMutation(funnelTagPut, {
    refetchQueries: [{ query: funnelGroupGet }],
    awaitRefetchQueries: true,
  });

  return (
    <div className={option_dashed_container} style={{ paddingLeft: "10px" }}>
      <SimpleInputForm
        placeholder="Create new tag"
        val={tag ? tag.name : ""}
        submit={({ input_val }) => {
          if (!input_val.length) return;
          if (tag) {
            if (type === "funnels") {
              mutateFunnels({
                variables: {
                  id: tag.id,
                  funnelGroupId,
                  input: { name: input_val, index },
                },
              });
            } else {
              mutateTags({
                variables: {
                  id: tag.id,
                  tagGroupId,
                  input: { name: input_val, index },
                },
              });
            }
          } else {
            if (type === "funnels") {
              mutateFunnels({
                variables: {
                  funnelGroupId,
                  input: { name: input_val, index },
                },
              });
            } else {
              mutateTags({
                variables: {
                  tagGroupId,
                  input: { name: input_val, index },
                },
              });
            }
          }
        }}
      />
      {!tag && <div className={option_save}>add</div>}
    </div>
  );
}

function TagList({ tags, funnelTags, tagGroupId, funnelGroupId, type }) {
  const data = type === "funnels" ? funnelTags : tags;

  return (
    <>
      {[...data]
        .sort((a, b) => a.index - b.index)
        .map((tag, i) => (
          <TagInput
            key={tag.id}
            tag={tag}
            tagGroupId={tagGroupId}
            funnelGroupId={funnelGroupId}
            index={i}
            type={type}
          />
        ))}

      <TagInput
        tagGroupId={tagGroupId}
        funnelGroupId={funnelGroupId}
        index={type === "funnels" ? funnelTags.length : tags.length}
        type={type}
      />
    </>
  );
}

export default function TagGroup({
  id,
  name,
  description,
  tags,
  funnelTags,
  index,
  type,
}) {
  return (
    <Card>
      <TagGroupNameAndDescription
        id={id}
        name={name}
        description={description}
        type={type}
      />
      <TagList
        tags={tags}
        tagGroupId={id}
        funnelTags={funnelTags}
        funnelGroupId={id}
        type={type}
      />
      <div className={tag_group_footer} />
    </Card>
  );
}
