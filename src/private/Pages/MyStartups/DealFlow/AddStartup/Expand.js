import React, { useState, useEffect } from "react";

// API
import { useQuery, useMutation } from "@apollo/client";
import {
  groupsGetV2,
  connectionAutoCompleteName,
} from "private/Apollo/Queries";
import {
  connectionCreate,
  creativePut,
  connectionFunnelTagAdd,
  connectionSubjectiveScorePut,
  connectionTagAdd,
  groupStartupAdd,
} from "private/Apollo/Mutations";

// COMPONENT
import { InputForm } from "Components/UI_Kits/InputForm/InputForm";
import { Dropdown } from "Components/UI_Kits/Dropdown/index";
import { AddScore } from "../addScore";
import AddFunnel from "../addFunnel";
import TagsModal from "../../../../../Components/UI_Kits/from_srv/TagsModal";
import { Modal } from "../../../../../Components/UI_Kits/Modal/Modal";
import { useForm } from "react-hook-form";

// OTHERS
import More from "../../../../../assets/images/more.svg";
import _ from "lodash";
import { appsyncClient } from "../../../../../awsconfig";

// DEFINITIONS
import { startup_page } from "definitions";

export default function Expand({ closeModal, styles, connections, history }) {
  // States
  const [existedFlag, setExistedFlag] = useState(undefined);
  const [subScore, setSubScore] = useState();
  const [funnelId, setFunnelId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [tagSelected, setTagSelected] = useState([]);
  const [connectionId, setconnectionId] = useState("");

  const { data: groupsGetV2Data, loading, error } = useQuery(groupsGetV2);

  let groups = groupsGetV2Data?.groupsGetV2 || [];

  const handleScore = score => {
    setSubScore(score);
  };

  // Form
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  // Mutations
  const [mutateCreative] = useMutation(creativePut);
  const [mutateConnectionCreate] = useMutation(connectionCreate);
  // Mutation updating funnel tag for connection
  const [mutateFunnelTag] = useMutation(connectionFunnelTagAdd);
  const [mutateConnectionScore] = useMutation(connectionSubjectiveScorePut);
  const [mutateGroupStartupAdd] = useMutation(groupStartupAdd);
  const [addTagMutation] = useMutation(connectionTagAdd);
  const [showTagsModal, setShowTagsModal] = useState(false);

  const debounced = _.debounce(
    value => {
      appsyncClient
        .query({
          query: connectionAutoCompleteName,
          variables: {
            search: value,
          },
        })
        .then(result => {
          if (result?.data?.connectionAutoCompleteName) {
            setExistedFlag(
              result?.data?.connectionAutoCompleteName[0]?.creativeName
            );
            setconnectionId(
              result?.data?.connectionAutoCompleteName[0]?.connectionId
            );
          } else {
            setconnectionId("");
            setExistedFlag(undefined);
          }
        });
    },
    // delay in ms
    1000
  );

  // Look for duplicate names
  function lookForDuplicateNames(value) {
    debounced(value);
  }

  // Submit function with mutations
  const onSubmit = async data => {
    // Stop if StartupPage with same name exists
    if (existedFlag) {
      // existing company
      closeModal();
    }

    try {
      // Create creative
      let creative_res = await mutateCreative(data);
      let creative = creative_res?.data?.creativePut;

      // Create connection
      let variables = { creativeId: creative.id };
      let res_connection = await mutateConnectionCreate({ variables });
      let connection = res_connection?.data?.connectionCreate;

      //Mutate subjective score for connection
      if (subScore) {
        let scoreVariables = {
          id: connection.id,
          score: subScore,
        };

        let scoreUpdated = await mutateConnectionScore({
          variables: scoreVariables,
        });
      }

      //Mutate funnel tag for connection
      if (funnelId) {
        const funnelVariables = {
          connectionId: connection.id,
          funnelTagId: funnelId,
        };

        let funnelUpdated = await mutateFunnelTag({
          variables: funnelVariables,
        });
      }

      if (tagSelected.length) {
        // api for array of tags
        tagSelected.map(el => {
          let variables = {
            connectionId: connection.id,
            tagId: el.id,
          };

          addTagMutation({
            variables,
          });
        });
      }

      if (selectedGroup) {
        const groupVariables = {
          groupId: selectedGroup.id,
          creativeId: creative.id,
        };
        let groupUpdated = await mutateGroupStartupAdd({
          variables: groupVariables,
        });
      }
      // Go to StartupPage page
      let path = `${startup_page}/company/${connection.id}`;
      history.push(path);

      // closeModal modal
      closeModal();
    } catch (error) {
      console.log("ERROR CREATING STARTUP", error);
    }
  };

  const getSelectedGroup = group => {
    if (group) {
      setSelectedGroup(group);
    }
  };

  const removeGroupItem = () => {
    setSelectedGroup(null);
  };
  const list = [{ id: "3344", name: "group 1" }];

  const handleRedirect = () => {
    if (connectionId) {
      history.push(`${startup_page}/company/${connectionId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.expand}>
        <div className={styles.expandLeft}>
          <div className={styles.inputContainer}>
            <p>Startup Name</p>
            <InputForm
              type="text"
              name="variables.input.name"
              fullWidth={true}
              handleInputChange={value => lookForDuplicateNames(value)}
              reference={register({ required: true })}
            />
          </div>
          {existedFlag && (
            <p className={styles.doyoumean}>
              Do you mean{" "}
              <span
                className={styles.companyLink}
                onClick={() => handleRedirect()}
              >
                {existedFlag}
              </span>{" "}
              It`s already Exists
            </p>
          )}
          <div className="row tags-container overview-tags">
            <div className="tags-container__heading">Tags</div>
            <div className="tags-container__sub-heading">
              Write or choose tags
            </div>
            <div className={styles.tagsPlaceholder}>
              {tagSelected.length > 0
                ? tagSelected.slice(0, 2).map(el => (
                    <span
                      style={{
                        height: "100%",
                        color: "white",
                        padding: "2px 10px",
                        backgroundColor: "#555",
                        borderRadius: 15,
                        fontSize: 10,
                        marginTop: 1,
                        marginRight: 7,
                      }}
                      key={el.id}
                    >
                      {el.group.name} : {el.name}
                    </span>
                  ))
                : ""}
              {tagSelected.length > 2 ? <img src={More} alt="" /> : null}
              <i
                class="fa fa-plus"
                aria-hidden="true"
                onClick={() => setShowTagsModal(true)}
              ></i>
            </div>
          </div>
          {/* <Tags /> */}
          <div className={styles.inputContainer}>
            <p>Your Subjective Score</p>
            <AddScore subScore={subScore} handleScore={handleScore} />
          </div>
          <div
            className={
              styles.inputContainer + " " + styles.startupGroupContainer
            }
          >
            <div>
              <p>Add Startup to a Group</p>
              <ul>
                {selectedGroup && (
                  <li>
                    {selectedGroup.name}{" "}
                    <i
                      className="fas fa-minus-circle"
                      onClick={removeGroupItem}
                    ></i>
                  </li>
                )}
              </ul>
            </div>
            <div className={styles.groupDropContainer}>
              <Dropdown items={groups} setSelectedItem={getSelectedGroup} />
            </div>
          </div>
          <div className={styles.inputContainer} style={{ marginTop: "20px" }}>
            <p style={{ color: "#6A6A6A", letterSpacing: "normal" }}>
              Invite startup to fill out the info form
            </p>
          </div>
          <div className={styles.inputContainer} style={{ marginTop: "18px" }}>
            <p>Email</p>
            <InputForm
              fullWidth={true}
              type="email"
              placeholder="greatstartupinc@gmail.com"
              name="variables.input.sharedWithEmail"
              reference={register({ required: false })}
            />
          </div>
        </div>
        <div className={styles.expandRight}>
          <div className={styles.inputContainer}>
            <div className={styles.startupFunnel}>
              <AddFunnel setFunnelId={setFunnelId} />
            </div>
            {/* <img className={styles.desktopFunnelImage} src={Funnel} />
            <img className={styles.mobileFunnelImage} src={FunnelMobile} /> */}
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={(styles.buttonContainer, styles.btnSpace)}>
          <button onClick={() => closeModal()}>CANCEL</button>
          <button type="submit">
            {" "}
            {isSubmitting ? (
              <i className={"fa fa-spinner fa-spin"} />
            ) : existedFlag ? (
              "Okay"
            ) : (
              "SAVE"
            )}
          </button>
        </div>
      </div>
      {showTagsModal && (
        <Modal
          title="Add Tags"
          disableFoot={true}
          submit={() => {
            setShowTagsModal(false);
          }}
          close={() => {
            setShowTagsModal(false);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={
            <TagsModal
              tagFlag={true}
              tagSelected={tagSelected}
              setTagSelected={setTagSelected}
            />
          }
        ></Modal>
      )}
    </form>
  );
}
