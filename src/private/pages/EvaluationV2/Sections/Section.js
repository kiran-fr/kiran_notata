import React from "react";
import GeneralInput from "./form_containers/GeneralInput";
import { SectionNavigation } from "./SectionNavigation";
import { startup_page } from "definitions.js";
import { Card, BreadCrumbs, Content } from "Components/elements";

export const Section = ({
  connection,
  evaluationTemplate,
  evaluation,
  history,
  match,
  location,
  section,
  answers,
  setAnswers,
  save,
  loading,
}) => {
  return (
    <div>
      <BreadCrumbs
        list={[
          {
            val: `Startup: ${connection?.creative.name}`,
            link: `${startup_page}/${connection?.id}`,
          },
          {
            val: `Template: ${evaluationTemplate?.name}`,
            link: `${startup_page}/${connection?.id}/evaluation/${evaluation?.id}`,
          },
        ]}
      />

      <Content maxWidth={600}>
        <div className="form_h1">{section?.name}</div>
        <div className="form_p1">{section?.description}</div>

        {(section?.questions || []).map((question, i) => (
          <Card
            key={`question-${i}-${question.id}`}
            style={{ marginBottom: "10px" }}
          >
            <GeneralInput
              section={section}
              question={question}
              evaluationTemplate={evaluationTemplate}
              connection={connection}
              evaluation={evaluation}
              answers={answers}
              setAnswers={setAnswers}
            />
          </Card>
        ))}

        <SectionNavigation
          section={section}
          evaluationTemplate={evaluationTemplate}
          connection={connection}
          evaluation={evaluation}
          history={history}
          match={match}
          location={location}
          save={save}
          loading={loading}
        />
      </Content>
    </div>
  );
};
