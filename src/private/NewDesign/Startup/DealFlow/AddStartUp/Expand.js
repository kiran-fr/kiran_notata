import React, { useState, useEffect } from "react";
import { Tags } from "Components/UI_Kits/Tags/Tags";
import { InputForm } from "Components/UI_Kits/InputForm/InputForm";
import { Dropdown } from "Components/UI_Kits/Dropdown/index";
import { AddScore } from "../addScore";
import AddFunnel from "../addFunnel";
import Funnel from "assets/images/funnelNoText.png";
import FunnelMobile from "assets/images/funnelMobile.png";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@apollo/client";
//  import styles from "../modal.module.css"
import { groupsGetV2 } from "private/Apollo/Queries";
import {
  connectionCreate,
  creativePut,
  connectionFunnelTagAdd,
  connectionSubjectiveScorePut,
  groupStartupAdd,
} from "private/Apollo/Mutations";

// DEFINITIONS
import { startup_page } from "definitions";

export default function Expand({ closeModal, styles, connections, history }) {
  const [subScore, setSubScore] = useState();
  const [funnelId, setFunnelId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { data: groupsGetV2Data, loading, error } = useQuery(groupsGetV2);

  let groups = groupsGetV2Data?.groupsGetV2 || [];

  const handleScore = score => {
    setSubScore(score);
  };

  // States
  const [existedFlag, setExistedFlag] = useState(undefined);

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

  // Look for duplicate names
  let companyNameArr = [];
  function lookForDuplicateNames(value) {
    // Populate array if empty
    if (companyNameArr.length === 0) {
      companyNameArr = connections?.length
        ? connections?.map(sub => sub.creative?.name)
        : [];
      console.log(connections);
    }

    let userInput = value ? value.toUpperCase() : "";

    // Filter array to see if we have a match
    let match = companyNameArr.find(
      name => name && name.toUpperCase() === userInput
    );

    // If duplicate, set state
    setExistedFlag(match);
  }

  // Submit function with mutations
  const onSubmit = async data => {
    // Stop if startup with same name exists
    console.log("submit expand", data, subScore, funnelId);
    if (existedFlag) {
      closeModal();
      setExistedFlag(undefined);
      return;
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
      if (selectedGroup) {
        const groupVariables = {
          groupId: selectedGroup.id,
          creativeId: creative.id,
        };
        let groupUpdated = await mutateGroupStartupAdd({
          variables: groupVariables,
        });
      }
      // Go to startup page
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
          <Tags />
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
            {isSubmitting ? <i className={"fa fa-spinner fa-spin"} /> : "SAVE"}
          </button>
        </div>
      </div>
    </form>
  );
}
