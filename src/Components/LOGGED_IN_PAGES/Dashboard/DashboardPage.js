import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import classnames from "classnames";

import Connections from "./Connections";

import { creativePut, connectionPut } from "../../../Apollo/Mutations";

import { input_icon } from "./DashboardPage.module.css";

import { startup_page } from "../../../routes";

import { Button, Content, Modal, GhostLoader } from "../../elements/";

const CreateNewStartup = ({ setDone }) => {
  const [showModal, setShowModal] = useState(false);
  const [mutateCreative] = useMutation(creativePut);
  const [mutateConnection] = useMutation(connectionPut);

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    try {
      const {
        data: {
          creativePut: { id: creativeId },
        },
      } = await mutateCreative(data);
      const {
        data: {
          connectionPut: { id },
        },
      } = await mutateConnection({ variables: { creativeId } });
      setDone(id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          marginBottom: "30px",
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

      {showModal && (
        <Modal
          title="Add startup"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginTop: "30px" }}>
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
        </Modal>
      )}
    </>
  );
};

export default function DashboardPage({ history }) {
  return (
    <Content maxWidth={1200}>
      <CreateNewStartup
        setDone={connectionId => {
          console.log("connectionId...", connectionId);
          history.push(`${startup_page}/${connectionId}`);
        }}
      />

      <Connections history={history} />
    </Content>
  );
}
