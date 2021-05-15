import React, { useState, useEffect } from "react";
import { Tags } from "Components/UI_Kits/Tags/Tags";
import { InputForm } from "Components/UI_Kits/InputForm/InputForm";
import { Dropdown } from "Components/UI_Kits/Dropdown/index";
import { AddScore } from "../addScore";
import AddFunnel from "../addFunnel";
import Funnel from "assets/images/funnelNoText.png";
import FunnelMobile from "assets/images/funnelMobile.png";

export default function Expand({ closeModal, styles }) {
  const [subScore, setSubScore] = useState();

  const handleScore = score => {
    setSubScore(score);
  };

  const list = [{ id: "3344", name: "group 1" }];

  return (
    <div className={styles.expand}>
      <div className={styles.expandLeft}>
        <div className={styles.inputContainer}>
          <p>Startup Name</p>
          <InputForm type="text" fullWidth={true} />
        </div>
        <Tags />
        <div className={styles.inputContainer}>
          <p>Your Subjective Score</p>
          <AddScore subScore={subScore} handleScore={handleScore} />
        </div>
        <div
          className={styles.inputContainer + " " + styles.startupGroupContainer}
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
          />
        </div>
      </div>
      <div className={styles.expandRight}>
        <div className={styles.inputContainer}>
          <div className={styles.startupFunnel}>
            <AddFunnel />
          </div>
          {/* <img className={styles.desktopFunnelImage} src={Funnel} />
          <img className={styles.mobileFunnelImage} src={FunnelMobile} /> */}
        </div>
      </div>
    </div>
  );
}
