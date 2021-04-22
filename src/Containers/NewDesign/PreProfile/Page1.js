/* Date : 10/04/2020 */
/* Created By : siva */

import React, { useEffect, useState } from "react";

// REACT STUFF
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";

// API STUFF
import { useMutation } from "@apollo/client";

import { userUpdate } from "private/Apollo/Mutations";

import { omit } from "lodash";
import styles from "./Profile.module.css";

import { InputForm, Button, RadioButtons, Tags } from "Components/UI_Kits";

export default function Page1({ setPage }) {
  const [mutate] = useMutation(userUpdate);
  const [cognitoUser, setCognitoUser] = useState();
  const { register, handleSubmit, formState, setValue } = useForm();

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
          setValue(`${a}`, ua[a]);
        }
      });
    });
  }, [setValue]);

  const onSubmit = async data => {
    // dummy data

    const input = {
      family_name: "siva",
      given_name: "givenName",
      email: data.email,
      company: data.company,
    };

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
    <div className={styles.profile3}>
      <h1 style={{ margin: "0", padding: "0", marginTop: "20px" }}>
        Personal info
      </h1>
      <p
        style={{
          margin: "0px 0 30px 0",
          lineHeight: "17px",
          fontSize: "14px",
          color: "#969BA3",
        }}
      >
        We want to know a little bit more about you.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "20px" }}>
        <InputForm
          label="First Name"
          type="text"
          name="given_name"
          placeholder="First Name"
          // position = {listForm[position]}
          // setNextFlag = {setNextFlag}
          // validate = {validate}
          required
          reference={register({ required: true })}
        />
        <InputForm
          label="Second Name"
          type="text"
          name="family_name"
          placeholder="Second Name"
          required
          reference={register({ required: true })}
          // position = {listForm[position]}
          // setNextFlag = {setNextFlag}
        />
        <InputForm
          name="company"
          label="Company"
          type="text"
          placeholder="Company"
          required
          reference={register({ required: true })}
          // position = {listForm[position]}
          // setNextFlag = {setNextFlag}
        />
        <div style={{ visibility: "hidden", display: "none" }}>
          <InputForm
            name="email"
            label="Email"
            type="email"
            placeholder="email"
            required
            reference={register({ required: true })}
            // position = {listForm[position]}
            // setNextFlag = {setNextFlag}
          />
        </div>
        <h4 style={{ margin: "0", padding: "0", marginTop: "8px" }}>
          What is your domain expertise?
        </h4>
        <div
          style={{
            marginTop: "10px",
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
        <h4
          style={{
            margin: "0",
            padding: "0",
            marginTop: "25px",
            marginBottom: "20px",
          }}
        >
          Who are you?
        </h4>
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
        <div className={styles.bottom_box}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          ></div>
        </div>
        <Button size="medium" buttonStyle="green" type="right_arrow">
          NEXT
          <p> </p>
        </Button>
      </form>
    </div>
  );
}
