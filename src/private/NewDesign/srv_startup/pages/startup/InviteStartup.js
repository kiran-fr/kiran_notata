import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

// API STUFF
import { creativeUpdate } from "private/Apollo/Mutations";
import { InputForm } from "Components/UI_Kits/InputForm/InputForm";
import { useQuery, useMutation } from "@apollo/client";

export const InviteStartup = ({ id, answers, creative }) => {
  // Form
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const [inviteSent, setInviteSent] = useState(false);
  const [urlToShare, setUrlToShare] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (creative?.sharedWithEmail) {
      setUrlToShare(getPublicShareUrl(creative));
      setInviteSent(true);
    }
  }, [creative]);

  // Mutations
  const [mutateCreativeUpdate] = useMutation(creativeUpdate);

  function getPublicShareUrl(creative) {
    let url =
      `${window.location.protocol}//` +
      `${window.location.host}/` +
      `public/creative/` +
      `${creative.accountId}/` +
      `${creative.id}` +
      `&email=${creative.sharedWithEmail}`;
    return url;
  }

  // Submit function with mutations
  const onSubmit = async data => {
    // Stop if startup with same name exists

    let variables = {
      id: id,
      input: {
        sharedWithEmail: data?.variables?.input?.email,
        answers,
      },
    };
    setEmail(data?.variables?.input?.email);
    let update = await mutateCreativeUpdate({
      variables,
    });

    setUrlToShare(getPublicShareUrl(update?.data?.creativePut));
    setInviteSent(true);
  };

  // Submit function with mutations
  const revoke = async () => {
    let variables = {
      id: id,
      input: {
        sharedWithEmail: email,
        removeSharing: true,
        answers,
      },
    };

    let update = await mutateCreativeUpdate({
      variables,
    });
    console.log(update);
    setInviteSent(false);
  };

  return (
    <>
      {inviteSent ? (
        <div>
          <div>{urlToShare}</div>
          <button onClick={revoke}>Revoke</button>
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
