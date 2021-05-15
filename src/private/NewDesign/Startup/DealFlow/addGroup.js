import React from "react";
import { Dropdown } from "Components/UI_Kits/Dropdown/index";
import styles from "./modal.module.css";
import Modal from "./modal";

export default function AddGroup({ closeModal }) {
  const list = [{ id: "3344", name: "group 1" }];
  return (
    <Modal title="Add Startup to Group" closeModal={closeModal}>
      <div className={styles.group}>
        <div className={styles.groupChild}>
          <h2>Currently startup belongs to:</h2>
          <ul>
            <li>
              Group <i className="fas fa-minus-circle"></i>{" "}
            </li>
            <li>
              Big Group 2 <i className="fas fa-minus-circle"></i>{" "}
            </li>
          </ul>
        </div>
        <div className={styles.groupChild}>
          <h2>Add startup to:</h2>
          <div className={styles.groupDropContainer}>
            <Dropdown items={list} />
            <i style={{ color: "#53CAB2" }} className="fas fa-plus-circle"></i>
          </div>
        </div>
      </div>
    </Modal>
  );
}
