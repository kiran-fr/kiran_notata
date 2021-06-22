import React, { useEffect, useState } from "react";
import Scrollspy from "react-scrollspy";
import { GeneralInput } from "../../../Inputs/GeneralInput";
import FileUploader from "./FileUploader";
import { omit } from "lodash";
import TextBox from "../../../../srv_startup/pages/ui-kits/text-box";

export default function EditStartupContent({
  backToInfoPage,
  template,
  creative,
  saveCreative,
  connectionId,
  disableNavigation,
}) {
  const [collapseList, setCollapseList] = useState({});

  const [name, setName] = useState("");
  const [logo, setLogo] = useState(undefined);
  const [answers, setAnswers] = useState([]);
  const [saveLoader, setSaveLoader] = useState(false);

  useEffect(() => {
    if (creative?.answers) {
      let cleanAnswers = creative?.answers?.map(answer =>
        omit(answer, "__typename")
      );
      setAnswers(cleanAnswers);
    }

    if (creative?.name) {
      setName(creative?.name || "");
    }
  }, [creative]);

  return (
    <div className="share-startup-container">
      {!disableNavigation && (
        <div className="row">
          <div className="col-sm-12">
            {backToInfoPage && (
              <span
                className="material-icons back-icon"
                onClick={backToInfoPage}
              >
                arrow_back_ios
              </span>
            )}
            <span className="page-heading">{creative?.name}</span>
          </div>
        </div>
      )}

      <div className="row">
        {!disableNavigation && (
          <div className="col-md-3 col-sm-3 col-xs-0">
            <div className="menu-container">
              <Scrollspy
                offset={-300}
                items={template?.sections || []}
                currentClassName="is-current"
              >
                {template?.sections?.map(({ id, name }) => (
                  <li key={id}>
                    <a
                      href={`#${name}`}
                      onClick={() => {
                        setCollapseList({
                          ...collapseList,
                          [id]: !collapseList[id],
                        });
                      }}
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </Scrollspy>
            </div>
          </div>
        )}

        <div
          className={
            disableNavigation
              ? "col-md-12 col-sm-12 col-xs-12 startup-details-container"
              : "col-md-9 col-sm-9 col-xs-12 startup-details-container"
          }
        >
          <div className="row">
            <div className="col-sm-2 col-xs-3">
              {!creative?.logo && !logo && (
                <i className="camera fa fa-camera" aria-hidden="true" />
              )}

              {(logo || creative?.logo) && (
                <div className="logo">
                  <img src={logo || creative?.logo} />
                </div>
              )}
            </div>

            <FileUploader
              creative={creative}
              saveCreative={saveCreative}
              setLogo={setLogo}
            />
          </div>

          <div className={`row details company-name`}>
            <div className="heading">Company name</div>
            <div>
              <div>
                <TextBox
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Company name"
                />
              </div>
            </div>
          </div>

          <div>
            {template?.sections?.map(section => (
              <>
                <div className="col-sm-12" id={section.name}>
                  <div className="info-separator separator" />
                </div>
                <div className={`row details`}>
                  <div className="heading">
                    <i
                      className={`fa ${
                        collapseList[section.id]
                          ? "fa-chevron-up"
                          : "fa-chevron-down"
                      }`}
                      aria-hidden="true"
                      onClick={() => {
                        setCollapseList({
                          ...collapseList,
                          [section.id]: !collapseList[section.id],
                        });
                      }}
                    />
                    {section.name}
                  </div>
                  <div className={collapseList[section.id] ? "collapse" : ""}>
                    {section?.questions?.map(question => (
                      <div key={question.id} className="question">
                        <div className="heading-section">
                          <div className="sub-heading">{question.name}</div>
                          {question.description && (
                            <div className="description">
                              {question.description}
                            </div>
                          )}
                        </div>

                        <GeneralInput
                          question={question}
                          section={section}
                          answers={answers}
                          setAnswers={setAnswers}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ))}
          </div>
          <div className="col-sm-12">
            <div className="separator" />
          </div>
          <div className="row footer">
            {!disableNavigation && (
              <div className="col-sm-6 col-xs-6">
                <button className="delete-btn">CANCEL</button>
              </div>
            )}

            <div className="col-sm-6 col-xs-6">
              <button
                className="upload-logo-btn"
                onClick={async () => {
                  setSaveLoader(true);
                  try {
                    let input = { answers, name };
                    if (logo) {
                      input.logo = logo;
                    }
                    await saveCreative(input);
                  } catch (error) {
                    return console.log("error", error);
                  }
                  setSaveLoader(false);
                }}
                disabled={saveLoader}
              >
                {saveLoader ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : disableNavigation ? (
                  "SUBMIT"
                ) : (
                  "SAVE"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
