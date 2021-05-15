import React, { useState, useEffect } from "react";
import { Tags } from "Components/UI_Kits/Tags/Tags";
import { InputForm } from "Components/UI_Kits/InputForm/InputForm";
import { Dropdown } from "Components/UI_Kits/Dropdown/index";
import { AddScore } from "../addScore";
import AddFunnel from "../addFunnel";
import Funnel from "assets/images/funnelNoText.png";
import FunnelMobile from "assets/images/funnelMobile.png";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { connectionCreate, creativePut } from "private/Apollo/Mutations";

export default function Expand({ closeModal, styles, connections }) {
  const [subScore, setSubScore] = useState();
  const [funnelId, setFunnelId] = useState(null);

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

      // let = subjectiveScores {
      //   score
      //   createdAt
      //   createdBy
      //   createdByUser {
      //     email
      //     given_name
      //     family_name
      //   }
      // }
      let variables = { creativeId: creative.id };
      let res_connection = await mutateConnectionCreate({ variables });
      let connection = res_connection?.data?.connectionCreate;

      // Go to startup page
      // let path = `${startup_page}/${connection.id}`;
      // let path = `${startup_page}/components/ui/navigation1`;

      // history.push(path);

      // closeModal modal
      closeModal();
    } catch (error) {
      console.log("ERROR CREATING STARTUP", error);
    }
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
                <li>
                  Group 1 <i className="fas fa-minus-circle"></i>
                </li>
                <li>
                  Big Group 1 <i className="fas fa-minus-circle"></i>
                </li>
              </ul>
            </div>
            <div className={styles.groupDropContainer}>
              <Dropdown items={list} />
              <i
                style={{ color: "#53CAB2", marginTop: "12px" }}
                className="fas fa-plus-circle"
              ></i>
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
