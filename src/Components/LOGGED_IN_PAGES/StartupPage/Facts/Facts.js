import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
// import {
// } from "./Facts.module.css";
import validateEmail from "../../../../utils/validateEmail";
import classnames from "classnames";
import { creativeGet, creativeTemplateGet } from "../../../../Apollo/Queries";
import { creativePut } from "../../../../Apollo/Mutations";

import {
  Content,
  Card,
  BreadCrumbs,
  Modal,
  Button,
  SuccessBox,
} from "../../../elements/";

import { dashboard, startup_page } from "../../../../routes";

import { share_title, share_text, copy_link } from "./Facts.module.css";

function Section({ section }) {
  const { name, description } = section;
  return (
    <div>
      <div
        style={{
          marginTop: "30px",
          fontSize: "28px",
          position: "relative",
          bottom: "-8px",
          color: "var(--color-secondary)",
        }}
      >
        {name}
      </div>
      <div>{description}</div>
      {(section.questions || []).map((question, i) => (
        <Question key={`q-${i}`} question={question} section={section} />
      ))}
    </div>
  );
}

function CommentSection({ question, section }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    console.log("data", data);
  };

  return (
    <div
      className="comment_form"
      // className="notata_form"
      style={{
        // marginTop: "-10px",
        padding: "15px",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          placeholder="Write a comment..."
          rows="3"
          name="val"
          ref={register}
          style={{ resize: "none" }}
        />
      </form>
    </div>
  );
}

function Question({ question, section }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;
  const { name, description, inputType, options } = question;

  const onSubmit = async (data, event) => {
    console.log("data", data);
  };

  return (
    <Card style={{ marginBottom: "10px" }}>
      <div className="form_h2">{name}</div>
      <div className="form_p2">{description}</div>
      <hr />

      <div style={{ padding: "10px" }}>
        <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
          {inputType === "CHECK" &&
            options.map((option, i) => (
              <div className="check_container" key={`o-${i}`}>
                <label>
                  <input type="checkbox" ref={register} name="option.val" />
                  {option.val}
                </label>
              </div>
            ))}

          {inputType === "RADIO" &&
            options.map((option, i) => (
              <div className="check_container" key={`o-${i}`}>
                <label>
                  <input type="radio" ref={register} name="option.val" />
                  {option.val}
                </label>
              </div>
            ))}

          {inputType === "INPUT_TEXT" && (
            <textarea
              ref={register}
              name="option.val"
              placeholder={options[0].val}
              style={{
                resize: "none",
                height: "150px",
              }}
            />
          )}

          {inputType === "INPUT_MUTLIPLE_LINES" &&
            options.map((option, i) => (
              <div key={`o-${i}`}>
                {
                  // <label>{option.val}</label>
                }
                <input
                  type="text"
                  ref={register}
                  name="option.val"
                  placeholder={option.val}
                />
              </div>
            ))}
        </form>
      </div>

      <CommentSection question={question} section={section} />
    </Card>
  );
}

function InviteStartup({ creative, mutate, loading }) {
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const { register, handleSubmit, formState, setValue } = useForm();
  const { isSubmitting } = formState;

  useEffect(() => {
    creative.sharedWithEmail && setValue("email", creative.sharedWithEmail);
  }, []);

  const shareUrl = `${window.location.protocol}//${window.location.host}/public/creative/${creative.id}&email=${creative.sharedWithEmail}`;

  const onSubmit = async (data, event) => {
    let email = data.email.toLowerCase().trim();
    if (!validateEmail(email)) return;

    try {
      let variables = {
        id: creative.id,
        input: { sharedWithEmail: data.email },
      };
      await mutate({ variables });
    } catch (error) {
      console.log("error");
    }

    setShowModal(false);
  };

  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
  }

  return (
    <>
      <Card style={{ paddingBottom: "20px" }}>
        {creative.sharedWithEmail && (
          <div>
            <div className={share_title}>This form can now be shared</div>

            <div className={share_text}>
              You can now share this form with{" "}
              <b style={{ color: "var(--color-primary)" }}>
                {creative.sharedWithEmail}
              </b>
              . No email has been sent from Notata, so you will have to copy the
              link and send it by email.
            </div>

            <SuccessBox
              style={{
                padding: "5px",
                fontSize: "12px",
                color: "var(--color-secondary)",
              }}
            >
              {shareUrl}
            </SuccessBox>

            <div className={copy_link} onClick={copyToClipboard}>
              {copySuccess ? "link copied to clipboard" : "copy link"}
            </div>

            <div
              style={{
                marginTop: "5px",
                textAlign: "right",
              }}
            >
              <Button
                type="right_arrow"
                loading={loading}
                onClick={async () => {
                  try {
                    let variables = {
                      id: creative.id,
                      input: { removeSharing: true },
                    };
                    let res = await mutate({ variables });
                    setCopySuccess(false);
                  } catch (error) {
                    console.log("error");
                  }
                }}
              >
                Revoke access
              </Button>
            </div>
          </div>
        )}

        {!creative.sharedWithEmail && (
          <div>
            <div className={share_title}>
              Invite startup to fill in this information.
            </div>
            <div className={share_text}>
              By inviting a startup to fill in this information you will
              generate a link that you can share with the startup. The startup
              will then have access to this form, and will be able to see all
              pre filled inforation you may have provided.
            </div>

            <div
              style={{
                marginTop: "5px",
                textAlign: "right",
              }}
            >
              <Button type="right_arrow" onClick={() => setShowModal(true)}>
                Invite startup
              </Button>
            </div>
          </div>
        )}
      </Card>
      {showModal && (
        <Modal
          title="Invite startup"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginTop: "30px" }}>
              <input
                type="text"
                placeholder={"name@email.com"}
                autoComplete="off"
                ref={register({ required: true })}
                name="email"
              />

              <div
                style={{
                  marginTop: "5px",
                  textAlign: "right",
                }}
              >
                <Button type="input" value="OK" loading={isSubmitting} />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default function Facts({ history, match }) {
  const { id: connectionId, creativeId } = match.params;
  const [getData, { data, loading, error }] = useLazyQuery(creativeGet);
  const creative = (data || []).creativeGet || {};

  const creativeTemplateQuery = useQuery(creativeTemplateGet);
  const creativeTemplate =
    (creativeTemplateQuery.data || {}).creativeTemplateGet || {};

  const [mutate, { loading: mutationLoading }] = useMutation(creativePut);

  useEffect(() => {
    creativeId && getData({ variables: { id: creativeId } });
  }, []);

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "Dashboard",
            link: `${dashboard}`,
          },
          {
            val: `Startup: ${creative.name}`,
            link: `${startup_page}/${connectionId}`,
          },
          {
            val: `Facts`,
            link: `${startup_page}/${connectionId}/creative/${creative.id}`,
          },
        ]}
      />
      <Content maxWidth={600}>
        <h1>{creative.name}</h1>

        <InviteStartup
          creative={creative}
          mutate={mutate}
          loading={mutationLoading}
        />

        {(creativeTemplate.sections || []).map((section, i) => (
          <Section key={`section-${i}`} section={section} />
        ))}
      </Content>
    </>
  );
}
