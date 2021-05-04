import React from "react";
import styles from "./modal.module.css";
import Modal from "./modal";

export default function AddScore({ closeModal }) {
  return (
    <Modal title="Set Subjective Score" closeModal={closeModal}>
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
    </Modal>
  );
}
