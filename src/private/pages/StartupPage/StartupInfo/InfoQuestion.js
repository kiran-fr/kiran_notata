import React, { useState } from "react";

// Components: general
import { Card } from "Components/elements";

// Components: unique
import { GeneralInput } from "./Inputs/GeneralInput";
import { CommentSection } from "./CommentSection";

// Styles
import styles from "./StartupInfo.module.css";

// *****************
// * Main function *
// *****************
// export default function InfoQuestion({question, section, answers}) {
export default function InfoQuestion({ question, section, templateId }) {
  const [answers, setAnswers] = useState([]);

  return (
    <Card key={question.id} className={styles.section_question_card}>
      {/* InfoQuestion name */}
      <div className="form_h2">{question.name}</div>

      {/* InfoQuestion description */}
      <div className="form_p2">{question.description}</div>

      <hr />

      {/* Each input */}
      <div className={styles.section_question_input}>
        <GeneralInput
          templateId={templateId}
          section={section}
          question={question}
          answers={answers}
          setAnswers={setAnswers}
        />
      </div>

      {/* Comment section */}
      {/*<CommentSection*/}
      {/*  questionId={question.id}*/}
      {/*  answers={answers}*/}
      {/*/>*/}
    </Card>
  );
}
