import React, { useCallback, useState } from "react";
import { useMutation } from "@apollo/client";
import debounce from "lodash/debounce";

import { Card, Modal, SimpleInputForm } from "Components/elements";

import {
  funnelGroupDelete,
  funnelGroupPut,
  funnelTagDetele,
  funnelTagPut,
  tagDelete,
  tagGroupDelete,
  tagGroupPut,
  tagPut,
} from "Apollo/Mutations";

import { funnelGroupGet, tagGroupGet } from "Apollo/Queries";

import styles from "./TagGroup.module.css";
import { TagType } from "pages/private/Tags/index";
import { FunnelTag, Tag } from "pages/private/Dashboard/Connections/types";

function TagGroupNameAndDescription({
  id,
  name,
  type,
}: {
  id: string;
  name: string;
  type: TagType;
}) {
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
    <form className="focus_form mb3">
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

          if (type === TagType.FUNNELS) {
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

function DeleteTag({ tag, type }: { tag: Tag | FunnelTag; type: TagType }) {
  let [mutateTagsDelete, { loading: tagDeleteLoading }] = useMutation(
    tagDelete,
    {
      refetchQueries: [{ query: tagGroupGet }],
      awaitRefetchQueries: true,
    }
  );

  let [
    mutateFunnelTagsDelete,
    { loading: funnelTagDeleteLoading },
  ] = useMutation(funnelTagDetele, {
    refetchQueries: [{ query: funnelGroupGet }],
    awaitRefetchQueries: true,
  });

  const loading = tagDeleteLoading || funnelTagDeleteLoading;

  return (
    <div
      className={styles.option_save}
      onClick={() => {
        if (loading) return;
        const variables = { variables: { id: tag.id } };
        type === TagType.TAGS
          ? mutateTagsDelete(variables)
          : mutateFunnelTagsDelete(variables);
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

function TagInput({
  tag,
  tagGroupId,
  funnelGroupId,
  index,
  type,
}: {
  tag?: Tag | FunnelTag;
  tagGroupId: string;
  funnelGroupId: string;
  index: number;
  type: TagType;
}) {
  const [mutateTags, { loading: tagPutLoading }] = useMutation(tagPut, {
    refetchQueries: [{ query: tagGroupGet }],
    awaitRefetchQueries: true,
  });

  const [mutateFunnels, { loading: funnelTagPutLoading }] = useMutation(
    funnelTagPut,
    {
      refetchQueries: [{ query: funnelGroupGet }],
      awaitRefetchQueries: true,
    }
  );

  return (
    <div
      className={styles.option_dashed_container}
      style={{ paddingLeft: "10px" }}
    >
      <SimpleInputForm
        placeholder="Create new tag"
        val={tag ? tag.name : ""}
        submit={({ input_val }: { input_val: string }) => {
          if (!input_val.length) return;

          let variables: any = {
            input: {
              name: input_val,
              index,
            },
          };

          if (tag) {
            variables.id = tag.id;
          }

          if (type === TagType.FUNNELS) {
            variables.funnelGroupId = funnelGroupId;
            mutateFunnels({ variables });
          }

          if (type === TagType.TAGS) {
            variables.tagGroupId = tagGroupId;
            mutateTags({ variables }).then(null);
          }
        }}
      />

      {!tag && (
        <div className={styles.option_save}>
          {(tagPutLoading || funnelTagPutLoading) && (
            <span>
              <i className="fa fa-spinner fa-spin" />{" "}
            </span>
          )}
          add
        </div>
      )}

      {tag && <DeleteTag tag={tag} type={type} />}
    </div>
  );
}

function TagList({
  tags,
  funnelTags,
  tagGroupId,
  funnelGroupId,
  type,
}: {
  tags: Tag[];
  funnelTags: FunnelTag[];
  tagGroupId: string;
  funnelGroupId: string;
  type: TagType;
}) {
  const data = type === TagType.FUNNELS ? funnelTags : tags;

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
        index={type === TagType.FUNNELS ? funnelTags.length : tags.length}
        type={type}
      />
    </>
  );
}

function DeleteTagGroup({
  tags,
  groupId,
  name,
  type,
}: {
  tags: Tag[] | FunnelTag[];
  groupId: string;
  name: string;
  type: TagType;
}) {
  let [
    tagGroupDeleteMutation,
    { loading: tagGroupDeleteLoading },
  ] = useMutation(tagGroupDelete, {
    refetchQueries: [{ query: tagGroupGet }],
    awaitRefetchQueries: true,
  });

  let [
    funnelGroupDeleteMutation,
    { loading: funnelGroupDeleteLoading },
  ] = useMutation(funnelGroupDelete, {
    refetchQueries: [{ query: funnelGroupGet }],
    awaitRefetchQueries: true,
  });

  const [showWarning, setShowWarning] = useState(false);

  const loading = tagGroupDeleteLoading || funnelGroupDeleteLoading;

  return (
    <>
      <div style={{ paddingTop: "10px" }}>
        <div
          className={styles.option_save}
          onClick={() => {
            if (loading) return;

            if (tags.length) {
              setShowWarning(true);
              return;
            }
            const variable = {
              variables: {
                id: groupId,
              },
            };
            type === TagType.TAGS
              ? tagGroupDeleteMutation(variable)
              : funnelGroupDeleteMutation(variable);
          }}
        >
          {loading && (
            <span>
              <i className="fa fa-spinner fa-spin" />{" "}
            </span>
          )}
          <span>
            {type === TagType.TAGS ? "delete tag group" : "delete funnel group"}
          </span>
        </div>
      </div>
      {showWarning && (
        <Modal
          title={`${name} Delete Warning`}
          disableFoot={false}
          close={() => setShowWarning(false)}
          key="warningModal"
          loading={false}
          showScrollBar={false}
        >
          <span>
            You have to delete all the{" "}
            {type === TagType.TAGS ? "tags" : "funnels"} in the group before you
            can delete the group.
          </span>
        </Modal>
      )}
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
}: {
  id: string;
  name: string;
  description: string;
  tags: Tag[];
  funnelTags: FunnelTag[];
  index: number;
  type: TagType;
}) {
  return (
    <Card>
      <DeleteTagGroup
        tags={type === TagType.TAGS ? tags : funnelTags}
        groupId={id}
        name={name}
        type={type}
      />

      <TagGroupNameAndDescription id={id} name={name} type={type} />
      <TagList
        tags={tags}
        tagGroupId={id}
        funnelTags={funnelTags}
        funnelGroupId={id}
        type={type}
      />
      <div className={styles.tag_group_footer} />
    </Card>
  );
}
