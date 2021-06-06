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

    if (urlToShare === null) {
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
    setUrlToShare(null);
    setInputEmail("");
    setEmailValue("");
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
      submit={() => (inviteSent ? revoke() : onSubmit())}
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
            <span className={styles.copy}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.28906 12H2.8125C1.77859 12 0.9375 11.1589 0.9375 10.125V3.77344C0.9375 2.73953 1.77859 1.89844 2.8125 1.89844H7.28906C8.32297 1.89844 9.16406 2.73953 9.16406 3.77344V10.125C9.16406 11.1589 8.32297 12 7.28906 12ZM2.8125 2.83594C2.29559 2.83594 1.875 3.25653 1.875 3.77344V10.125C1.875 10.6419 2.29559 11.0625 2.8125 11.0625H7.28906C7.80597 11.0625 8.22656 10.6419 8.22656 10.125V3.77344C8.22656 3.25653 7.80597 2.83594 7.28906 2.83594H2.8125ZM11.0391 8.95312V1.875C11.0391 0.841095 10.198 0 9.16406 0H3.96094C3.70203 0 3.49219 0.209839 3.49219 0.46875C3.49219 0.727661 3.70203 0.9375 3.96094 0.9375H9.16406C9.68097 0.9375 10.1016 1.35809 10.1016 1.875V8.95312C10.1016 9.21204 10.3114 9.42188 10.5703 9.42188C10.8292 9.42188 11.0391 9.21204 11.0391 8.95312Z"
                  fill="#53CAB2"
                />
              </svg>
              COPY CODE
            </span>
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
