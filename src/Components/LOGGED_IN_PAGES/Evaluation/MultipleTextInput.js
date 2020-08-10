import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation } from "@apollo/client";

import { evaluationPut } from "../../../Apollo/Mutations";

export default function MultipleTextInput({ section, question, connectionId }) {
  const [mutate] = useMutation(evaluationPut);
  const { register, handleSubmit, formState, control } = useForm();
  const { isSubmitting } = formState;
  const { val } = useWatch({ control });

  useEffect(() => {
    if (val && val.length) {
      handleSubmit(onSubmit)();
    }
  }, [val]);

  async function onSubmit(data) {
    console.log(data);
    // await mutate({
    //   variables: {
    //     connectionId,
    //   },
    // });
  }

  return (
    <form className="notata_form">
      {question.options.map(({ val, id }, i) => (
        <input ref={register} name="val" value={val} key={id} />
      ))}
    </form>
  );
}
