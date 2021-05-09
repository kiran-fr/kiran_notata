import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { InputForm } from "Components/UI_Kits/InputForm/InputForm";

// API STUFF
import { useQuery, useMutation } from "@apollo/client";
import { connectionsGet } from "private/Apollo/Queries";
import { connectionCreate, creativePut } from "private/Apollo/Mutations";

// DEFINITIONS
import { startup_page } from "definitions";

// *****************
// * MAIN FUNCTION *
// *****************

export const CreateStartupModal = ({ history, close, styles }) => {
  // States
  const [existedFlag, setExistedFlag] = useState(undefined);

  // Form
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  // Mutations
  const [mutateCreative] = useMutation(creativePut);
  const [mutateConnectionCreate] = useMutation(connectionCreate);

  // Queries
  const connectionsQuery = useQuery(connectionsGet);
  const connections = connectionsQuery?.data?.connectionsGet || [];

  // Look for duplicate names
  let companyNameArr = [];
  function lookForDuplicateNames(value) {
    // Populate array if empty
    if (companyNameArr.length === 0) {
      companyNameArr = connections.map(sub => sub.creative?.name);
    }

    // Filter array to see if we have a match
    let match = companyNameArr.find(name => name === value);

    // If duplicate, set state
    setExistedFlag(match);
  }

  // Submit function with mutations
  const onSubmit = async data => {
    // Stop if startup with same name exists
    if (existedFlag) {
      close();
      setExistedFlag(undefined);
      return;
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
      let path = `${startup_page}/${connection.id}`;
      history.push(path);

      // Close modal
      close();
    } catch (error) {
      console.log("ERROR CREATING STARTUP", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.short}>
        <div className={styles.inputContainer} style={{ marginTop: "20px" }}>
          <p>Name</p>
          <InputForm
            type="text"
            fullWidth={true}
            name="companyName"
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
    </form>
  );
};

export default CreateStartupModal;
