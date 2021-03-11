import React from "react";

// Components
import Question from "./Question";

// Styles
import styles from "./TemplatedForm.module.css";

// *****************
// * Main function *
// *****************
export default function Section({ section, answers, setAnswers }) {
  // Definitions
  const { name, description } = section;
  const questions = section.questions || [];

  return (
    <div className={styles.section_container}>
      {/* Section name */}
      <div className={styles.section_name}>{name}</div>

      {/* Section description */}
      <div className={styles.section_description}>{description}</div>

      {/* List of questions */}
      {questions.map(question => (
        <Question
          key={question.id}
          section={section}
          question={question}
          answers={answers}
          setAnswers={setAnswers}
        />
      ))}
    </div>
  );
}
