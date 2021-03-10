import React from "react";

// Components
import InfoQuestion from "./InfoQuestion";

// Styles
import styles from "./StartupInfo.module.css";

// *****************
// * Main function *
// *****************
export default function InfoSection({ templateId, section, answers }) {
  // Definitions
  const { name, description } = section;
  const questions = section.questions || [];

  return (
    <div className={styles.section_container}>
      {/* InfoSection name */}
      <div className={styles.section_name}>{name}</div>

      {/* InfoSection description */}
      <div className={styles.section_description}>{description}</div>

      {/* List of questions */}
      {questions.map(question => (
        <InfoQuestion
          key={question.id}
          templateId={templateId}
          section={section}
          question={question}
          answers={answers}
        />
      ))}
    </div>
  );
}
