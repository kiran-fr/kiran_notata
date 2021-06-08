import React from "react";
import { useForm } from "react-hook-form";
import classnames from "classnames";

import styles from "./input.module.scss";

import addCircle from "assets/images/addCircle.svg";
import deleteCircle from "assets/images/deleteCircle.svg";

export default function MultipleTextInput({
  handleOnSubmit,
  handleOnDelete,
  answers,
}) {
  const { register, handleSubmit } = useForm();

  async function onSubmit(data, event) {
    await handleOnSubmit(data, event);
  }

  async function onDelete(id) {
    await handleOnDelete(id);
  }

  async function handleKeyDown(event) {
    if (event.key === "Enter") {
      await handleOnSubmit({ new: event.target.value }, event);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {answers.map(({ id, val }, i) => (
        <div className={styles.inputWrapper} key={id || val}>
          <div>
            <div className={classnames(styles.textbox, styles.noOfFounders)}>
              <input
                type="text"
                autoComplete="off"
                ref={register}
                name={id || i}
                defaultValue={val}
                placeholder="Say something..."
              />
            </div>
          </div>
          <div className={styles.addIcon}>
            <span
              className={styles.inputIcon}
              onClick={() => onDelete(id || i)}
            >
              <img src={deleteCircle} alt="" />
            </span>
          </div>
        </div>
      ))}

      <div className={styles.inputWrapper}>
        <div className={classnames(styles.textbox, styles.noOfFounders)}>
          <input
            type="text"
            autoComplete="off"
            ref={register}
            name="new"
            placeholder="Say something..."
            onBlur={handleSubmit(onSubmit)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.addIcon}>
          <span
            className={styles.inputIcon}
            onClick={() => handleSubmit(onSubmit)}
          >
            <img src={addCircle} alt="" />
          </span>
        </div>
      </div>
    </form>
  );
}
