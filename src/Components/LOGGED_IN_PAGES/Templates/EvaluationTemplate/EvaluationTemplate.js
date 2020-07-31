import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

import { GhostLoader } from "../../../elements/GhostLoader";
import BigButton from "../../../elements/BigButton";
import BreadCrumbs from "../../../elements/BreadCrumbs";
import TextAreaAutoHeight from "../../../elements/TextAreaAutoHeight";
// import Saver from "../../../elements/Saver";

import { evaluationTemplateGet } from "../../../../Apollo/Queries";
import {
  evaluationTemplatePut,
  evaluationTemplateSectionPut,
  evaluationTemplateSectionDelete
} from "../../../../Apollo/Mutations";
import {
  profile,
  evaluation_template,
  evaluation_templates
} from "../../../../routes";

import {
  Card,
  Button,
  Table,
  Content,
  Modal
} from "../../../elements/NotataComponents/";

import { delete_bucket, delete_option } from "./EvaluationTemplate.module.css";

function NameAndDescription({ template }) {
  const [mutate] = useMutation(evaluationTemplatePut);
  const { name, description, id } = template;

  const { register, handleSubmit, formState, setValue } = useForm();
  const { isSubmitting } = formState;

  useEffect(() => {
    setValue("input.name", name);
    setValue("input.description", description);
  });

  const onSubmit = async (data, event) => {
    let variables = {
      id: template.id,
      ...data
    };
    try {
      let res = await mutate({
        variables,
        optimisticResponse: {
          __typename: "Mutation",
          evaluationTemplatePut: {
            ...template,
            ...data.input
          }
        }
      });
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
        placeholder='I.e. "Early stage evaluations"'
        name="input.name"
        ref={register}
        onBlur={handleSubmit(onSubmit)}
      />

      <textarea
        className="form_p1"
        rows={1}
        placeholder='I.e. "Template for evaluating early stage startups"'
        name="input.description"
        ref={register}
        onBlur={handleSubmit(onSubmit)}
      />
    </form>
  );
}

function AddNewSection({ id, setDone }) {
  const [mutate] = useMutation(evaluationTemplateSectionPut);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  async function onSubmit(name, event) {
    try {
      let res = await mutate({
        variables: {
          templateId: id,
          input: name
        }
      });
      let item = res.data.evaluationTemplateSectionPut;
      setDone(item.id);
      // event.target.reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder='I.e. "Team"'
          autoComplete="off"
          ref={register({ required: true })}
          name="name"
        />
      </div>

      <div
        style={{
          marginTop: "5px",
          textAlign: "right"
        }}
      >
        <Button type="input" value="OK" loading={isSubmitting} />
      </div>
    </form>
  );
}

function Delete({ sectionId, template }) {
  const [mutate, { loading }] = useMutation(evaluationTemplateSectionDelete, {
    refetchQueries: [
      { query: evaluationTemplateGet, variables: { id: template.id } }
    ],
    awaitRefetchQueries: true
  });

  let section = (template.sections || []).find(s => s.id === sectionId);

  return (
    <div
      onClick={() => {
        if (loading) return;
        if (section.questions.length) {
          return window.alert(
            "You have to delete all the questions in a section before you can delete the section"
          );
        }

        let variables = { id: sectionId };
        mutate({ variables });
      }}
    >
      {(loading && <i className="fa fa-spinner fa-spin" />) || (
        <i className="fal fa-trash-alt" />
      )}
    </div>
  );
}

export default function EvaluationTemplate({ match, history }) {
  const [showModal, setShowModal] = useState(false);

  const id = match.params.id;
  const [getData, { data, loading, error }] = useLazyQuery(
    evaluationTemplateGet
  );

  let template = {};
  if (data) {
    template = data.evaluationTemplateGet;
  }

  useEffect(() => {
    if (id && id !== "new") {
      getData({ variables: { id } });
    }
  }, []);

  if (error) return <div>We are updating </div>;

  const columns = [
    {
      title: "",
      dataIndex: "id",
      key: "delete",
      width: 20,
      className: delete_bucket,
      render: sectionId => <Delete sectionId={sectionId} template={template} />
    },

    {
      title: "Section name",
      dataIndex: "name",
      key: "name",
      render: name => <span>{name}</span>
    },

    {
      title: "",
      dataIndex: "id",
      key: "section_button",
      width: 30,
      render: sectionId => {
        return (
          <Button
            type="tiny_right"
            onClick={() => {
              let path = `${evaluation_template}/${id}/${sectionId}`;
              history.push(path);
            }}
          />
        );
      }
    }
  ];

  return (
    <Content maxWidth={1200}>
      <NameAndDescription template={template} />

      <Card style={{ paddingTop: "5px" }}>
        <Table
          dataSource={template.sections || []}
          columns={columns}
          pagination={false}
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
          Create New Section
        </Button>
      </div>

      {showModal && (
        <Modal
          title="New Evaluation Template"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <AddNewSection
            id={id}
            //setDone={() => setShowModal(false)}
            setDone={sectionId => {
              let path = `${evaluation_template}/${id}/${sectionId}`;
              history.push(path);
            }}
          />
        </Modal>
      )}
    </Content>
  );
}
