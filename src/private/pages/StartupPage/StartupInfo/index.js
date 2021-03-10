import React, { useEffect } from "react";

// API: apollo
import { useLazyQuery, useQuery } from "@apollo/client";

// API: queries
import { creativeGet, creativeTemplateGet } from "private/Apollo/Queries";

// Router: definitions
import { dashboard, startup_page, facts_templates } from "definitions.js";

// Components: general
import { Content, BreadCrumbs, Button, GhostLoader } from "Components/elements";

// Components: unique
import NameInput from "./NameInput";
import InviteStartup from "./InviteStartup";

import InfoForm from "./InfoForm";

// *****************
// * Main function *
// *****************

export default function StartupInfo({ history, match }) {
  // Get url params
  const { id: connectionId, creativeId } = match.params;

  // Queries
  const [
    getData,
    { data: creativeData, loading: creativeLoading },
  ] = useLazyQuery(creativeGet);

  const { data: templateData, loading: templateLoading } = useQuery(
    creativeTemplateGet
  );

  // Definitions
  const creative = creativeData?.creativeGet || {};
  const creativeTemplate = templateData?.creativeTemplateGet || {};

  // Execute query
  useEffect(() => {
    if (creativeId) {
      getData({
        variables: {
          id: creativeId,
        },
      });
    }
  }, [creativeId]);

  // Return loader if queries are loading
  if (creativeLoading || templateLoading) {
    return <GhostLoader />;
  }

  // ===========
  // Return page
  // ===========
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
            val: `Startup Info`,
            link: `${startup_page}/${connectionId}/creative/${creative.id}`,
          },
        ]}
      />

      <Content maxWidth={600}>
        <NameInput creativeId={creative.id} name={creative.name} />

        <InviteStartup connectionId={connectionId} creative={creative} />

        <InfoForm
          connectionId={connectionId}
          creative={creative}
          creativeTemplate={creativeTemplate}
        />

        {/* Link to edit template */}
        <div style={{ textAlign: "right", marginTop: "35px" }}>
          <Button
            type={"just_text"}
            onClick={() => {
              history.push(facts_templates);
            }}
          >
            edit form template
          </Button>
        </div>
      </Content>
    </>
  );
}
