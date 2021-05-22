import React, { useState, useEffect } from "react";

// API STUFF
import { creativeUpdate } from "private/Apollo/Mutations";
import { InputForm } from "Components/UI_Kits/InputForm/InputForm";
import { useMutation } from "@apollo/client";
import { Modal } from "../../../../../Components/UI_Kits/Modal/Modal";

// Regex
import { email as reg_email } from "../../../../../utils/regex";

export const InviteStartup = ({
  id,
  answers,
  creative,
  setInviteStartUpModal,
}) => {
  const [inviteSent, setInviteSent] = useState(false);
  const [urlToShare, setUrlToShare] = useState(null);
  const [email, setEmail] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [validate, setValidate] = useState(true);

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
  const onSubmit = async () => {
    let variables = {
      id: id,
      input: {
        sharedWithEmail: inputEmail?.variables?.input?.email,
        answers,
      },
    };
    setEmail(inputEmail?.variables?.input?.email);
    let update = await mutateCreativeUpdate({
      variables,
    });

    setUrlToShare(getPublicShareUrl(update?.data?.creativePut));
    setInviteSent(true);
    setValidate(true);
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
    setInputEmail("");
    setValidate(true);

    let update = await mutateCreativeUpdate({
      variables,
    });
    setInviteSent(false);
  };

  const handleInput = val => {
    const email = val;
    setInputEmail({
      variables: {
        input: {
          email,
        },
      },
    });

    let isEmailValidaion = reg_email.test(String(val).toLocaleLowerCase());
    setValidate(isEmailValidaion ? false : true);
  };

  console.log("validate", validate);
  return (
    <Modal
      title={inviteSent ? "Revoke Startup Link" : "Invite Startup"}
      submit={() => (inviteSent ? revoke() : onSubmit())}
      close={() => {
        setInviteStartUpModal(false);
      }}
      disabled={inviteSent ? false : validate}
      children={
        inviteSent ? (
          <div>{urlToShare}</div>
        ) : (
          <InputForm
            type="email"
            fullWidth={true}
            handleInputChange={value => handleInput(value)}
            name="email"
            placeholder="company@gmail.com"
            required
          />
        )
      }
      submitTxt={inviteSent ? "Revoke" : "Invite"}
      closeTxt="Cancel"
    ></Modal>
  );
};

export default InviteStartup;
