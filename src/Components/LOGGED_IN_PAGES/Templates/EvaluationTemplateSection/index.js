import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Mutation } from "@apollo/client/react/components";
import { useForm } from "react-hook-form";

import { GhostLoader } from "../../../elements/GhostLoader";

import Saver from "../../../elements/Saver";
import Question from "./QuestionComp";

import { evaluationTemplateGet } from "../../../../Apollo/Queries";
import {
  evaluationQuestionPut,
  evaluationTemplateSectionPut,
} from "../../../../Apollo/Mutations";

import {
  profile,
  evaluation_template,
  evaluation_templates,
} from "../../../../routes";

import { standard_form } from "../../../elements/Style.module.css";

import { section_style } from "./EvaluationTemplateSection.module.css";
import EvaluationTemplate from "../EvaluationTemplate/EvaluationTemplate";

import {
  Card,
  Button,
  Table,
  Content,
  Modal,
  BreadCrumbs,
} from "../../../elements/NotataComponents/";

function NameAndDescription({ template, section }) {
  const [mutate] = useMutation(evaluationTemplateSectionPut);
  const { register, handleSubmit, formState, setValue } = useForm();
  const { isSubmitting } = formState;

  const { name, description, id } = section;
  useEffect(() => {
    setValue("input.name", name);
    setValue("input.description", description);
  });

  const onSubmit = async (data, event) => {
    let variables = {
      id: section.id,
      ...data,
    };

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

function NewQuestion({ sectionId, templateId }) {
  const [loading, setLoading] = useState(false);
  const [mutate] = useMutation(evaluationQuestionPut);

  return (
    <Button
      onClick={async () => {
        if (loading) return;
        setLoading(true);

        let variables = {
          sectionId: sectionId,
          input: {
            name: "New question",
            inputType: "CHECK",
          },
        };

        try {
          await mutate({
            variables,
            refetchQueries: [
              {
                query: evaluationTemplateGet,
                variables: { id: templateId },
              },
            ],
          });
        } catch (error) {
          console.log("error", error);
        }

        setLoading(false);
      }}
      type="right_arrow"
      loading={loading}
      size="large"
    >
      New question
    </Button>
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
    <>
      <BreadCrumbs
        list={[
          {
            val: "all templates",
            link: `${evaluation_templates}`,
          },
          {
            val: `Template: ${template.name}`,
            link: `${evaluation_template}/${id}`,
          },
          {
            val: `Section: ${section.name}`,
            link: `${evaluation_template}/${id}/${sectionId}`,
          },
        ]}
      />
      <Content maxWidth={600}>
        <NameAndDescription template={template} section={section} />

        {(section.questions || []).map((question, i) => (
          <Card key={`question-${i}-${question.id}`}>
            <Question
              question={question || {}}
              templateId={id}
              sectionId={sectionId}
            />
          </Card>
        ))}

        <NewQuestion sectionId={sectionId} templateId={id} />
      </Content>
    </>
  );
}
