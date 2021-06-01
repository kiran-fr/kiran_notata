/* Date : 10/04/2020 */
/* Created By : siva */

import React, { useEffect, useState } from "react";

// REACT STUFF
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";

// API STUFF
import { useMutation, useQuery } from "@apollo/client";

import { userUpdate } from "private/Apollo/Mutations";
import { userGet } from "private/Apollo/Queries";

import { omit } from "lodash";
import styles from "./Profile.module.css";

import { InputForm, Button, RadioButtons, Tags } from "Components/UI_Kits";

export default function Page1({ setPage }) {
  const [mutate] = useMutation(userUpdate);

  const userQuery = useQuery(userGet);

  const [cognitoUser, setCognitoUser] = useState();
  const { register, handleSubmit, formState, setValue } = useForm();

  // Tags
  const [domain, setDomain] = useState([]);
  const [role, setRole] = useState("investor");

  const { isSubmitting } = formState;

  const user = userQuery.data?.userGet || {};

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

    setValue("company", user?.company);

    if (user && user.q1_expertise) {
      user.q1_expertise.forEach(el => {
        setDomain([
          {
            id: Math.floor(Math.random() * 1000).toString(),
            name: el,
          },
          ...domain,
        ]);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, userQuery.loading]);

  const onSubmit = async data => {
    let whoareyou = role;
    let expertise = [];
    domain.forEach(el => {
      expertise.push(el.name);
    });

    const input = {
      family_name: data.family_name,
      given_name: data.given_name,
      email: data.email,
      company: data.company,
      q1_expertise: [...expertise],
      q2_whoAreYou: whoareyou,
    };

    try {
      await Auth.updateUserAttributes(
        cognitoUser,
        omit(input, ["email", "company", "q1_expertise", "q2_whoAreYou"])
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
        />
        <InputForm
          name="company"
          label="Company"
          type="text"
          placeholder="Company"
          required
          reference={register({ required: true })}
        />
        <div style={{ visibility: "hidden", display: "none" }}>
          <InputForm
            name="email"
            label="Email"
            type="email"
            placeholder="email"
            required
            reference={register({ required: true })}
          />
        </div>
        <h4 style={{ margin: "0", padding: "0", marginTop: "8px" }}>
          What is your domain expertise?
        </h4>
        <div
          style={{
            marginTop: "10px",
            maxWidth: "340px",
          }}
        >
          <Tags
            optionalTxt="write or choose up to 3 tags"
            suggested={true}
            heading={false}
            reference={register({ required: true })}
            title="domain"
            getSelectedTag={setDomain}
            setTags={user?.q1_expertise ? user?.q1_expertise : null}
            items={[
              { name: "Software", id: "4" },
              { name: "Finance", id: "23" },
              { name: "B2B", id: "34" },
              { name: "Growth", id: "17" },
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
          getValue={setRole}
          setValue={user?.q2_whoAreYou ? user?.q2_whoAreYou : null}
          data={[
            { id: 1, value: "investor", label: "Investor" },
            { id: 2, value: "incubator", label: "Incubator" },
            { id: 3, value: "accelerator", label: "Accelerator" },
            { id: 4, value: "hub", label: "Hub" },
            { id: 5, value: "other", label: "Other" },
          ]}
        />

        <div className={styles.button_container}>
          <Button
            value="SAVE"
            size="medium"
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
      </form>
    </div>
  );
}
