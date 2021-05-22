import React, { useEffect, useState } from "react";
import "./evaluation-templates.scss";
import ButtonWithIcon from "../../ui-kits/button-with-icon";
import { ICONPOSITION } from "../../constants";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { evaluation_template_profile } from "../../../../../../definitions";
import { Modal } from "../../../../../../Components/UI_Kits/Modal/Modal";
import TextBox from "../../ui-kits/text-box";
import { useQuery, useMutation } from "@apollo/client";
import { accountGet } from "private/Apollo/Queries";
import {
  evaluationTemplateCreate,
  evaluationTemplateDelete,
} from "private/Apollo/Mutations";
import { GhostLoader } from "Components/elements";

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}
// export default function ElevationTemplates({ history }) {
export const ElevationTemplates = ({ history }) => {
  const [value, setValue] = React.useState(0);
  const [name, setName] = useState(null);
  const [saveLoader, setSaveLoader] = useState(false);
  const [evaluationTemplates, setEvauationTemplates] = useState([]);

  const [mutateEvaluationTemplateCreate] = useMutation(
    evaluationTemplateCreate
  );
  const [mutateEvaluationTemplateDelete] = useMutation(
    evaluationTemplateDelete
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const noOfRows = 20;
  const [browseDropDownStates, setBrowseDropDownStates] = useState(
    new Array(noOfRows).fill(false)
  );
  const [createNewTemplate, setCreateNewTemplate] = useState(false);

  const { data: accountGetData, loading, error } = useQuery(accountGet);
  console.log("accountGet", accountGetData?.accountGet?.evaluationTemplates);
  let evaluationTemplatesFromAPI =
    accountGetData?.accountGet?.evaluationTemplates;

  useEffect(() => {
    if (evaluationTemplatesFromAPI) {
      setEvauationTemplates(evaluationTemplatesFromAPI);
    }
  }, [evaluationTemplatesFromAPI]);

  const saveTemplate = async () => {
    setSaveLoader(true);
    let createResponse = await mutateEvaluationTemplateCreate({
      variables: {
        input: {
          name,
        },
      },
    });
    let savedLog = createResponse?.data?.evaluationTemplateCreate;
    console.log(savedLog);
    if (savedLog) {
      setEvauationTemplates([...evaluationTemplates, savedLog]);
    }
    setCreateNewTemplate(false);
    history.push(`${evaluation_template_profile}/${savedLog?.id}`);
  };

  if (!accountGetData) {
    return <GhostLoader />;
  }

  const handleNameChange = e => {
    const { name, value } = e.target;
    setName(value);
  };

  const deleteEvaluation = async id => {
    const resp = await mutateEvaluationTemplateDelete({ variables: { id } });
    if (resp?.data?.evaluationTemplateDelete?.message) {
      setEvauationTemplates(
        evaluationTemplates?.filter(evaluation => evaluation.id !== id)
      );
    }
  };
  return (
    <>
      <div className="evaluation-templates-container">
        <div className="row">
          <div className="col-sm-6 col-xs-12 evaluation-templates-container__heading">
            Evaluation templates
          </div>
          <div className="col-sm-6 col-xs-12 evaluation-templates-container__create-template">
            <ButtonWithIcon
              iconName="add"
              className="create-template-btn"
              text="CREATE Evaluation templates"
              iconPosition={ICONPOSITION.START}
              onClick={() => setCreateNewTemplate(true)}
            ></ButtonWithIcon>
          </div>
        </div>
        <div className="row evaluation-templates-container__tabs-container">
          <Tabs value={value} onChange={handleChange}>
            <Tab label="My templates" {...a11yProps(0)} />
            <Tab label="Groups templates" {...a11yProps(1)} />
          </Tabs>
        </div>
        <div className="evaluation-templates-container__data-container">
          {evaluationTemplates?.map((template, index) => (
            <div
              className="row evaluation-templates-container__data-container__data"
              key={`row-id-${index}`}
            >
              <div
                className="col-sm-4 col-xs-10 template-name"
                onClick={() =>
                  history.push(`${evaluation_template_profile}/${template?.id}`)
                }
              >
                {template.name}
              </div>
              <div className="col-sm-3 col-xs-10 sections">
                {template?.sections?.length || 0} sections
              </div>
              {/* <div className="col-sm-3 group-name">Big group 1</div> */}
              <div className="col-sm-2 col-xs-2 browse">
                <span
                  class="material-icons"
                  onClick={() => {
                    let states = new Array(noOfRows).fill(false);
                    states[index] = !browseDropDownStates[index];
                    setBrowseDropDownStates(states);
                  }}
                >
                  more_horiz
                </span>
                {browseDropDownStates[index] && (
                  <div className="browse__drop-dwon">
                    {value === 1 && (
                      <div
                        className="browse__drop-dwon__item"
                        onClick={() => null}
                      >
                        <span class="material-icons settings">edit</span>
                        <span className="text">EDIT</span>
                      </div>
                    )}
                    <div
                      className="browse__drop-dwon__item"
                      onClick={() => null}
                    >
                      <span class="material-icons settings">content_copy</span>
                      <span className="text">COPY AND EDIT</span>
                    </div>
                    <div
                      className="browse__drop-dwon__item leave"
                      onClick={() => deleteEvaluation(template.id)}
                    >
                      <span class="material-icons leave">delete</span>
                      <span className="delete-text">DELETE GROUP</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {createNewTemplate && (
        <Modal
          title="New Evaluation Template"
          submit={() => {
            saveTemplate();
          }}
          loading={saveLoader}
          close={() => {
            setCreateNewTemplate(false);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={
            <TextBox
              name="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Evaluation Template Name"
            ></TextBox>
          }
        ></Modal>
      )}
    </>
  );
};

// const TextInput = () =>{
//   handleChange
// return <TextBox placeholder="Evaluation Template Name"></TextBox>
// }
