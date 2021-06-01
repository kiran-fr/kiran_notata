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
  const [connectionData, setconnectionData] = useState([]);

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
            setconnectionData(result?.data?.connectionAutoCompleteName);
          } else {
            setconnectionData([]);
            setExistedFlag(undefined);
          }
        });
    },
    // delay in ms
    1000
  );

  // Look for duplicate names
  const lookForDuplicateNames = value => {
    debounced(value);
  };

  // Submit function with mutations
  const onSubmit = async data => {
    // Stop if startup with same name exists
    if (existedFlag) {
      // existing company
      if (connectionData.length > 0) {
        connectionData.map(el => {
          if (
            el.creativeName.toLowerCase().trim() ===
            data.variables.input.name.toLowerCase().trim()
          ) {
            history.push(`${startup_page}/company/${el.connectionId}`);
          }
        });
      }
    }

    try {
      // Create creative
      let creative_res = await mutateCreative(data);
      let creative = creative_res?.data?.creativePut;

      // Create connection
      let variables = { creativeId: creative.id };
      let res_connection = await mutateConnectionCreate({ variables });
      let connection = res_connection?.data?.connectionCreate;

      // Go to startup page
      // let path = `${startup_page}/${connection.id}`;
      // let path = `${startup_page}/components/ui/navigation1`;

      // history.push(path);

      // closeModal modal
      closeModal();
    } catch (error) {
      console.log("ERROR CREATING STARTUP", error);
    }
  };

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
              Do you mean <span>{existedFlag}</span> It`s already Exists
            </p>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={(styles.buttonContainer, styles.btnSpace)}>
          <button onClick={() => closeModal()}>CANCEL</button>
          <button type="submit">
            {" "}
            {isSubmitting ? (
              <i className={"fa fa-spinner fa-spin"} />
            ) : existedFlag ? (
              "Okay"
            ) : (
              "SAVE"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Short;
