import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Card, Modal } from "Components/elements";
import styles from "../PresentationPage.module.css";

export function Valuation({ presentation, setPresentation }) {
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit } = useForm();

  function onSubmit({ key, val }, event) {
    setPresentation({
      ...presentation,
      creativeDetails: {
        ...presentation.creativeDetails,
        valuation: {
          key,
          val,
        },
      },
    });

    setShowModal(false);
  }

  return (
    <div className={styles.infoBox}>
      <Card
        label={"Valuation"}
        style={{
          paddingBottom: "20px",
          height: "110px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className={styles.infoBoxInner}>
          <div>
            <div className={styles.infoBox_big_number}>
              {presentation?.creativeDetails?.valuation?.key}
            </div>

            <div className={styles.infoBox_byline}>
              {presentation?.creativeDetails?.valuation?.val}
            </div>
          </div>

          {(!presentation?.creativeDetails?.valuation && (
            <Button size={"small"} onClick={() => setShowModal(true)}>
              set
            </Button>
          )) || (
            <div className={styles.small_edit_button}>
              <Button type={"just_text"} onClick={() => setShowModal(true)}>
                edit
              </Button>
            </div>
          )}
        </div>
      </Card>

      {showModal && (
        <Modal
          title="Estimated company valuation"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
            <label>Number</label>
            <input
              type="text"
              placeholder={"3-8"}
              autoComplete="off"
              ref={register}
              defaultValue={presentation?.creativeDetails?.valuation?.key || ""}
              id="key"
              name="key"
            />

            <label>Currency</label>
            <input
              type="text"
              placeholder={"million NOK"}
              autoComplete="off"
              ref={register}
              defaultValue={presentation?.creativeDetails?.valuation?.val || ""}
              id="val"
              name="val"
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span />
              <Button type={"submit"} size={"medium"}>
                OK
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}