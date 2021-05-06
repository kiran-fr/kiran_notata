import React, { useState, useEffect } from "react";
import styles from "./modal.module.css";
import { Tags } from "Components/UI_Kits/Tags/Tags";
import { InputForm } from "Components/UI_Kits/InputForm/InputForm";
import { Tabsection } from "Components/UI_Kits/Tabs/index";
import { Dropdown } from "Components/UI_Kits/Dropdown/index";
import Modal from "./modal";
import Funnel from "assets/images/funnelNoText.png";
import FunnelMobile from "assets/images/funnelMobile.png";

export default function AddStartup({ closeModal }) {
  const [activeTab, setActiveTab] = useState();

  useEffect(() => {
    setActiveTab(tabArr[0]?.value);
  }, [closeModal]);

  const tabArr = [
    { value: "short", text: "short" },
    { value: "expand", text: "expand" },
  ];

  const list = [{ id: "3344", title: "group 1" }];
  if (!activeTab) return null;
  return (
    <Modal title="Add startup" closeModal={closeModal} width={"810px"}>
      <div className={styles.startup + " " + "startupModal"}>
        <Tabsection
          tabArr={tabArr}
          tabValue={activeTab}
          tabFuc={setActiveTab}
        />
        {activeTab === "expand" && (
          <div className={styles.expand}>
            <div className={styles.expandLeft}>
              <div className={styles.inputContainer}>
                <p>Startup Name</p>
                <InputForm type="text" />
              </div>
              <Tags />
              <div className={styles.inputContainer}>
                <p>Your Subjective Score</p>
                <div className={styles.score}>
                  <div className={styles.child}>
                    <p>1</p>
                  </div>
                  <div className={styles.child}>
                    <p>2</p>
                  </div>
                  <div className={styles.child}>
                    <p>3</p>
                  </div>
                  <div className={styles.child}>
                    <p>4</p>
                  </div>
                  <div className={styles.child}>
                    <p>5</p>
                  </div>
                  <div className={styles.child}>
                    <p>6</p>
                  </div>
                  <div className={styles.child + " " + styles.activeChild}>
                    {" "}
                    <p>7</p>{" "}
                  </div>
                  <div className={styles.child}>
                    <p>8</p>
                  </div>
                  <div className={styles.child}>
                    <p>9</p>
                  </div>
                  <div className={styles.child}>
                    <p>10</p>
                  </div>
                </div>
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
              <div
                className={styles.inputContainer}
                style={{ marginTop: "20px" }}
              >
                <p style={{ color: "#6A6A6A", letterSpacing: "normal" }}>
                  Invite startup to fill out the info form
                </p>
              </div>
              <div
                className={styles.inputContainer}
                style={{ marginTop: "18px" }}
              >
                <p>Email</p>
                <InputForm
                  type="email"
                  placeholder="greatstartupinc@gmail.com"
                />
              </div>
            </div>
            <div className={styles.expandRight}>
              <div className={styles.inputContainer}>
                <div className={styles.startupFunnel}>
                  <p>
                    Funnel 1 <i className="fas fa-minus-circle"></i>
                  </p>
                  <Dropdown items={list} />
                </div>
                <img className={styles.desktopFunnelImage} src={Funnel} />
                <img className={styles.mobileFunnelImage} src={FunnelMobile} />
              </div>
            </div>
          </div>
        )}
        {activeTab === "short" && (
          <div className={styles.short}>
            <div
              className={styles.inputContainer}
              style={{ marginTop: "20px" }}
            >
              <p>Name</p>
              <InputForm type="text" />
            </div>
            <p className={styles.doyoumean}>
              Do you mean <span>Great Startup?</span>
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
