import React, { useEffect } from "react";
import classnames from "classnames";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";

import { GhostLoader } from "../../../elements/GhostLoader";
import BigButton from "../../../elements/BigButton";
import BreadCrumbs from "../../../elements/BreadCrumbs";
import TextAreaAutoHeight from "../../../elements/TextAreaAutoHeight";
import Saver from "../../../elements/Saver";

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
  container,
  small_container,
  inner_container,
  standard_form,
  focus_form
} from "../../../elements/Style.module.css";
import { gridContainer } from "../../../elements/Grid.module.css";
import { delete_option } from "./EvaluationTemplate.module.css";
import { content_tag } from "../../../../routes.module.css";
import {
  color1_bg,
  color2_bg,
  color3_bg,
  color4_bg,
  color5_bg,
  color6_bg,
  color7_bg,
  color8_bg,
  color9_bg
} from "../../../elements/Colors.module.css";

const colors = [
  color1_bg,
  color2_bg,
  color3_bg,
  color4_bg,
  color5_bg,
  color6_bg,
  color7_bg,
  color8_bg,
  color9_bg
];

function getColor(i) {
  if (i >= colors.length) i = i - colors.length;
  return colors[i];
}

function NameAndDescription({ data }) {
  const [mutate] = useMutation(evaluationTemplatePut);
  const { name, description, id } = data;

  return (
    <form className={focus_form}>
      <div
        style={{
          marginTop: "50px",
          textAlign: "center"
        }}
      >
        <h1>
          <TextAreaAutoHeight
            placeholder='I.e. "Early stage evaluations"'
            value={name}
            onBlur={value => {
              if (name === value) return;
              let variables = {
                id: id,
                input: { name: value }
              };
              mutate({
                variables,
                optimisticResponse: {
                  __typename: "Mutation",
                  evaluationTemplatePut: {
                    ...data,
                    name: value
                  }
                }
              });
            }}
          />

          <div>
            <span />
          </div>
        </h1>
      </div>

      <div
        style={{
          marginTop: "50px",
          textAlign: "center"
        }}
      >
        <p>
          <TextAreaAutoHeight
            placeholder='I.e. "Template for evaluating early stage startups"'
            value={description}
            onBlur={value => {
              if (description === value) return;
              let variables = {
                id: id,
                input: { description: value }
              };
              mutate({
                variables,
                optimisticResponse: {
                  __typename: "Mutation",
                  evaluationTemplatePut: {
                    ...data,
                    description: value
                  }
                }
              });
            }}
          />
          <div>
            <span />
          </div>
        </p>
      </div>
    </form>
  );
}

function AddNewSection({ id, data }) {
  const [mutate] = useMutation(evaluationTemplateSectionPut);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  async function onSubmit(name, event) {
    await mutate({
      variables: {
        templateId: id,
        input: name
      }
    });

    event.target.reset();
  }

  return (
    <form className={standard_form} onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder='I.e. "Team"'
          ref={register({ required: true })}
          name="name"
        />
      </div>

      <div style={{ marginTop: "30px" }}>
        <input type="submit" value="Add new section" disabled={isSubmitting} />
        {isSubmitting && <i className="fa fa-spinner fa-spin" />}
      </div>
    </form>
  );
}

function Sections({ id, data }) {
  const [mutate, { loading }] = useMutation(evaluationTemplateSectionDelete, {
    refetchQueries: [{ query: evaluationTemplateGet, variables: { id } }],
    awaitRefetchQueries: true
  });

  return (
    <div>
      <div className={gridContainer} style={{ margin: "0px -30px" }}>
        {(data.sections || []).map((section, i) => (
          <div key={`section-${section.id}`} style={{ position: "relative" }}>
            <BigButton
              className={getColor(i)}
              label={section.name}
              subLabel={`${section.questions.length} ${
                section.questions.length === 1 ? "question" : "questions"
              } `}
              link={`${evaluation_template}/${id}/${section.id}`}
            />
            {loading && <GhostLoader />}
            <div
              className={delete_option}
              onClick={() => {
                if (section.questions.length) {
                  return window.alert(
                    "You have to delete all the questions in a section before you can delete the section"
                  );
                }
                let variables = {
                  id: section.id
                };
                mutate({
                  variables
                });
              }}
            >
              delete
            </div>
          </div>
        ))}
      </div>

      <AddNewSection data={data} id={id} />
    </div>
  );
}

export default function EvaluationTemplate({ match }) {
  const id = match.params.id;
  const [getData, { data, loading, error }] = useLazyQuery(
    evaluationTemplateGet
  );

  useEffect(() => {
    if (id && id !== "new") {
      getData({ variables: { id } });
    }
  }, []);

  if (error) return <div>We are updating </div>;
  if (!data || loading) return <GhostLoader />;

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
          }
        ]}
      />
      <div
        className={classnames(container, small_container)}
        style={{ maxWidth: "650px" }}
      >
        <div className={inner_container}>
          <NameAndDescription data={data.evaluationTemplateGet || {}} />
          <Sections data={data.evaluationTemplateGet} id={id} />
        </div>
      </div>
    </div>
  );
}
