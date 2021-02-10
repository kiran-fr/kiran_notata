import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { connectionsGet } from "Apollo/Queries";
import { connectionCreate, creativePut } from "Apollo/Mutations";

import { startup_page } from "definitions.js";

import { Button, Modal } from "Components/elements";

import {
  shortcuts_list,
  shortcuts_list_footer,
} from "./Connections.module.css";

export const CreateNewStartup = ({
  setDone,
  history,
  setShowTagGroup,
  setShowEvaluate,
  showModalOnly,
  showModalState,
  onCloseModalEvent,
}) => {
  const [showModal, setShowModal] = useState(showModalState?.state);
  const [showConnection, setShowConnection] = useState();

  const [mutateCreative] = useMutation(creativePut);
  const [mutateConnectionCreate] = useMutation(connectionCreate, {
    refetchQueries: [{ query: connectionsGet }],
  });

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
                  placeholder={`I.e. "Money Press Inc."`}
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
    </>
  );
};

export default CreateNewStartup;
