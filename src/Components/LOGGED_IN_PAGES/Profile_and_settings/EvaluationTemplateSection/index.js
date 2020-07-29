import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Mutation } from "@apollo/client/react/components";
import { useForm } from "react-hook-form";

import { GhostLoader } from "../../../elements/GhostLoader";
import BreadCrumbs from "../../../elements/BreadCrumbs";
import Saver from "../../../elements/Saver";
import NameAndDescription from "./NameAndDescriptionComp";
import Question from "./QuestionComp";

import { evaluationTemplateGet } from "../../../../Apollo/Queries";
import { evaluationQuestionPut } from "../../../../Apollo/Mutations";

import {
  //   dashboard,
  profile,
  evaluation_template,
  evaluation_templates
} from "../../../../routes";
import {
  container,
  small_container,
  center_container,
  inner_container,
  standard_form
} from "../../../elements/Style.module.css";
import { section_style } from "./EvaluationTemplateSection.module.css";
import { color3 } from "../../../elements/Colors.module.css";
import { content_tag } from "../../../../routes.module.css";
import EvaluationTemplate from "../EvaluationTemplate/EvaluationTemplate";

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

  useEffect(() => {
    if (id !== "new") {
      getData({ variables: { id } });
    }
  }, []);

  if (error) console.log("error", error);
  if (loading) return <GhostLoader />;
  if (error) return <div>We are updating </div>;

  if (!data) {
    return <div>no data</div>;
  }

  let section = {};
  if (sectionId) {
    section = (data.evaluationTemplateGet.sections || []).find(
      s => s.id === sectionId
    );
  }

  return (
    <div className={content_tag}>
      <Saver />

      <BreadCrumbs
        list={[
          {
            val: "profile",
            link: profile
          },
          {
            val: "all templates",
            link: `${evaluation_templates}`
          },
          {
            val: "template overview",
            link: `${evaluation_template}/${id}`
          },
          {
            val: "template section",
            link: `${evaluation_template}/${id}/${sectionId}`
          }
        ]}
      />

      <div
        className={classnames(container, small_container)}
        style={{ maxWidth: "650px" }}
      >
        <div className={inner_container}>
          <NameAndDescription
            template={data.evaluationTemplateGet}
            section={section || {}}
            id={id}
            sectionId={sectionId}
          />

          {(section.questions || []).map((question, i) => (
            <Question
              key={`question-${i}-${question.id}`}
              question={question || {}}
              templateId={id}
              sectionId={sectionId}
            />
          ))}

          <NewQuestion templateId={id} sectionId={sectionId} />
        </div>
      </div>
    </div>
  );
}
