import React from "react";

// Components
import InfoSection from "./InfoSection";

// *****************
// * Main function *
// *****************
export default function InfoForm({ creative, creativeTemplate }) {
  // Get sections from creative template
  let sections = creativeTemplate.sections || [];

  // Get answers from creative
  let answers = creative.answers || [];

  // Remove "terms" section from template
  sections = sections.filter(({ id }) => id !== "section_terms");

  // Roll out the sections
  return (
    <>
      {sections.map(section => (
        <InfoSection
          key={section.id}
          templateId={creativeTemplate.id}
          section={section}
          answers={answers}
        />
      ))}
    </>
  );
}
