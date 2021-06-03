import React, { useEffect, useState, useRef } from "react";
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
import { Storage } from "aws-amplify";

const publicFilePath = `https://s3-eu-west-1.amazonaws.com/notata.userfiles/public/`;

// const FileUploader = ({ creativeId, connectionId }) => {
//
//   const folderPath = `${creativeId}/`;
//
//   const [files, setFiles] = useState([]);
//
//   const addFiles = (newFiles) => {
//     setFiles((oldFiles) => [
//       ...oldFiles,
//       ...newFiles.map((file) => ({
//         ...file,
//         loading: false,
//       })),
//     ]);
//   };
//
//   const addFile = (newFile) => {
//     setFiles((oldFiles) => [...oldFiles, newFile]);
//   };
//
//   const changeFileLoading = (file) => {
//     setFiles((oldFiles) =>
//       oldFiles.map((oldFile) => {
//         if (oldFile.key !== file.key) {
//           return oldFile;
//         } else {
//           return {
//             ...file,
//             loading: file.loaded !== file.total,
//           };
//         }
//       }),
//     );
//   };
//
//
//   useEffect(() => {
//     Storage.list(
//       folderPath,
//       { level: "private" }
//       )
//       .then((result) => addFiles(result))
//       .catch((err) => console.log(err));
//   }, []);
//
//   return (
//     <div>
//       <h4>Files</h4>
//
//       {files.map((file) => {
//         if (file.loading) {
//           const progress = (file.loaded / file.total) * 100;
//           let backgroundImage = `linear-gradient(to right, #53af64 ${progress}%, grey ${100 - progress}%)`;
//           return (
//             <div
//               style={{
//                 position: "relative",
//                 backgroundImage: backgroundImage,
//               }}
//             >
//               {file.key.split(folderPath)[1]}
//             </div>
//           );
//         } else {
//           return (
//             <div>
//               <button
//                 onClick={() => {
//                   Storage.get(file.key, { level: "private" })
//                     .then((result) => window.open(result))
//                     .catch((err) => console.log(err));
//                 }}
//               >
//                 {file.key.split(folderPath)[1]}
//               </button>
//               <div>
//                 <button
//                   onClick={() => {
//                     setFiles((oldFiles) =>
//                       oldFiles.filter((oldFile) => oldFile.key !== file.key),
//                     );
//                     Storage.remove(file.key, { level: "private" })
//                       .then((result) => console.log(result))
//                       .catch((err) => console.log(err));
//                   }}
//                 >
//                   <i className="fas fa-minus-circle" />
//                 </button>
//               </div>
//             </div>
//           );
//         }
//       })}
//
//       <div>
//         <input
//           type="file"
//           multiple
//           onChange={(e) => {
//             Array.from(e.target.files).forEach((file) => {
//               const filename = `${folderPath}${file.name}`;
//               addFile({
//                 key: filename,
//                 loading: true,
//                 loaded: 0,
//                 total: 100,
//               });
//               Storage.put(filename, file, {
//                 progressCallback(progress) {
//                   changeFileLoading({
//                     key: filename,
//                     loaded: progress.loaded,
//                     total: progress.total,
//                   });
//                 },
//                 level: "private",
//               })
//                 .then((result) =>
//                   changeFileLoading({
//                     key: result.key,
//                     loaded: 1,
//                     total: 1,
//                   }),
//                 )
//                 .catch((err) => console.log(err));
//             });
//           }}
//         />
//       </div>
//     </div>
//   );
// };

async function removeLogoPromise(key, config) {
  return new Promise((resolve, reject) => {
    Storage.remove(key, config).then(resolve).catch(reject);
  });
}

async function uploadLogoPromise(filename, file, setProgress) {
  return new Promise((resolve, reject) => {
    Storage.put(filename, file, {
      progressCallback(progress) {
        if (setProgress) {
          setProgress({
            loaded: progress.loaded,
            total: progress.total,
          });
        }
      },
      level: "public",
    })
      .then(resolve)
      .catch(reject);
  });
}

const FileUploader = ({ connection }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [mutate] = useMutation(creativeUpdate);
  const folderPath = `${connection?.creative?.id}/`;

  const formRef = useRef(null);

  const [progress, setProgress] = useState();

  async function handleUpload(e) {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    // Get file
    let file = e.target.files[0];

    // Return if no file
    if (!file) {
      return;
    }

    // Get file size
    let filesize = (file.size / 1024 / 1024).toFixed(4); // MB

    // Do not allow pictures larger than one mb
    if (filesize >= 1) {
      return;
    }

    // Get the file name parts
    let split = file.name.split(".");

    // Save as logo.ext
    let name = `logo.` + split[split.length - 1];

    // Get path and file name together
    const filename = `${folderPath}${name}`;

    // Save file to s3
    let result;
    try {
      result = await uploadLogoPromise(filename, file, setProgress());
    } catch (error) {
      setIsLoading(false);
      console.log("error", error);
      return;
    }

    // Save file in DB
    try {
      let { key } = result;
      let path = `${publicFilePath}${key}`;
      let variables = {
        id: connection.creative.id,
        input: { logo: path },
      };
      await mutate({ variables });
    } catch (error) {
      setIsLoading(false);
      console.log("error2", error);
      return;
    }

    setIsLoading(false);
  }

  async function handleDelete() {
    if (isDeleting) {
      return;
    }
    setIsDeleting(true);

    let parts = connection?.creative?.logo.split("/");
    let key = `/${parts[parts.length - 2]}/${parts[parts.length - 1]}`;

    try {
      await removeLogoPromise(key, { level: "public" });
    } catch (error) {
      console.log("error", error);
    }

    try {
      let variables = {
        id: connection.creative.id,
        input: { removeLogo: true },
      };
      await mutate({ variables });
    } catch (error) {
      console.log("error", error);
    }

    setIsDeleting(false);
    formRef.current.reset();
  }

  return (
    <div className="col-sm-10 col-xs-9">
      <div className="row">
        <div className="col-sm-12 col-md-5 col-lg-4">
          <div className="hidden-file-input">
            <form ref={formRef}>
              <label htmlFor="file-upload" className="upload-logo-btn">
                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={handleUpload}
                />
                <span>
                  {(!isLoading && <span>UPLOAD LOGO</span>) || (
                    <span>UPLOADING...</span>
                  )}
                </span>
              </label>
            </form>
          </div>
        </div>

        <div className="col-sm-12 col-md-5 col-lg-4">
          <button className="delete-btn" onClick={handleDelete}>
            {(!isDeleting && <span>DELETE</span>) || <span>DELETING...</span>}
          </button>
        </div>

        {/*<div>*/}
        {/*  {progress && (*/}
        {/*    <div>*/}
        {/*      {Math.round(progress.loaded / progress.total * 100)}*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*</div>*/}

        <div>
          {/*<input*/}
          {/*  type="file"*/}
          {/*  accept="image/png, image/gif, image/jpeg"*/}
          {/*  onChange={handleUpload}*/}
          {/*/>*/}
        </div>
      </div>
    </div>
  );
};

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
    let update = await mutateCreativeUpdate({
      variables,
    });
    setSaveLoader(false);
  };

  return (
    <div className="row tab-panel-container">
      {inviteStartUpModal && (
        <InviteStartup
          answers={answers}
          creative={connection?.creative}
          id={connection?.creative?.id}
          setInviteStartUpModal={setInviteStartUpModal}
        />
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
                  {(!connection.creative.logo && (
                    <i className="camera fa fa-camera" aria-hidden="true"></i>
                  )) || (
                    <div className="logo">
                      <img src={connection.creative.logo} />
                    </div>
                  )}
                </div>

                <FileUploader connection={connection} />
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
                    {saveLoader
                      ?
                        <i className="fa fa-spinner fa-spin" />
                      :
                        "SAVE CHANGES"
                    }
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
