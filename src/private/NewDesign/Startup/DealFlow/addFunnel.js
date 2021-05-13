import React from "react";
import { Dropdown } from "Components/UI_Kits/Dropdown/index";
import styles from "./modal.module.css";
import Funnel from "assets/images/funnel.png";
import Modal from "./modal";

export default function AddFunnel({ close }) {
  const list = [{ id: "3344", title: "group 1" }];
  return (
    <Modal title="Set Funnel Stage" closeModal={close}>
      <div className={styles.group}>
        <div className={styles.groupChild + " " + styles.groupFunnelChild}>
          <div style={{ marginBottom: "30px" }}>
            <h2>
              Funnel 1{" "}
              <i
                style={{ cursor: "pointer" }}
                className="fas fa-times-circle"
              ></i>{" "}
            </h2>
          </div>
          <img className={styles.funnelImage} src={Funnel} />
        </div>
        <div className={styles.groupChild}>
          <h2>Add new funnel</h2>
          <div className={styles.groupDropContainer}>
            <Dropdown items={list} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
