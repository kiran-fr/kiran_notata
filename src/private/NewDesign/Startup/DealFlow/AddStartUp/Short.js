import React, { useState } from "react";
import { useForm } from "react-hook-form";
import _ from "lodash";
import { appsyncClient } from "../../../../../awsconfig";
// API STUFF
import { useMutation } from "@apollo/client";
import { connectionCreate, creativePut } from "private/Apollo/Mutations";
import { connectionAutoCompleteName } from "private/Apollo/Queries";
import { InputForm } from "Components/UI_Kits/InputForm/InputForm";

// COMPONENTS
import { Button, Modal } from "Components/elements";

// DEFINITIONS
import { startup_page } from "definitions";

// *****************
// * MAIN FUNCTION *
// *****************

export const Short = ({ history, closeModal, styles, connections }) => {
  // States
  const [existedFlag, setExistedFlag] = useState(undefined);
  const [connectionId, setconnectionId] = useState("");

  // Form
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  // Mutations
  const [mutateCreative] = useMutation(creativePut);
  const [mutateConnectionCreate] = useMutation(connectionCreate);

  const debounced = _.debounce(
    value => {
      appsyncClient
        .query({
          query: connectionAutoCompleteName,
          variables: {
            search: value,
          },
        })
        .then(result => {
          if (result?.data?.connectionAutoCompleteName) {
            setExistedFlag(
              result?.data?.connectionAutoCompleteName[0]?.creativeName
            );
            setconnectionId(result?.data?.connectionAutoCompleteName[0]?.connectionId);
          } else {
            setconnectionId("");
            setExistedFlag(undefined);
          }
        });
    },
    // delay in ms
    10
  );

  // Look for duplicate names
  const lookForDuplicateNames = value => {
    debounced(value);
  };

  // Submit function with mutations
  const onSubmit = async data => {
    // Stop if StartupPage with same name exists
    if (existedFlag) {
      // existing company
      closeModal();
    }

    try {
      // Create creative
      let creative_res = await mutateCreative(data);
      let creative = creative_res?.data?.creativePut;

      // Create connection
      let variables = { creativeId: creative.id };
      let res_connection = await mutateConnectionCreate({ variables });
      let connection = res_connection?.data?.connectionCreate;

      // Go to StartupPage page
      // let path = `${startup_page}/${connection.id}`;
      // let path = `${startup_page}/components/ui/navigation1`;

      // history.push(path);

      // closeModal modal
      closeModal();
    } catch (error) {
      console.log("ERROR CREATING STARTUP", error);
    }
  };

  const handleRedirect = () => {
    if (connectionId) {
      history.push(`${startup_page}/company/${connectionId}`);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className={styles.short}>
          <div className={styles.inputContainer} style={{ marginTop: "20px" }}>
            <p>Name</p>
            <InputForm
              type="text"
              fullWidth={true}
              name="variables.input.name"
              placeholder="I.e. Money Press Inc."
              handleInputChange={value => lookForDuplicateNames(value)}
              reference={register({ required: true })}
            />
          </div>
          {existedFlag && (
            <p className={styles.doyoumean}>
              Do you mean <span className = {styles.companyLink}
                onClick={()=>handleRedirect()}
              >
                {existedFlag}
              </span> It`s already Exists
            </p>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={(styles.buttonContainer, styles.btnSpace)}>
          <button onClick={() => closeModal()}>CANCEL</button>
          <button type="submit">
            {" "}
            {isSubmitting
            ?
              <i className={"fa fa-spinner fa-spin"} />
            : 
              "SAVE"
            }
          </button>
        </div>
      </div>
    </form>
  );
};

export default Short;
