import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import classnames from "classnames";
import { useForm } from "react-hook-form";

import {
  Card,
  Button,
  Table,
  Content,
  Modal,
  BreadCrumbs,
} from "../../../elements/";

import { delete_bucket } from "./EvaluationTemplates.module.css";
import { accountGet } from "../../../../Apollo/Queries";

import {
  evaluationTemplatePut,
  evaluationTemplateDelete,
} from "../../../../Apollo/Mutations";

import {
  profile,
  evaluation_template,
  evaluation_templates,
} from "../../../../routes";

function Delete({ id, templates }) {
  const [mutate, { loading }] = useMutation(evaluationTemplateDelete, {
    refetchQueries: [{ query: accountGet }],
    awaitRefetchQueries: true,
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

const CreateNewTemplate = ({ setDone }) => {
  const [mutate] = useMutation(evaluationTemplatePut);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    try {
      let res = await mutate(data);
      let item = res.data.evaluationTemplatePut;
      setDone(item.id);
      event.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder={`I.e. "Early Stage Companies"`}
          autoComplete="off"
          ref={register({ required: true })}
          name="variables.input.name"
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
  );
};

export default function EvaluationTemplates(props) {
  const [showModal, setShowModal] = useState(false);

  const { data, loading, error } = useQuery(accountGet);

  // console.log('{ data, loading, error }', { data, loading, error })

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
      render: id => <Delete id={id} templates={templates} />,
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
            <div>{name}</div>
            <div style={{ opacity: 0.5, fontSize: "12px" }}>
              {(sections || []).length} sections
            </div>
          </span>
        );
      },
    },

    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: 30,
      render: id => (
        <Button
          type="tiny_right"
          onClick={() => {
            let path = `${evaluation_template}/${id}`;
            props.history.push(path);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "all templates",
            link: `${evaluation_templates}`,
          },
        ]}
      />
      <Content maxWidth={600}>
        <h1>Evaluation templates</h1>

        <Card style={{ paddingTop: "5px" }}>
          <Table
            dataSource={templates || []}
            columns={columns}
            loading={loading.toString()}
            diableHead={true}
          />
        </Card>

        <div style={{ marginTop: "20px" }}>
          <Button
            onClick={() => setShowModal(true)}
            type="right_arrow"
            size="large"
          >
            New Evaluation Template
          </Button>
        </div>

        {showModal && (
          <Modal
            title="New Evaluation Template"
            close={() => setShowModal(false)}
            disableFoot={true}
          >
            <CreateNewTemplate
              setDone={id => {
                let path = `${evaluation_template}/${id}`;
                props.history.push(path);
              }}
            />
          </Modal>
        )}
      </Content>
    </>
  );
}
