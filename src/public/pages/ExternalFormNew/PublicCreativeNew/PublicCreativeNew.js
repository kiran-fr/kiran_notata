import React, { useEffect, useState } from "react";

// API STUFF
import { useMutation, useLazyQuery } from "@apollo/client";
import { creativeGet, creativeTemplateGet } from "public/Apollo/Queries";
import { creativePut } from "public/Apollo/Mutations";

import { GhostLoader } from "Components/elements";
import "./PublicCreativeNew.scss";

import EditStartupContent from "../../../../private/NewDesign/StartupPage/TabPages/StartupInfo/subPages/EditStartupContent";
import MessageBox from "./MessageBox";

let defaultCreative = {
  id: null,
  name: "",
  description: "External Form",
  templateId: "",
  sharedWithEmail: null,
  sharedByEmail: null,
  submit: false,
  answers: [],
};

export function PublicCreativeNew({ match }) {
  // URL STUFF
  let { id, accountId } = match.params;

  // STATES
  const [success, setSuccess] = useState(false);

  // QUERIES
  const queryOptions = { context: { clientName: "public" } };
  const [getCreative, getCreativeRes] = useLazyQuery(creativeGet, queryOptions);
  const [getTemplate, getTemplateRes] = useLazyQuery(
    creativeTemplateGet,
    queryOptions
  );

  // MUTATIONS
  const [mutate] = useMutation(creativePut, {
    context: { clientName: "public" },
  });

  // MAPS AND REDUCERS
  let creative = getCreativeRes.data?.creativeGet;
  let template = getTemplateRes?.data?.creativeTemplateGet;

  // EFFECTS

  // Get template
  useEffect(() => {
    if (!accountId) {
      return;
    }
    let variables = { id: accountId };
    getTemplate({ variables });
  }, [accountId]);

  // Get creative
  useEffect(() => {
    if (!id) {
      return;
    }
    let [creativeId] = id.split("&");
    let variables = { id: creativeId };
    getCreative({ variables });
  }, [id]);

  const error =
    getCreativeRes.error ||
    getTemplateRes.error ||
    (!getCreativeRes?.data?.creativeGet && !getCreativeRes.loading);

  const loading = getCreativeRes.loading || getTemplateRes.loading;

  const gotAllData = getCreativeRes.data && getTemplateRes.data;

  if (!gotAllData && loading) {
    return <GhostLoader />;
  }

  if (!template) {
    return <GhostLoader />;
  }

  if (!creative) {
    creative = defaultCreative;
  }

  if (error && !id) {
    return (
      <MessageBox
        title={"Form not found"}
        message={
          "It seems like this form doesn't exist, or that the person that shared it with you have revoked sharing privileges."
        }
      />
    );
  }

  if (success) {
    return (
      <MessageBox
        title={"Form successfully saved"}
        message={
          creative.id
            ? template.successMessageInvited || ""
            : template.successMessageWebForm || ""
        }
      />
    );
  }

  return (
    <div className="row tab-panel-container public-creative-container">
      <div className="col-sm-12 public-creative-container__content">
        <div className="col-sm-12 public-creative-container__content__header">
          {creative.id
            ? template.headerMessageInvited || ""
            : template.headerMessageWebForm || ""}
        </div>

        <div className="card col-sm-12">
          <EditStartupContent
            template={template}
            creative={creative}
            saveCreative={async input => {
              let variables = {
                accountId: accountId,
                input,
              };

              if (creative.id) {
                variables.id = creative.id;
              }

              try {
                await mutate({ variables });
                if (creative.id && (input.removeLogo || input.logo)) {
                  return;
                }
                setSuccess(true);
              } catch (error) {
                console.log("error", error);
              }
            }}
            disableNavigation={true}
          />
        </div>
      </div>
    </div>
  );
}
