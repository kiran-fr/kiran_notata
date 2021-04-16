import React, { useEffect, useState } from "react";

// REACT STUFF
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";

// API STUFF
import { useMutation } from "@apollo/client";

import { userUpdate } from "private/Apollo/Mutations";
import { omit } from "lodash";

import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import { InputForm, Button, RadioButtons, Tags } from "Components/UI_Kits";

export default function Page1({ setPage }) {
  const [mutate] = useMutation(userUpdate);
  const [cognitoUser, setCognitoUser] = useState();
  const listForm = ["email", "password", "confirmPassword"];
  const [position, setPosition] = useState(4);
  const [validate, setValidate] = useState(false);

  const setNextFlag = index => {
    setPosition(index === "email" ? 1 : index === "password" ? 2 : 3);
  };

  const { register, handleSubmit, formState, setValue, errors } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required(),
        passwordConfirmation: yup.string().oneOf([yup.ref("password"), null]),
      })
    ),
  });

  const { isSubmitting } = formState;

  useEffect(() => {
    Auth.currentAuthenticatedUser().then(cognitoUser => {
      setCognitoUser(cognitoUser);
      Auth.userAttributes(cognitoUser).then(userAttributes => {
        let ua = {};
        for (let attrib of userAttributes) {
          ua[attrib.Name] = attrib.Value;
        }
        for (let a in ua) {
          setValue(`input.${a}`, ua[a]);
        }
      });
    });
  }, [setValue]);

  const onSubmit = async data => {
    let { input } = data;
    console.log("data", input, data);

    try {
      await Auth.updateUserAttributes(
        cognitoUser,
        omit(input, ["email", "company"])
      );
    } catch (error) {
      console.log("error", error);
    }

    try {
      await mutate({ variables: { input } });
    } catch (error) {
      console.log("error", error);
    }
    setPage(2);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            buttonStyle="secondary"
            size="small"
            buttonStyle="gray"
            onClick={validate}
            loading={isSubmitting}
          >
            {" "}
            SAVE
          </Button>
        </div>
      </form>
    </>
  );
}
