import React, { useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Content, ErrorBox, GhostLoader } from "../../elements/";
import {
  publicCreativeGet,
  publicCreativeTemplateGet,
} from "../../../Apollo/Queries";

export function PublicCreative({ match }) {
  let { id } = match.params;

  const [getCreative, creativeQuery] = useLazyQuery(publicCreativeGet);
  const creative = (creativeQuery.data || {}).publicCreativeGet;

  const [getCreativeTemplate, creativeTemplateQuery] = useLazyQuery(
    publicCreativeTemplateGet
  );
  const template = (creativeTemplateQuery.data || {}).publicCreativeTemplateGet;

  useEffect(() => {
    if (id) {
      getCreative({ variables: { id } });
      getCreativeTemplate();
    }
  }, []);

  const error = creativeQuery.error || creativeTemplateQuery.error;
  const loading = creativeQuery.loading || creativeTemplateQuery.loading;

  if (error) {
    return (
      <Content maxWidth={600} center>
        <ErrorBox>Form not found...</ErrorBox>
      </Content>
    );
  }

  if (!loading && creative && template) {
    return (
      <Content maxWidth={600}>
        <h1>{creative.name}</h1>
        <pre>{JSON.stringify(creative, null, 2)}</pre>

        <pre>{JSON.stringify(template, null, 2)}</pre>
      </Content>
    );
  }

  return <GhostLoader />;
}
