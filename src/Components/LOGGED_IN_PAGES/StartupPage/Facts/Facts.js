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

import { GeneralInput } from "./Inputs/GeneralInput";
import { CommentSection } from "./CommentSection";

function Section({ section, creative }) {
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
        <Question
          key={`q-${i}`}
          question={question}
          section={section}
          creative={creative}
        />
      ))}
    </div>
  );
}

function Question({ question, section, creative }) {
  return (
    <Card style={{ marginBottom: "10px", paddingBottom: "15px" }}>
      <div className="form_h2">{question.name}</div>
      <div className="form_p2">{question.description}</div>
      <hr />
      <div style={{ padding: "10px" }}>
        <GeneralInput
          question={question}
          section={section}
          creative={creative}
        />
      </div>
      <CommentSection
        question={question}
        section={section}
        creative={creative}
      />
    </Card>
  );
}

function InviteStartup({ creative, connectionId, mutate, loading }) {
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
        input: { sharedWithEmail: data.email, connectionId },
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
                      input: { removeSharing: true, connectionId },
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

function CompanyName({ creative, name }) {
  const [mutate, { loading }] = useMutation(creativePut);
  const { register, handleSubmit, formState, setValue } = useForm();
  const { isSubmitting } = formState;

  useEffect(() => {
    name && setValue("input.name", name);
  }, [name]);

  const onSubmit = async (data, event) => {
    let variables = { id: creative.id, ...data };
    try {
      await mutate({ variables });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="focus_form"
      onSubmit={handleSubmit(onSubmit)}
      style={{ marginBottom: "20px" }}
    >
      <textarea
        className="form_h1"
        rows={1}
        placeholder="Company name"
        name="input.name"
        defaultValue={name}
        ref={register}
        onBlur={handleSubmit(onSubmit)}
      />
    </form>
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
        <CompanyName creative={creative} name={creative.name} />

        <InviteStartup
          connectionId={connectionId}
          creative={creative}
          mutate={mutate}
          loading={mutationLoading}
        />

        {(creativeTemplate.sections || []).map((section, i) => (
          <Section key={`section-${i}`} section={section} creative={creative} />
        ))}
      </Content>
    </>
  );
}
