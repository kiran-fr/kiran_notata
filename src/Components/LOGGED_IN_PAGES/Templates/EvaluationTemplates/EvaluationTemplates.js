import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import classnames from "classnames";
import { useForm } from "react-hook-form";

import BreadCrumbs from "../../../elements/BreadCrumbs";

import {
  Card,
  Button,
  Table,
  Content
} from "../../../elements/NotataComponents/";

import { standard_form } from "../../../elements/Style.module.css";

import { delete_bucket } from "./EvaluationTemplates.module.css";

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

const CreateNewTemplate = () => {
  const [mutate] = useMutation(evaluationTemplatePut, {
    refetchQueries: [{ query: accountGet }],
    awaitRefetchQueries: true
  });

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    try {
      await mutate(data);
      event.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className={standard_form} onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder={`I.e. "Early Stage Companies"`}
          ref={register({ required: true })}
          name="variables.input.name"
        />
      </div>

      <div style={{ marginTop: "30px" }}>
        <input type="submit" value="Create new template" />
        {isSubmitting && <i className="fa fa-spinner fa-spin" />}
      </div>
    </form>
  );
};

function Delete({ id, templates }) {
  const [mutate, { loading }] = useMutation(evaluationTemplateDelete, {
    refetchQueries: [{ query: accountGet }],
    awaitRefetchQueries: true
  });

  let template = (templates || []).find(t => t.id === id);

  return (
    <div
      onClick={() => {
        if (loading) return;
        if (template && template.sections && template.sections.length) {
          return window.alert(
            "You have to delete all the section before you can delete the template"
          );
        }
        let variables = { id };
        mutate({ variables });
      }}
    >
      {(loading && <i className="fa fa-spinner fa-spin" />) || (
        <i className="fal fa-trash-alt" />
      )}
    </div>
  );
}

export default function EvaluationTemplates() {
  const { data, loading, error } = useQuery(accountGet);
  if (error) return <div>We are updating </div>;

  let templates;
  if (data) {
    let { evaluationTemplates } = data.accountGet;
    templates = evaluationTemplates;
  }

  const columns = [
    {
      title: "",
      dataIndex: "id",
      key: "delete",
      width: 20,
      className: delete_bucket,
      render: id => <Delete id={id} templates={templates} />
    },

    {
      title: "Template name",
      dataIndex: "id",
      key: "name",
      render: id => {
        let template = templates.find(t => t.id === id) || {};
        let { name, sections } = template;
        return (
          <span>
            <span>{name} </span>
            <span style={{ opacity: 0.5 }}>
              ({(sections || []).length} sections)
            </span>
          </span>
        );
      }
    },

    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: 30,
      render: id => <Button type="tiny_right" />
    }
  ];

  return (
    <Content maxWidth={1200}>
      <h1>Evaluation templates</h1>

      <Card>
        <Table
          dataSource={templates || []}
          columns={columns}
          pagination={false}
          loading={loading}
          // diableHead
        />
      </Card>

      <CreateNewTemplate />
    </Content>
  );
}
