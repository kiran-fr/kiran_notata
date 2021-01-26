import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import { Card, Button, GhostLoader } from "Components/elements";

import { publicEvaluationTemplateSectionGet } from "Apollo/Queries";

import GeneralInput from "./form_containers/GeneralInput";
import styles from "./EvaluationPage.module.css";

function Navigation({
  sections,
  sectionId,
  setSectionId,
  setSubmit,
  isSubmit,
  submitEvaluation,
}) {
  let currentIndex = sections.map(s => s.id).indexOf(sectionId);

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ marginBottom: "10px" }}>
        {(isSubmit && (
          <Button
            type="left_arrow"
            size="large"
            onClick={() => setSubmit(false)}
          >
            {sections[currentIndex].name}
          </Button>
        )) ||
          (currentIndex !== 0 && (
            <Button
              type="left_arrow"
              size="large"
              onClick={() => setSectionId(sections[currentIndex - 1].id)}
            >
              {sections[currentIndex - 1].name}
            </Button>
          )) ||
          ""}
      </div>
      <div style={{ marginBottom: "10px" }}>
        {(isSubmit && (
          <Button type="right_arrow" onClick={submitEvaluation}>
            Submit
          </Button>
        )) ||
          (currentIndex !== sections.length - 1 && (
            <Button
              type="right_arrow"
              onClick={() => setSectionId(sections[currentIndex + 1].id)}
            >
              {sections[currentIndex + 1].name}
            </Button>
          )) || (
            <Button type="right_arrow" onClick={() => setSubmit(true)}>
              Continue
            </Button>
          )}
      </div>
    </div>
  );
}

function SubmitForm({ setPersonalData }) {
  const { register, handleSubmit } = useForm();

  return (
    <Card key="submit" style={{ marginBottom: "30px" }}>
      <div className="form_h2">Who are you?</div>

      <form
        onSubmit={handleSubmit(setPersonalData)}
        className="notata_form mb3"
      >
        <div className={styles.inputWrapper}>
          <input
            autoComplete="off"
            type="text"
            ref={register}
            name="firstname"
            placeholder="First name"
            onBlur={handleSubmit(setPersonalData)}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            autoComplete="off"
            type="text"
            ref={register}
            name="lastname"
            placeholder="Last name"
            onBlur={handleSubmit(setPersonalData)}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            autoComplete="off"
            type="text"
            ref={register}
            name="email"
            placeholder="Email"
            onBlur={handleSubmit(setPersonalData)}
          />
        </div>
      </form>
    </Card>
  );
}

export default function Section({
  sections,
  sectionId,
  setSectionId,
  answers,
  setAnswers,
  submitEvaluation,
}) {
  const [isSubmit, setSubmit] = useState(false);
  const [personalData, setPersonalData] = useState({});
  // Get evaluation template section
  const evaluationTemplateSectionQuery = useQuery(
    publicEvaluationTemplateSectionGet,
    {
      variables: { id: sectionId },
    }
  );

  const evaluationTemplateSection =
    evaluationTemplateSectionQuery.data?.publicEvaluationTemplateSectionGet;

  if (!evaluationTemplateSection) return <GhostLoader />;

  let currentForm;
  if (isSubmit) currentForm = <SubmitForm setPersonalData={setPersonalData} />;
  else
    currentForm = (
      <>
        <div className="form_h1">{evaluationTemplateSection.name}</div>
        <div className="form_p1">{evaluationTemplateSection.description}</div>
        {(evaluationTemplateSection.questions || []).map((question, i) => (
          <Card
            key={`question-${i}-${question.id}`}
            style={{ marginBottom: "10px" }}
          >
            <GeneralInput
              section={evaluationTemplateSection}
              question={question}
              answers={answers}
              setAnswers={setAnswers}
            />
          </Card>
        ))}
      </>
    );

  return (
    <>
      {currentForm}

      <Navigation
        sections={sections}
        sectionId={sectionId}
        setSectionId={setSectionId}
        setSubmit={setSubmit}
        isSubmit={isSubmit}
        submitEvaluation={() => {
          submitEvaluation(personalData);
        }}
      />
    </>
  );
}
