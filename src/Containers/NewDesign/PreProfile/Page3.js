/* Date : 10/04/2020 */
/* Created By : siva */

import React, { useState } from "react";

// REACT STUFF
import { useForm } from "react-hook-form";

// API STUFF
import { useMutation } from "@apollo/client";
import { userUpdate } from "private/Apollo/Mutations";
import { dashboard, startup_page } from "definitions.js";

import styles from "./Profile.module.css";
import Group from "./group/group";
import { Button } from "Components/UI_Kits";

export default function Page3({ extraInputs, history }) {
  const [mutate] = useMutation(userUpdate);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    event.preventDefault();

    let input = {
      ...extraInputs,
      investor: "software devloper",
    };

    try {
      setLoading(true);
      await mutate({ variables: { input } });
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);

    // history.push(dashboard);
    history.push(startup_page);
  };

  const data = [
    { title: "business angels 1", admin: "Stephanie Wykoff" },
    { title: "business angels 2", admin: "Stephanie Wykoff" },
    { title: "business angels 3", admin: "Stephanie Wykoff" },
    { title: "business angels 4", admin: "Stephanie Wykoff" },
  ];

  // const onSubmit = (data, event) => {
  //   event.preventDefault();
  // };

  /* function handleKeyDown(e) {
    if (e.key === "Enter" || e.keyCode === 188) {
      let val = e.target.value;
      if (val === "") return;
      setExtraInputs({
        ...extraInputs,
        skills: [...extraInputs.skills, e.target.value],
      });
      e.target.value = "";
    }
  }

  function handleKeyUp(e) {
    let val = e.target.value;
    if (val === ",") {
      e.target.value = "";
    }
  } */

  return (
    <div className={styles.profile3}>
      <h1
        style={{
          marginBottom: "50px",
        }}
      >
        Do you want to be a part of these groups?
      </h1>

      {data.map((item, i) => (
        <Group key={i} title={item.title} admin={item.admin} />
      ))}
      <Button
        type="input"
        // value={isDirty ? "SAVE" : "SKIP"}
        value={"NEXT"}
        loading={loading}
      />
    </div>
  );
}
