import React from "react";
import { useForm } from "react-hook-form";
import classnames from "classnames";

import styles from "./input.module.scss";

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
          {/* <input
            autoComplete="off"
            type="text"
            ref={register}
            name={id || i}
            defaultValue={val}
            placeholder="Say something..."
            onBlur={handleSubmit(onSubmit)}
          ></input> */}
          <div className="col-sm-10">
            <div className={classnames(styles.textbox, styles.noOfFounders)}>
              <input
                type="text"
                placeholder="Write your answer..."
                autoComplete="off"
                type="text"
                ref={register}
                name={id || i}
                defaultValue={val}
                placeholder="Say something..."
              />
            </div>
          </div>

          <span className={styles.inputIcon} onClick={() => onDelete(id || i)}>
            <i className="fal fa-times" />
          </span>
        </div>
      ))}

      <div className={styles.inputWrapper}>
        {/* <input
          autoComplete="off"
          type="text"
          ref={register}
          name="new"
          placeholder="Say something..."
          onBlur={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
        /> */}
        <div className={classnames(styles.textbox, styles.noOfFounders)}>
          <input
            type="text"
            placeholder="Write your answer..."
            autoComplete="off"
            type="text"
            ref={register}
            name="new"
            placeholder="Say something..."
            onBlur={handleSubmit(onSubmit)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <span
          className={styles.inputIcon}
          onClick={() => handleSubmit(onSubmit)}
        >
          <i className="fal fa-plus" />
        </span>
        {/* <div className="inputIcon" onClick={() => handleSubmit(onSubmit)}>
          <i className="fal fa-plus" />
        </div> */}
      </div>
    </form>
  );
}
