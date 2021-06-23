import React, { useState, useEffect } from "react";
// COMPONENTS
import { Tabsection } from "Components/UI_Kits/Tabs/index";
import Modal from "./modal";
import Short from "../DealFlow/AddStartUp/Short";
import Expand from "../DealFlow/AddStartUp/Expand";

//STYLES
import styles from "./modal.module.css";

export default function AddStartup({ closeModal, history, connections }) {

  // CONST 
  const tabArr = [
    { value: "short", text: "short" },
    { value: "expand", text: "expand" },
  ];

  // STATES
  const [activeTab, setActiveTab] = useState();

  // EFFECT 
  useEffect(() => {
    setActiveTab(tabArr[0]?.value);
  }, [closeModal]);

 
  if (!activeTab) return null;

  return (
    <Modal
      title="Add startup"
      disabledBtn={true}
      saveModal={closeModal}
      closeModal={closeModal}
      // width={"810px"}
    >
      <div className={styles.startup + " " + "startupModal"}>
        <Short
          history={history}
          closeModal={closeModal}
          connections={connections}
          styles={styles}
        />

        {/*<Tabsection*/}
        {/*  tabArr={tabArr}*/}
        {/*  tabValue={activeTab}*/}
        {/*  tabFuc={setActiveTab}*/}
        {/*/>*/}
        {/*{activeTab === "expand" && (*/}
        {/*  <Expand*/}
        {/*    styles={styles}*/}
        {/*    history={history}*/}
        {/*    connections={connections}*/}
        {/*    closeModal={closeModal}*/}
        {/*  />*/}
        {/*)}*/}
        {/*{activeTab === "short" && (*/}
        {/*  <Short*/}
        {/*    history={history}*/}
        {/*    closeModal={closeModal}*/}
        {/*    connections={connections}*/}
        {/*    styles={styles}*/}
        {/*  />*/}
        {/*)}*/}
      </div>
    </Modal>
  );
}
