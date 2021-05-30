import React, { useState, useEffect } from "react";

// API STUFF
import { creativeUpdate } from "private/Apollo/Mutations";
import { InputForm } from "Components/UI_Kits/InputForm/InputForm";
import { useMutation } from "@apollo/client";
import { Modal } from "../../../../../Components/UI_Kits/Modal/Modal";
import { Button } from "Components/UI_Kits/Buttons/Buttons";

import styles from "./InviteStartup.module.css";

// Regex
import { email as reg_email } from "../../../../../utils/regex";

export const InviteStartup = ({
  connection,
  id,
  answers,
  creative,
  setInviteStartUpModal,
}) => {
  const [inviteSent, setInviteSent] = useState(false);
  const [urlToShare, setUrlToShare] = useState(null);
  const [emailValue, setEmailValue] = useState("");
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
    let update = await mutateCreativeUpdate({
      variables,
    });

    if(urlToShare === null) {
      setUrlToShare(getPublicShareUrl(update?.data?.creativeUpdate));
      setInviteSent(true);
      setValidate(true);
      setEmailValue(inputEmail?.variables?.input?.email);
    }
  };

  // Submit function with mutations
  const revoke = async () => {
    let variables = {
      id: id,
      input: {
        sharedWithEmail: emailValue,
        removeSharing: true,
        answers,
      },
    };

    let update = await mutateCreativeUpdate({
      variables,
    });
    setInviteSent(false);
    setUrlToShare(null)
    setInputEmail("");
    setEmailValue("")
    setValidate(true);
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

  return (
    <Modal
      title={inviteSent ? "Revoke Startup Link" : "Invite Startup"}
      submit={() =>
        inviteSent
          ? revoke()
          : onSubmit()
      }
      close={() => {
        setInviteStartUpModal(false);
      }}
      disabled={inviteSent ? false : validate}
      children={
        inviteSent ? (
          <>
            <div className={styles.email}>
              <p>
                You can now share this form with {creative?.sharedWithEmail}. No
                email has been sent from Notata, so you will have to copy the
                link and send it by email.
              </p>
            </div>
            <div className={styles.revokeURL}>
              <a href={urlToShare}>{urlToShare}</a>
            </div>
          </>
        ) : (
          <>
            <p className={styles.inviteText}>
              The startup will then have access to this form, and will be able
              to see all pre filled inforation you may have provided.
            </p>
            {emailValue ? (
              <div className={styles.email}>
                <h4>Email</h4>
                <div>
                  <p>{emailValue}</p>
                </div>
              </div>
            ) : (
              <InputForm
                type="email"
                fullWidth={true}
                handleInputChange={value => handleInput(value)}
                name="email"
                placeholder="company@domain.com"
                required
              />
            )}
          </>
        )
      }
      submitTxt={inviteSent ? "Revoke" : emailValue === "" ? "Okay" : ""}
      closeTxt={emailValue !== "" ? "" : "Cancel"}
    ></Modal>
  );
};

export default InviteStartup;
