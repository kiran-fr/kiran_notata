import React, { useState } from "react";
import { useForm } from "react-hook-form";

// API STUFF
import { creativeUpdate } from "private/Apollo/Mutations";
import { InputForm } from "Components/UI_Kits/InputForm/InputForm";
import { useQuery, useMutation } from "@apollo/client";

export const InviteStartup = ({ id, answers }) => {
  // Form
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const [inviteSent, setInviteSent] = useState(false);
  const [urlToShare, setUrlToShare] = useState(null);
  const [email, setEmail] = useState("");

  // Mutations
  const [mutateCreativeUpdate] = useMutation(creativeUpdate);

  function getPublicShareUrl(creative) {
    let url =
      `${window.location.protocol}//` +
      `${window.location.host}/` +
      `public/creative/` +
      `${creative.accountId || creative.id}/` +
      `${creative.id}` +
      `&email=${creative.sharedWithEmail}`;
    return url;
  }

  // Submit function with mutations
  const onSubmit = async data => {
    // Stop if startup with same name exists

    console.log(data?.variables?.input?.email);
    let variables = {
      id: id,
      sharedWithEmail: email,
      input: {
        answers,
      },
    };
    setEmail(data?.variables?.input?.email);
    let update = await mutateCreativeUpdate({
      variables,
    });

    console.log(getPublicShareUrl(update?.data?.creativePut));

    setUrlToShare(
      getPublicShareUrl(update?.data?.creativePut?.sharedWithEmail)
    );
    setInviteSent(true);
  };

  // Submit function with mutations
  const revoke = async () => {
    // Stop if startup with same name exists

    console.log("revoke called");
    let revokeVariables = {
      id: id,
      sharedWithEmail: email,
      removeSharing: "true",
      input: {
        answers,
      },
    };

    let update = await mutateCreativeUpdate({
      variables: revokeVariables,
    });
    console.log(update);
  };

  return (
    <>
      {inviteSent ? (
        <div>
          <div>{urlToShare}</div>
          <button onClick={revoke}>
            {" "}
            {isSubmitting ? (
              <i className={"fa fa-spinner fa-spin"} />
            ) : (
              "Revoke"
            )}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputForm
            type="email"
            fullWidth={true}
            name="variables.input.email"
            placeholder="I.e. Money Press Inc."
            reference={register({ required: true })}
          />
          <div>
            {/* <button onClick={() => closeModal()}>CANCEL</button> */}
            <button type="submit">
              {" "}
              {isSubmitting ? (
                <i className={"fa fa-spinner fa-spin"} />
              ) : (
                "Invite"
              )}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default InviteStartup;
