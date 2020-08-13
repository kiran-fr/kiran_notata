import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import classnames from "classnames";
import moment from "moment";

import { tagGroupGet, connectionGet } from "../../../../Apollo/Queries";
import {
  connectionTagAdd,
  connectionTagRemove,
} from "../../../../Apollo/Mutations";

import { Button, Tag } from "../../../elements/";

import {
  button_container,
  dropdown_title,
  open_button,
  dropdown_container,
  dropdown_inner,
  dropdown_group,
  dropdown_group_header,
  dropdown_group_title,
  dropdown_group_list,
  dropdown_group_list_item,
  dropdown_group_tag_kill,
  dropdown_group_tag_name,
  dropdown_list_container,
  dropdown_group_item,
  dropdown_group_item_check,
  dropdown_group_item_name,
  dropdown_group_item_kill,
  dropdown_close,
  tag_each,
  tag_name,
  tag_kill,
} from "./Tags.module.css";

function TagPage({ group, connection, mutate, mutateDelete, close }) {
  const [filter, setFilter] = useState("");

  let tags = group.tags;

  if (filter.length) {
    tags = tags.filter(({ name }) =>
      name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  return (
    <div className={dropdown_container}>
      <div className={dropdown_title}>Add tags</div>
      <div className={dropdown_inner}>
        <div>{group.name}</div>

        <div className="notata_form">
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="filter list..."
          />
        </div>

        <div className={dropdown_list_container}>
          {tags.map(({ name, id }) => {
            const isChecked = connection.tags.some(
              ({ id: tagId }) => id === tagId
            );
            return (
              <div key={id} className={dropdown_group_item}>
                <div className={dropdown_group_item_check}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        if (!isChecked) {
                          mutate({
                            variables: {
                              connectionId: connection.id,
                              tagId: id,
                            },
                          });
                        }

                        if (isChecked) {
                          mutateDelete({
                            variables: {
                              connectionId: connection.id,
                              tagId: id,
                            },
                          });
                        }
                      }}
                    />
                    {name}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={dropdown_close} onClick={close}>
        <i className="fal fa-arrow-left" />
      </div>
    </div>
  );
}

function TagOverview({
  connection,
  tagGroups,
  setShowGroup,
  mutate,
  mutateDelete,
  close,
}) {
  const [filter, setFilter] = useState("");

  let filteredList = [];
  if (filter.length) {
    filteredList = tagGroups
      .map(group => ({
        ...group,
        tags: group.tags.filter(({ name }) =>
          name.toLowerCase().includes(filter.toLowerCase())
        ),
      }))
      .filter(group => group.tags.length);
  }

  return (
    <div className={dropdown_container}>
      <div className={dropdown_title}>Add tags</div>

      <div className={dropdown_inner}>
        <div className="notata_form">
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Search for tags"
          />
        </div>

        {!filter.length &&
          tagGroups.map((tagGroup, i) => (
            <div className={dropdown_group} key={i}>
              <div className={dropdown_group_header}>
                <div className={dropdown_group_title}>{tagGroup.name}</div>
                <Button
                  type="tiny_right"
                  onClick={() => setShowGroup(tagGroup)}
                />
              </div>

              <div className={dropdown_group_list}>
                {tagGroup.tags
                  .filter(tag =>
                    connection.tags.some(({ id: tagId }) => tagId === tag.id)
                  )
                  .map(({ name, id }) => {
                    return (
                      <div className={dropdown_group_list_item} key={id}>
                        <div
                          className={dropdown_group_tag_kill}
                          onClick={() => {
                            mutateDelete({
                              variables: {
                                connectionId: connection.id,
                                tagId: id,
                              },
                            });
                          }}
                        >
                          <i className="fal fa-times" />
                        </div>
                        <div className={dropdown_group_tag_name}>{name}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

        {!!filter.length &&
          filteredList.map((tagGroup, i) => {
            return (
              <div key={i}>
                <div>{tagGroup.name}</div>
                {tagGroup.tags.map((tag, ii) => {
                  const isChecked = connection.tags.some(
                    ({ id: tagId }) => tagId === tag.id
                  );
                  return (
                    <div
                      key={`${i}-${ii}`}
                      className={dropdown_group_item_check}
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            console.log("isChecked", isChecked);

                            if (!isChecked) {
                              mutate({
                                variables: {
                                  connectionId: connection.id,
                                  tagId: tag.id,
                                },
                              });
                            }
                            if (isChecked) {
                              mutateDelete({
                                variables: {
                                  connectionId: connection.id,
                                  tagId: tag.id,
                                },
                              });
                            }
                          }}
                        />
                        {tag.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>

      <div className={dropdown_close} onClick={close}>
        <i className="fal fa-times" />
      </div>
    </div>
  );
}

export function Tags({ connection, user, match }) {
  const [show, setShow] = useState(false);
  const [showGroup, setShowGroup] = useState(null);

  const { data, loading, error } = useQuery(tagGroupGet);

  const [mutate, { loading: mutationLoading }] = useMutation(connectionTagAdd, {
    refetchQueries: [
      {
        query: connectionGet,
        variables: { id: connection.id },
      },
    ],
    awaitRefetchQueries: true,
  });

  const [mutateDelete, { loading: mutationDeleteLoading }] = useMutation(
    connectionTagRemove,
    {
      refetchQueries: [
        {
          query: connectionGet,
          variables: { id: connection.id },
        },
      ],
      awaitRefetchQueries: true,
    }
  );

  if (error) {
    console.log(error);
    return <div>We are updating</div>;
  }

  const tagGroups = (data && data.accountGet.tagGroups) || [];

  return (
    <div>
      {!connection.tags.length && (
        <div>
          <div style={{ fontSize: "18px" }}>Add tags</div>
          <div
            style={{ padding: "20px 0px", color: "var(--color-gray-medium)" }}
          >
            You can add tags to make it easier to filter through your startups.
            Tags are also used to see the bigger picture in reports. We
            recommend that you spend some time getting your tags right, as it
            will make it easier for you to navigate in your data.
          </div>
        </div>
      )}

      {!!connection.tags.length && (
        <div style={{ paddingBottom: "10px" }}>
          {connection.tags.map(tag => {
            const group =
              tagGroups.find(({ id }) => id === tag.tagGroupId) || {};
            return (
              <Tag key={tag.id}>
                <div className={tag_each}>
                  <div className={tag_name}>
                    {group.name}: {tag.name}
                  </div>
                  <div
                    className={tag_kill}
                    onClick={() => {
                      mutateDelete({
                        variables: {
                          connectionId: connection.id,
                          tagId: tag.id,
                        },
                      });
                    }}
                  >
                    <i className="fal fa-times" />
                  </div>
                </div>
              </Tag>
            );
          })}
        </div>
      )}

      <div className={button_container}>
        {/*OVERVIEW*/}
        {show && tagGroups && !showGroup && (
          <TagOverview
            tagGroups={tagGroups}
            connection={connection}
            setShowGroup={setShowGroup}
            mutate={mutate}
            mutateDelete={mutateDelete}
            close={() => setShow(false)}
          />
        )}

        {/*PAGE*/}
        {show && showGroup && (
          <TagPage
            group={showGroup}
            connection={connection}
            mutate={mutate}
            mutateDelete={mutateDelete}
            close={() => setShowGroup(null)}
          />
        )}
      </div>

      <div style={{ textAlign: "right" }}>
        <Button type="just_text" onClick={() => setShow(true)}>
          Add/remove tags
        </Button>
      </div>
    </div>
  );
}
