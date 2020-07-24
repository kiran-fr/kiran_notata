import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import classnames from "classnames";

import { GhostLoader } from "../../elements/GhostLoader";
import Connections from "./Connections";

import { creativePut, connectionPut } from "../../../Apollo/Mutations";

import { standard_form, button_class } from "../../elements/Style.module.css";
import { content_tag } from "../../../routes.module.css";
import { action_row, action, input_icon } from "./DashboardPage.module.css";

function AddCreatives({ mutateConnection, setCreatedConnection }) {
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
      <div className={action_row}>
        <button
          onClick={() => setShowInput(true)}
          className={classnames(button_class, action)}
        >
          add startup
        </button>
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
}

export default function DashboardPage() {
  const [createdConnection, setCreatedConnection] = useState();
  const [mutateConnection, { loading: connectionLoading }] = useMutation(
    connectionPut
  );

  return (
    <>
      <div className={content_tag}>
        <AddCreatives
          mutateConnection={mutateConnection}
          setCreatedConnection={setCreatedConnection}
        />
        {!connectionLoading && (
          <Connections createdConnection={createdConnection} />
        )}
      </div>
    </>
  );
}
