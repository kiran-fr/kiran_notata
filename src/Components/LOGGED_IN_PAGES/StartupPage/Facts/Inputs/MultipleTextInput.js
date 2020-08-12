import React, { useEffect, useState, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { creativePut } from "../../../../../Apollo/Mutations";
import { debounce } from "lodash";

import {
  inputWrapper,
  inputIcon,
  // inputPlusIcon
} from "./MultipleTextInput.module.css";

export function MultipleTextInput({ question, section, creative }) {
  const [mutate, { loading }] = useMutation(creativePut);

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const answers = (creative.answers || []).filter(
    ({ inputType, questionId }) =>
      inputType === "INPUT_MUTLIPLE_LINES" && questionId === question.id
  );

  async function onSubmit(data, event) {
    const variables = {
      id: creative.id,
      input: {},
    };

    if (data.new) {
      if (!data.new.length) return;

      variables.input.answerNew = {
        inputType: question.inputType,
        questionId: question.id,
        question: question.name,
        val: data.new,
      };
    } else {
      let hit = answers.find(answer => answer.val !== data[answer.id]);
      if (!hit) return;
      variables.input.answerUpdate = {
        id: hit.id,
        question: question.name,
        val: data[hit.id],
      };
    }

    try {
      await mutate({ variables });
    } catch (error) {
      console.log("error", error);
    }

    if (data.new) {
      event.target.value = "";
    }
  }

  async function onDelete(id) {
    const variables = {
      id: creative.id,
      input: { answerDelete: id },
    };
    try {
      await mutate({ variables });
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
      {answers.map((answer, i) => {
        return (
          <div className={inputWrapper} key={i}>
            <input
              autoComplete="off"
              type="text"
              ref={register}
              name={answer.id}
              defaultValue={answer.val}
              placeholder="Say something..."
              onBlur={handleSubmit(onSubmit)}
            />
            <div
              className={inputIcon}
              onClick={() => {
                onDelete(answer.id);
              }}
            >
              <i className="fal fa-times" />
            </div>
          </div>
        );
      })}

      <div className={inputWrapper}>
        <input
          autoComplete="off"
          type="text"
          ref={register}
          name="new"
          placeholder="Say something..."
          onBlur={handleSubmit(onSubmit)}
        />
        <div className={inputIcon} onClick={() => handleSubmit(onSubmit)}>
          <i className="fal fa-plus" />
        </div>
      </div>
    </form>
  );
}
