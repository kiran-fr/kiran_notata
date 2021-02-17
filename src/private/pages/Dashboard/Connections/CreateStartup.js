import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@apollo/client";
import { connectionsGet, tagGroupGet } from "private/Apollo/Queries";
import {
  connectionCreate,
  creativePut,
  connectionTagAdd,
  connectionTagRemove,
} from "private/Apollo/Mutations";
import {
  AddTagMutationOptions,
  DeleteTagMutationOptions,
} from "private/pages/Dashboard/Connections/Connections";
import { startup_page } from "definitions.js";

import { Button, Modal } from "Components/elements";
import TagSelector from "Components/TagSelector/TagSelector";
import SetSubjectiveScore from "private/pages/Dashboard/Connections/SetSubjectiveScore";

import {
  shortcuts_list,
  shortcuts_list_footer,
} from "./Connections.module.css";

export const CreateNewStartup = ({
  history,
  showModalOnly,
  showModalState,
  onCloseModalEvent,
}) => {
  const [showModal, setShowModal] = useState(showModalState?.state);
  const [showConnection, setShowConnection] = useState();
  const [showTagGroup, setShowTagGroup] = useState();
  const [showEvaluate, setShowEvaluate] = useState();

  const [mutateCreative] = useMutation(creativePut);
  const [mutateConnectionCreate] = useMutation(connectionCreate, {
    refetchQueries: [{ query: connectionsGet }],
  });
  const [mutateConnectionTagAdd] = useMutation(connectionTagAdd);
  const [mutateconnectionTagRemove] = useMutation(connectionTagRemove);

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  useEffect(() => {
    setShowModal(showModalState?.state);
  }, [showModalState]);

  const onSubmit = async (data, event) => {
    try {
      const {
        data: {
          creativePut: { id: creativeId },
        },
      } = await mutateCreative(data);
      const res = await mutateConnectionCreate({ variables: { creativeId } });
      const {
        data: { connectionCreate: connection },
      } = res;
      setShowConnection(connection.id);
    } catch (error) {
      console.log(error);
    }
  };
  const connectionsQuery = useQuery(connectionsGet, {
    fetchPolicy: "cache-first",
  });
  const connections = connectionsQuery.data?.connectionsGet || [];

  const tagGroupsQuery = useQuery(tagGroupGet, { fetchPolicy: "cache-first" });
  const tagGroups = tagGroupsQuery.data?.accountGet.tagGroups || [];

  let showTagsForConnection;
  if (showTagGroup) {
    showTagsForConnection = (connections || []).find(
      ({ id }) => id === showTagGroup
    );
  }
  let showEvaluateForConnection;
  if (showEvaluate) {
    showEvaluateForConnection = (connections || []).find(
      ({ id }) => id === showEvaluate
    );
  }

  function addTag(tag, connection) {
    mutateConnectionTagAdd(AddTagMutationOptions(tag, connection));
  }

  function deleteTag(tag, connection) {
    mutateconnectionTagRemove(DeleteTagMutationOptions(tag, connection));
  }

  return (
    <>
      {!showModalOnly && (
        <div
          style={{
            position: "relative",
            marginBottom: "10px",
            top: "-20px",
          }}
        >
          <Button
            onClick={() => setShowModal(true)}
            type="right_arrow"
            size="large"
          >
            ADD NEW STARTUP
          </Button>
        </div>
      )}

      {showModal && (
        <Modal
          title="Add startup"
          close={() => {
            setShowModal(false);
            setShowConnection(undefined);
          }}
          disableFoot={true}
        >
          {!showConnection && (
            <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt3">
                <input
                  type="text"
                  placeholder='I.e. "Money Press Inc."'
                  autoComplete="off"
                  ref={register({ required: true })}
                  name="variables.input.name"
                />

                <div
                  style={{
                    marginTop: "5px",
                    textAlign: "right",
                  }}
                >
                  <Button type="input" value="OK" loading={isSubmitting} />
                </div>
              </div>
            </form>
          )}

          {showConnection && (
            <div>
              <ul className={shortcuts_list}>
                <li
                  onClick={() => {
                    setShowTagGroup(showConnection);
                    setShowConnection(undefined);
                    setShowModal(false);
                  }}
                >
                  Add tags
                </li>

                <li
                  onClick={() => {
                    setShowEvaluate(showConnection);
                    setShowConnection(undefined);
                    setShowModal(false);
                  }}
                >
                  Evaluate
                </li>

                <li
                  style={{ color: "var(--color-primary)" }}
                  onClick={() => {
                    setShowConnection(undefined);
                  }}
                >
                  Add another startup
                </li>
              </ul>

              <div className={shortcuts_list_footer}>
                <span />
                <Button
                  type="right_arrow"
                  size="medium"
                  onClick={() => {
                    history.push(`${startup_page}/${showConnection}`, {
                      rightMenu: true,
                    });
                    showModalOnly && onCloseModalEvent();
                  }}
                >
                  View startup
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
      {showTagGroup && (
        <TagSelector
          title={showTagsForConnection?.creative.name}
          show={showTagsForConnection}
          tagGroups={tagGroups}
          checkedTags={showTagsForConnection?.tags}
          addTag={tag => addTag(tag, showTagsForConnection)}
          deleteTag={tag => deleteTag(tag, showTagsForConnection)}
          close={() => {
            setShowModal(true);
            setShowConnection(showTagGroup);
            setShowTagGroup(undefined);
          }}
        />
      )}

      {showEvaluate && (
        <SetSubjectiveScore
          connection={showEvaluateForConnection}
          history={history}
          close={() => {
            setShowModal(true);
            setShowConnection(showEvaluate);
            setShowEvaluate(undefined);
          }}
        />
      )}
    </>
  );
};

export default CreateNewStartup;