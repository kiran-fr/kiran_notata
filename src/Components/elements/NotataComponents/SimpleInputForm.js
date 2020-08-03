import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { container, input_class } from "./SimpleInputForm.module.css";

export function SimpleInputForm({ placeholder, val, submit }) {
  const { register, handleSubmit, formState, setValue } = useForm();
  const { isSubmitting } = formState;

  useEffect(() => {
    setValue("input_val", val);
  });

  const onSubmit = async (data, event) => {
    submit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={container}>
      <input
        className={input_class}
        type="text"
        name="input_val"
        placeholder={placeholder || "placeholder..."}
        ref={register}
        onBlur={handleSubmit(onSubmit)}
        autoComplete="off"
      />
    </form>
  );
}
