import React from "react";
// REACT STUFF
import { useForm } from "react-hook-form";
import { startup_page } from "definitions.js";
import styles from "./Profile.module.css";
import Group from "./group/group";
import { Button } from "Components/UI_Kits";
export default function Page3({ setPage, extraInputs, history }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;
  const onSubmit = async (data, event) => {
    event.preventDefault();
    history.push(startup_page);
  };
  return (
    <form
      className="notata_form"
      onSubmit={handleSubmit(onSubmit)}
      style={{ marginBottom: "20px" }}
    >
      <div className={styles.profile3}>
        <h1
          style={{
            marginBottom: "50px",
          }}
        >
          Do you want to be a part of these groups?
        </h1>
          <Group/>
        <div className={styles.button_container_justify}>
          <Button
            size="medium"
            buttonStyle="white"
            hover="white_hover"
            type="left_arrow"
            onClick={() => setPage(2)}
          >
            Back
          </Button>
          <Button
            value="SAVE"
            size="medium"
            hover="primary_hover"
            buttonStyle="green"
            type={!isSubmitting ? "right_arrow" : ""}
          >
            {!isSubmitting ? (
              "NEXT"
            ) : (
              <span className={styles.loading_icon}>
                <i className="fa fa-spinner fa-spin" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}