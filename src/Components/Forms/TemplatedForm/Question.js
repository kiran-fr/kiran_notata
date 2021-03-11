import React from "react";

// Components: general
import { Card } from "Components/elements";

// Components: unique
import { GeneralInput } from "./Inputs/GeneralInput";
import { Comments } from "./Comments";

// Styles
import styles from "./TemplatedForm.module.css";

// *****************
// * Main function *
// *****************
export default function Question({ question, section, answers, setAnswers }) {
  return (
    <Card className={styles.section_question_card}>
      {/* Question name */}
      <div className="form_h2">{question.name}</div>

      {/* Question description */}
      <div className="form_p2">{question.description}</div>

      <hr />

      {/* Each input */}
      <div className={styles.section_question_input}>
        <GeneralInput
          section={section}
          question={question}
          answers={answers}
          setAnswers={setAnswers}
        />
      </div>

      {/* Comment section */}
      <Comments questionId={question.id} answers={answers} />
    </Card>
  );
}
