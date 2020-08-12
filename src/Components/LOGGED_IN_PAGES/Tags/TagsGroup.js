import React, { useCallback } from "react";
import classnames from "classnames";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { debounce } from "lodash";

import {
  Card,
  Button,
  Table,
  Content,
  Modal,
  BreadCrumbs,
  GhostLoader,
  SimpleInputForm,
} from "../../elements";

// import { evaluationTemplateGet } from "../../../Apollo/Queries";
import {
  evaluationQuestionPut,
  evaluationTemplateSectionPut,
  tagGroupPut,
  tagPut,
} from "../../../Apollo/Mutations";
import { tagGroupGet } from "../../../Apollo/Queries";

// import {
//   profile,
//   evaluation_template,
//   evaluation_templates,
// } from "../../../../routes";

import {
  option_dashed_container,
  option_save,
  tag_group_footer,
  list_order,
  list_order_button,
  order_up,
  order_down,
  delete_tag_group,
} from "./TagGroup.module.css";

function TagGroupNameAndDescription({ id, name, description }) {
  const [mutate] = useMutation(tagGroupPut);
  const delayedMutation = useCallback(
    debounce(options => mutate(options), 1000),
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
          delayedMutation({
            variables: {
              id,
              input: { name: event.target.value },
            },
          });
        }}
      />

      <textarea
        rows={1}
        className="form_p2"
        name="input.description"
        defaultValue={description}
        onChange={event => {
          delayedMutation({
            variables: {
              id,
              input: { description: event.target.value },
            },
          });
        }}
      />
    </form>
  );
}

function TagInput({ tag, tagGroupId, index }) {
  const [mutate] = useMutation(tagPut, {
    refetchQueries: [{ query: tagGroupGet }],
    awaitRefetchQueries: true,
  });

  return (
    <div className={option_dashed_container}>
      <SimpleInputForm
        placeholder="Add new option..."
        val={tag ? tag.name : ""}
        submit={({ input_val }) => {
          if (!input_val.length) return;

          if (tag) {
            mutate({
              variables: {
                id: tag.id,
                tagGroupId,
                input: { name: input_val, index },
              },
            });
          } else {
            mutate({
              variables: {
                tagGroupId,
                input: { name: input_val, index },
              },
            });
          }
        }}
      />
      {!tag && <div className={option_save}>add</div>}
    </div>
  );
}

function TagList({ tags, tagGroupId }) {
  return (
    <>
      {[...tags]
        .sort((a, b) => a.index - b.index)
        .map((tag, i) => (
          <TagInput key={tag.id} tag={tag} tagGroupId={tagGroupId} index={i} />
        ))}

      <TagInput tagGroupId={tagGroupId} index={tags.length} />
    </>
  );
}

export default function TagGroup({ id, name, description, tags, index }) {
  const [mutate] = useMutation(tagGroupPut, {
    refetchQueries: [{ query: tagGroupGet }],
    awaitRefetchQueries: true,
  });

  return (
    <Card>
      <TagGroupNameAndDescription
        id={id}
        name={name}
        description={description}
      />
      <TagList tags={tags} tagGroupId={id} />
      <div className={tag_group_footer}>
        <section className={delete_tag_group}>delete tag group</section>
        <div className={list_order}>
          <div
            className={classnames(list_order_button, order_up)}
            onClick={() => {
              mutate({
                variables: {
                  id,
                  input: { index: index - 1 },
                },
              });
            }}
          >
            <i className="fas fa-arrow-alt-circle-up" />
          </div>

          <div
            className={classnames(list_order_button, order_down)}
            onClick={() => {
              mutate({
                variables: {
                  id,
                  input: { index: index + 1 },
                },
              });
            }}
          >
            <i className="fas fa-arrow-alt-circle-down" />
          </div>
        </div>
      </div>
    </Card>
  );
}
