import React, { useState } from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import { InputForm, Button, RadioButtons, Tags } from "Components/UI_Kits";

export function PersonalInfo() {
  const listForm = ["firstName", "secondName", "company"];
  const [position, setPosition] = useState(0);
  const [validate, setValidate] = useState(false);

  const setNextFlag = index => {
    setPosition(index === "firstname" ? 1 : index === "secondName" ? 2 : 3);
  };

  const { register, handleSubmit, formState, errors } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required(),
        passwordConfirmation: yup.string().oneOf([yup.ref("password"), null]),
      })
    ),
  });

  return (
    <>
      <h1>Personal info</h1>
      <p>We want to know a little bit more about you.</p>
      <InputForm
        label="First Name"
        inputType="text"
        placeholder="firstName"
        position={listForm[position]}
        setNextFlag={setNextFlag}
        validate={validate}
        reference={register({ required: true })}
      />
      <InputForm
        label="Second Name"
        inputType="text"
        placeholder="secondName"
        position={listForm[position]}
        setNextFlag={setNextFlag}
        validate={validate}
        reference={register({ required: true })}
      />
      <InputForm
        label="Company"
        inputType="text"
        placeholder="secondName"
        position={listForm[position]}
        setNextFlag={setNextFlag}
        validate={validate}
        reference={register({ required: true })}
      />
      <h4>What is your domain expertise?</h4>
      <div
        style={{
          marginTop: "50px",
        }}
      >
        <Tags
          optionalTxt="write or choose up to 3 tags"
          title="xxx"
          suggested={true}
          heading={false}
          title="domain"
          items={[
            { name: "yyy", id: "4" },
            { name: "xxx", id: "23" },
            { name: "yyy", id: "34" },
            { name: "xxx", id: "17" },
            { name: "yyy", id: "47" },
            { name: "xxx", id: "233" },
            { name: "yyy", id: "347" },
          ]}
        />
      </div>
      <h4>Who are you?</h4>
      <RadioButtons
        name="whoare"
        data={[
          { id: 1, value: "inverstor", label: "inverstor" },
          { id: 2, value: "incubator", label: "incubator" },
          { id: 3, value: "accelerator", label: "accelerator" },
          { id: 4, value: "hub", label: "hub" },
          { id: 5, value: "other", label: "other" },
        ]}
      />
    </>
  );
}
