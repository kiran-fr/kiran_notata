import React, { useEffect, useState } from "react";
import "./share-startup.scss";
import Scrollspy from "react-scrollspy";
import google from "../../../../../assets/images/google.png";
import facebook from "../../../../../assets/images/facebook.png";
import instagram from "../../../../../assets/images/instagram.png";
import linkedin from "../../../../../assets/images/linkedin.png";
import twitter from "../../../../../assets/images/twitter.png";
import preview from "../../../../../assets/images/preview.png";
import preview_check from "../../../../../assets/images/preview-done.png";
import download_cover from "../../../../../assets/images/download-cover.png";
import { useQuery, useMutation } from "@apollo/client";
import { creativeTemplateGet } from "private/Apollo/Queries";
import { GhostLoader } from "Components/elements";
import { GeneralInput } from "./Inputs/GeneralInput";
import { creativeUpdate } from "private/Apollo/Mutations";
import { Modal } from "../../../../../Components/UI_Kits/Modal/Modal";
import TextBox from "../ui-kits/text-box";
import InviteStartup from "./InviteStartup";

import ButtonWithIcon from "../../pages/ui-kits/button-with-icon";

export default function ShareStartup({ setshareStartup, connection }) {
  const [answers, setAnswers] = useState([]);
  const [mutateCreativeUpdate] = useMutation(creativeUpdate);
  const [inviteStartUpModal, setInviteStartUpModal] = useState(false);
  const [email, setEmail] = useState(null);
  const [saveLoader, setSaveLoader] = useState(false);

  const { data: creativeTemplateGetData, loading, error } = useQuery(
    creativeTemplateGet
  );

  let creativeTemplate = creativeTemplateGetData?.creativeTemplateGet;

  let sectionNamesArr = creativeTemplate?.sections?.map(section => {
    return {
      name: section.name,
      id: section.id,
    };
  });

  const transformAnswers = obj => {
    return {
      id: obj.id,
      inputType: obj.inputType,
      questionId: obj.questionId,
      questionName: obj.questionName,
      sectionId: obj.sectionId,
      sectionName: obj.sectionName,
      sid: obj.sid,
      val: obj.val,
    };
  };

  useEffect(() => {
    if (connection?.creative?.answers) {
      let savedAns = connection?.creative?.answers?.map(ans =>
        transformAnswers(ans)
      );
      setAnswers(savedAns);
    }
  }, [connection]);

  let details = {};
  let sec = creativeTemplate?.sections?.map(item => {
    details[item.id] = "";
  });
  const [collapseDetailList, setCollapseDetailList] = useState(details);
  console.log("creativeTemplate", creativeTemplate);

  if (!creativeTemplateGetData) {
    return <GhostLoader />;
  }

  const handleEmailChange = e => {
    const { name, value } = e.target;
    setEmail(value);
  };

  const updateCreativeTemplate = async () => {
    setSaveLoader(true);
    let variables = {
      id: connection?.creative?.id,
      input: {
        answers,
      },
    };
    if (email) {
      variables.input.sharedWithEmail = email;
    }
    console.log(variables);
    let update = await mutateCreativeUpdate({
      variables,
    });
    setSaveLoader(false);
    console.log(update?.creativePut);
    setshareStartup();
  };

  return (
    <div className="row tab-panel-container">
      {inviteStartUpModal && (
        <Modal
          title="Invite Startup"
          submit={() => {
            setInviteStartUpModal(false);
          }}
          close={() => {
            setInviteStartUpModal(false);
          }}
          children={
            <InviteStartup
              answers={answers}
              creative={connection?.creative}
              id={connection?.creative?.id}
            />
          }
          submitTxt="OK"
          closeTxt="Cancel"
        ></Modal>
      )}
      <div className="card col-sm-12">
        <div className="row card-notification-bar">
          <div className="text">
            Invite startup to fill in this information.
            <div className="btn" onClick={() => setInviteStartUpModal(true)}>
              {connection?.creative?.sharedWithEmail
                ? "Edit"
                : "Invite startup"}
            </div>
          </div>
        </div>
        <div className="share-startup-container">
          <div className="row">
            <div className="col-sm-12">
              <span class="material-icons back-icon" onClick={setshareStartup}>
                arrow_back_ios
              </span>
              <span className="page-heading">{connection?.creative?.name}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-3 col-xs-0">
              <div className="menu-container">
                <Scrollspy
                  offset={-300}
                  items={sectionNamesArr}
                  currentClassName="is-current"
                >
                  {sectionNamesArr.map(link => (
                    <li key={link.id}>
                      <a
                        href={`#${link.name}`}
                        onClick={() => {
                          let collapseList = { ...collapseDetailList };
                          collapseList[link.id] = "";
                          setCollapseDetailList(collapseList);
                        }}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </Scrollspy>
              </div>
            </div>
            <div className="col-md-9 col-sm-9 col-xs-12 startup-details-container">
              <div className="row">
                <div className="col-sm-2 col-xs-3">
                  <i class="camera fa fa-camera" aria-hidden="true"></i>
                </div>
                <div className="col-sm-10 col-xs-9">
                  <div className="row">
                    <div className="col-sm-12 col-md-5 col-lg-4">
                      <button className="upload-logo-btn">UPLOAD LOGO</button>
                    </div>
                    <div className="col-sm-12 col-md-5 col-lg-4">
                      <button className="delete-btn">DELETE</button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {creativeTemplate?.sections?.map(section => (
                  <>
                    <div className="col-sm-12" id={section.name}>
                      <div className="info-separator separator"></div>
                    </div>
                    <div className={`row details`}>
                      <div className="heading">
                        <i
                          class={`fa ${
                            collapseDetailList[section.id] === ""
                              ? "fa-chevron-up"
                              : "fa-chevron-down"
                          }`}
                          aria-hidden="true"
                          onClick={() => {
                            let collapseList = { ...collapseDetailList };
                            collapseList[section.id] =
                              collapseList[section.id] === "" ? "collapse" : "";
                            setCollapseDetailList(collapseList);
                          }}
                        ></i>
                        {section.name}
                      </div>
                      <div className={collapseDetailList[section.id]}>
                        {section?.questions?.map(question => (
                          <div key={question.id}>
                            <div className="sub-heading">
                              {question.description}
                            </div>
                            <div className="description">{question.name}</div>
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
                <div className="separator"></div>
              </div>
              <div className="row footer">
                <div className="col-sm-6 col-xs-6">
                  <button className="delete-btn">CANCEL</button>
                </div>
                <div className="col-sm-6 col-xs-6">
                  <button
                    className="upload-logo-btn"
                    onClick={updateCreativeTemplate}
                    disabled={saveLoader}
                  >
                    {saveLoader && <i className="fa fa-spinner fa-spin" />}
                    SAVE CHANGES
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
