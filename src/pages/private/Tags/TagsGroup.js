import React, { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { debounce } from "lodash";

import { Card, SimpleInputForm } from "Components/elements";

import {
  tagGroupPut,
  tagPut,
  tagDelete,
  funnelGroupPut,
  funnelTagPut,
} from "Apollo/Mutations";

import { tagGroupGet, funnelGroupGet } from "Apollo/Queries";

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
      <hr />
    </form>
  );
}

function DeleteTag({ tag }) {
  let [mutate, { data, loading, error }] = useMutation(tagDelete, {
    refetchQueries: [{ query: tagGroupGet }],
    awaitRefetchQueries: true,
  });

  return (
    <div
      className={option_save}
      onClick={() => {
        if (loading) return;
        mutate({ variables: { id: tag.id } });
      }}
    >
      {loading && (
        <span>
          <i className="fa fa-spinner fa-spin" />{" "}
        </span>
      )}
      delete
    </div>
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

          let variables = {
            input: {
              name: input_val,
              index,
            },
          };

          if (tag) {
            variables.id = tag.id;
          }

          if (type === "funnels") {
            variables.funnelGroupId = funnelGroupId;
            mutateFunnels({ variables });
          }

          if (type !== "funnels") {
            variables.tagGroupId = tagGroupId;
            mutateTags({ variables });
          }
        }}
      />

      {!tag && <div className={option_save}>add</div>}

      {tag && <DeleteTag tag={tag} />}
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

function DeleteTagGroup({ tags, tagGroupId }) {
  let [mutate, { loading, error, data }] = useMutation(tagGroupPut, {
    refetchQueries: [{ query: tagGroupGet }],
    awaitRefetchQueries: true,
  });

  return (
    <div style={{ paddingTop: "10px" }}>
      <div
        className={option_save}
        onClick={() => {
          if (loading) return;

          if (tags.length) {
            return window.alert(
              "You have to delete all the tags in the group before you can delete the group."
            );
          }

          mutate({
            variables: {
              id: tagGroupId,
              delete: true,
            },
          });
        }}
      >
        {loading && (
          <span>
            <i className="fa fa-spinner fa-spin" />{" "}
          </span>
        )}
        <span>delete tag group</span>
      </div>
    </div>
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
      <DeleteTagGroup tags={tags} tagGroupId={id} />

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
