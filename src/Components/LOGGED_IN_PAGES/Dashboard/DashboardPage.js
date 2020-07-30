import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import classnames from "classnames";

import { GhostLoader } from "../../elements/GhostLoader";
import Connections from "./Connections";

import { creativePut, connectionPut } from "../../../Apollo/Mutations";

import { standard_form } from "../../elements/Style.module.css";
import { content_tag } from "../../../routes.module.css";

import { action, input_icon } from "./DashboardPage.module.css";

import { Button, Content } from "../../elements/NotataComponents/";

// import { Button } from "antd";
// import { button_chevron_icon } from "../../elements/Ant.module.css";

const AddCreatives = ({ mutateConnection, setCreatedConnection }) => {
  const [showInput, setShowInput] = useState(false);
  const [mutateCreative] = useMutation(creativePut);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async data => {
    try {
      const {
        data: {
          creativePut: { id: creativeId }
        }
      } = await mutateCreative(data);
      const {
        data: {
          connectionPut: { id }
        }
      } = await mutateConnection({ variables: { creativeId } });
      setCreatedConnection(id);
      setShowInput(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isSubmitting && <GhostLoader />}

      <div
        style={{
          position: "relative",
          marginBottom: "30px"
        }}
      >
        <Button
          onClick={() => setShowInput(true)}
          type="right_arrow"
          size="large"
        >
          ADD NEW STARTUP
        </Button>
      </div>

      <form className={standard_form} onSubmit={handleSubmit(onSubmit)}>
        {showInput && (
          <>
            <div>
              <i
                className={classnames(input_icon, "fa fa-close")}
                onClick={() => setShowInput(false)}
              />
              <input
                placeholder="Dollar Press Ltd."
                type="text"
                name="variables.input.name"
                ref={register({ required: true })}
              />
            </div>
            <div>
              <input type="submit" value="save" />
              {isSubmitting && <i className="fa fa-spinner fa-spin" />}
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default function DashboardPage() {
  const [createdConnection, setCreatedConnection] = useState();
  const [mutateConnection, { loading: connectionLoading }] = useMutation(
    connectionPut
  );

  return (
    <Content maxWidth={1200}>
      <AddCreatives
        mutateConnection={mutateConnection}
        setCreatedConnection={setCreatedConnection}
      />

      <Connections createdConnection={createdConnection} />

      {/*
          {
            !connectionLoading && (
            <Connections createdConnection={createdConnection} />
            )
          }
        */}
    </Content>
  );
}
