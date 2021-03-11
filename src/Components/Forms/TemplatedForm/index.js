import React, { useState, useEffect } from "react";

// Helpers
import { omit } from "lodash";

// Components
import { Button } from "Components/elements";
import Section from "./Section";

// Styles
import styles from "./TemplatedForm.module.css";

// *****************
// * Main function *
// *****************
export default function TemplatedForm({ template, content, submit, loading }) {
  // State: form answers
  const [answers, setAnswers] = useState(content || []);

  // Populate answers from server
  useEffect(() => {
    if (content) {
      setAnswers(content);
    }
  }, [content]);

  // Get sections from creative template
  let sections = template.sections || [];

  // Roll out the sections
  return (
    <div className={styles.form_container}>
      {/* Form title */}
      {template.title && (
        <div className={styles.form_title}>{template.title}</div>
      )}

      {/* Form description */}
      {template.description && (
        <div className={styles.form_description}>{template.description}</div>
      )}

      {/* Sections */}
      {sections.map(section => (
        <Section
          key={section.id}
          section={section}
          answers={answers}
          setAnswers={setAnswers}
        />
      ))}

      {/* Submit form */}
      <div className={styles.save_button_container}>
        <span />
        <Button
          loading={loading}
          onClick={() => {
            submit(answers);
          }}
        >
          Submit it, innit
        </Button>
      </div>
    </div>
  );
}
