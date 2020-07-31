import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Mutation } from "@apollo/client/react/components";
import { useForm } from "react-hook-form";

import { GhostLoader } from "../../../elements/GhostLoader";
import BreadCrumbs from "../../../elements/BreadCrumbs";
import Saver from "../../../elements/Saver";
// import NameAndDescription from "./NameAndDescriptionComp";
import Question from "./QuestionComp";

import { evaluationTemplateGet } from "../../../../Apollo/Queries";
import {
  evaluationQuestionPut,
  evaluationTemplateSectionPut
} from "../../../../Apollo/Mutations";

import {
  //   dashboard,
  profile,
  evaluation_template,
  evaluation_templates
} from "../../../../routes";

import {
  // container,
  // small_container,
  // center_container,
  // inner_container,
  standard_form
} from "../../../elements/Style.module.css";

import { section_style } from "./EvaluationTemplateSection.module.css";
// import { color3 } from "../../../elements/Colors.module.css";
// import { content_tag } from "../../../../routes.module.css";
import EvaluationTemplate from "../EvaluationTemplate/EvaluationTemplate";

import {
  Card,
  Button,
  Table,
  Content,
  Modal
} from "../../../elements/NotataComponents/";

function NameAndDescription({ template, section }) {
  const [mutate] = useMutation(evaluationTemplateSectionPut);
  const { name, description, id } = section;

  const { register, handleSubmit, formState, setValue } = useForm();
  const { isSubmitting } = formState;

  useEffect(() => {
    setValue("input.name", name);
    setValue("input.description", description);
  });

  const onSubmit = async (data, event) => {
    let variables = {
      id: section.id,
      ...data
    };

    console.log("variables", JSON.stringify(variables, null, 2));

    try {
      let res = await mutate({ variables });
      console.log("res", res);
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
        placeholder='I.e. "Team"'
        name="input.name"
        ref={register}
        onBlur={handleSubmit(onSubmit)}
      />

      <textarea
        className="form_p1"
        rows={1}
        placeholder='I.e. "Section to evaluate team"'
        name="input.description"
        ref={register}
        onBlur={handleSubmit(onSubmit)}
      />
    </form>
  );
}

function NewQuestion({ templateId, sectionId }) {
  const [mutate] = useMutation(evaluationQuestionPut, {
    refetchQueries: [
      {
        query: evaluationTemplateGet,
        variables: { id: templateId }
      }
    ],
    awaitRefetchQueries: true
  });
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  async function onSubmit({ name }, event) {
    await mutate({
      variables: {
        sectionId: sectionId,
        input: {
          name,
          inputType: "CHECK"
        }
      }
    });

    event.target.reset();
  }

  return (
    <div className={section_style}>
      <form className={standard_form} onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginTop: "30px" }}>
          <input
            type="text"
            placeholder="Question name"
            ref={register({ required: true })}
            name="name"
          />
        </div>

        <div style={{ marginTop: "30px" }}>
          <input
            type="submit"
            value="Add new question"
            disabled={isSubmitting}
          />
          {isSubmitting && <i className="fa fa-spinner fa-spin" />}
        </div>
      </form>
    </div>
  );
}

export default function EvaluationTemplateSection({ match }) {
  const { id, sectionId } = match.params;
  const [getData, { data, loading, error }] = useLazyQuery(
    evaluationTemplateGet
  );

  let template = {};
  if (data) {
    template = data.evaluationTemplateGet;
  }

  useEffect(() => {
    if (id !== "new") {
      getData({ variables: { id } });
    }
  }, []);

  if (error) console.log("error", error);
  if (error) return <div>We are updating </div>;

  let section = {};
  if (sectionId) {
    section = (template.sections || []).find(s => s.id === sectionId) || {};
  }

  return (
    <Content maxWidth={1200}>
      <NameAndDescription template={template} section={section} />

      {(section.questions || []).map((question, i) => (
        <Card>
          <Question
            key={`question-${i}-${question.id}`}
            question={question || {}}
            templateId={id}
            sectionId={sectionId}
          />
        </Card>
      ))}

      <NewQuestion templateId={id} sectionId={sectionId} />
    </Content>
  );
}
