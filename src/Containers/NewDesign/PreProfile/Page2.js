import React, { useState } from "react";
// REACT STUFF
import { useForm } from "react-hook-form";
import { Button, CheckBoxes, Tags } from "Components/UI_Kits";

import { useMutation, useQuery } from "@apollo/client";
import { userUpdate } from "private/Apollo/Mutations";
import { userGet } from "private/Apollo/Queries";

import styles from "./Profile.module.css";
export default function Page2({ setPage, extraInputs, setExtraInputs, page }) {
  const [mutate] = useMutation(userUpdate);
  const userQuery = useQuery(userGet);

  const user = userQuery.data?.userGet || {};

  const { handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;
  function handleKeyDown(e) {
    setExtraInputs({
      ...extraInputs,
      interests: [...extraInputs.interests, e.target.value],
    });
    e.target.value = "";
  }

  // Tags
  const [investment, setInvestment] = useState([]);
  const [geography, setGerography] = useState([]);
  const [stages, setStages] = useState([]);

  function handleBack(e) {
    setPage(1);
  }

  function handleKeyUp(e) {
    let val = e.target.value;
    if (val === ",") {
      e.target.value = "";
    }
  }

  const onSubmit = async (data, event) => {
    let q3 = [];
    let q4 = [];

    investment.forEach(el => {
      q3.push(el.name);
    });

    geography.forEach(el => {
      q4.push(el.name);
    });

    const input = {
      q3_investment: q3,
      q4_geography: q4,
      q5_stage: stages,
    };

    event.preventDefault();
    try {
      await mutate({ variables: { input } });
    } catch (error) {
      console.log("error", error);
    }
    setPage(3);
  };
  return (
    <div>
      <h1>What are you looking for?</h1>
      <h4>Investment opportunities</h4>
      <form
        className="notata_form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ marginBottom: "20px" }}
      >
        <div className={styles.tagContainer}>
          <Tags
            optionalTxt="write or choose up to 3 tags"
            suggested={true}
            heading={false}
            title="domain"
            items={[]}
            getSelectedTag={setInvestment}
            setTags={user?.q3_investment ? user?.q3_investment : null}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
        </div>
        <h4>Main geography</h4>
        <div className={styles.tagContainer}>
          <Tags
            optionalTxt="write or choose up to 3 tags"
            suggested={true}
            heading={false}
            title="domain"
            items={[]}
            getSelectedTag={setGerography}
            setTags={user?.q4_geography ? user?.q4_geography : null}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
        </div>
        <h4>Stage</h4>
        <CheckBoxes
          getSelectedBox={setStages}
          data={[
            { id: 1, value: "Pre seed", label: "Pre seed" },
            { id: 2, value: "Seed", label: "Seed" },
            { id: 3, value: "Series A+", label: "Series A+" },
          ]}
        />
        <div className={styles.button_container_justify}>
          <Button
            size="medium"
            buttonStyle="white"
            type="button"
            onClick={e => handleBack(e)}
          >
            back
          </Button>
          <Button
            size="medium"
            buttonStyle="green"
            type="submit"
            loading={isSubmitting}
          >
            NEXT
          </Button>
        </div>
      </form>
    </div>
  );
}
