import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import classnames from "classnames";

import { GhostLoader } from "../../../elements/GhostLoader";
import BreadCrumbs from "../../../elements/BreadCrumbs";

import { content_tag } from "../../../../routes.module.css";
import {
  container,
  small_container,
  inner_container,
  standard_form,
  shady_list,
  shady_list_item,
  shady_list_name,
  shady_list_open_close
} from "../../../elements/Style.module.css";

import { accountGet } from "../../../../Apollo/Queries";
import {
  evaluationTemplatePut,
  evaluationTemplateDelete
} from "../../../../Apollo/Mutations";

import {
  profile,
  evaluation_template,
  evaluation_templates
} from "../../../../routes";

function CreateNewTemplate({ accountRefetch }) {
  const [name, setName] = useState();
  const [description] = useState();
  const [mutate, { loading }] = useMutation(evaluationTemplatePut, {
    refetchQueries: [{ query: accountGet }]
  });

  return (
    <form
      className={standard_form}
      onSubmit={e => {
        e.preventDefault();

        let variables = {
          input: {
            name: name,
            description: description
          }
        };

        mutate({
          variables
        });
        setName("");
      }}
    >
      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder='I.e. "Early Stage Companies"'
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "30px" }}>
        <input type="submit" value="Create new template" />
        {loading && <i className="fa fa-spinner fa-spin" />}
      </div>
    </form>
  );
}

function Delete({ template, accountRefetch }) {
  const [mutate, { loading }] = useMutation(evaluationTemplateDelete, {
    refetchQueries: ["accountGet"]
  });

  return (
    <div
      style={{
        position: "absolute",
        right: "18px",
        top: "14px",
        color: "rgb(200, 0, 0)",
        cursor: "pointer",
        fontSize: "18px"
      }}
      onClick={() => {
        if (loading) return;
        if (template.sections && template.sections.length) {
          return window.alert(
            "You have to delete all the section before you can delete the template"
          );
        }
        let variables = {
          id: template.id
        };
        mutate({
          variables
        });
      }}
    >
      {(loading && <i className="fa fa-spinner fa-spin" />) || (
        <i className="fal fa-trash-alt" />
      )}
    </div>
  );
}

export default function EvaluationTemplates() {
  const { data, loading, error } = useQuery(accountGet, {
    notifyOnNetworkStatusChange: true
  });

  if (loading) return <GhostLoader />;
  if (error) return <div>We are updating </div>;

  const { evaluationTemplates: templates } = data.accountGet;

  return (
    <div className={content_tag}>
      <BreadCrumbs
        list={[
          {
            val: "profile",
            link: profile
          },
          {
            val: "all templates",
            link: `${evaluation_templates}`
          }
        ]}
      />
      <div className={classnames(container, small_container)}>
        <div className={inner_container}>
          <h1>Templates</h1>

          <div className={shady_list}>
            {templates.map(template => (
              <div
                key={`${template.id}`}
                className={shady_list_item}
                style={{ paddingTop: "10px" }}
              >
                <div className={shady_list_name}>
                  <div className={shady_list_open_close}>
                    <i className="fas fa-caret-right" />
                  </div>

                  <Link to={`${evaluation_template}/${template.id}`}>
                    {template.name} - ({template.sections.length} sections)
                  </Link>
                  <Delete template={template} />
                </div>
              </div>
            ))}
          </div>
          <CreateNewTemplate />
        </div>
      </div>
    </div>
  );
}
