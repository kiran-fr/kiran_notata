import React, { useState, useEffect } from "react";
// REACT STUFF
import { useForm } from "react-hook-form";
import { Button, CheckBoxes, Tags } from "Components/UI_Kits";

import { useMutation, useQuery } from "@apollo/client";
import { userUpdate } from "private/Apollo/Mutations";
import { userGet } from "private/Apollo/Queries";

import styles from "./Profile.module.css";
export default function Page2({
  setPage,
  extraInputs,
  setExtraInputs,
  page,
  skipLast,
}) {
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
  const [geography, setGeography] = useState([]);
  const [stages, setStages] = useState([]);

  const getId = () => Math.floor(Math.random() * 1000).toString();

  useEffect(() => {
    if (user && user.q3_investment) {
      let investmentItems = user.q3_investment.map(el => ({
        id: getId(),
        name: el,
      }));
      setInvestment(investmentItems);
    }

    if (user && user.q4_geography) {
      let geographyItems = user.q4_geography.map(el => ({
        id: getId(),
        name: el,
      }));
      setGeography(geographyItems);
    }

    if (user && user.q5_stage) {
      let stageItems = user.q5_stage.map(name => name);
      setStages(stageItems);
    }
  }, [user]);

  function handleBack(e) {
    e.preventDefault();
    setPage(1);
  }

  function handleKeyUp(e) {
    let val = e.target.value;
    if (val === ",") {
      e.target.value = "";
    }
  }

  const onSubmit = async (data, event) => {
    event.preventDefault();

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

    try {
      await mutate({ variables: { input } });
    } catch (error) {
      console.log("error", error);
    }

    if (!skipLast) {
      setPage(3);
    }
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
            getSelectedTag={setInvestment}
            setTags={user?.q3_investment ? user?.q3_investment : null}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            items={[
              { name: "MedTech", id: "4" },
              { name: "Female Founders", id: "23" },
              { name: "B2B", id: "34" },
            ].filter(it => !investment.some(({ name }) => name === it.name))}
          />
        </div>
        <h4>Main geography</h4>
        <div className={styles.tagContainer}>
          <Tags
            optionalTxt="write or choose up to 3 tags"
            suggested={true}
            heading={false}
            title="domain"
            getSelectedTag={setGeography}
            setTags={user?.q4_geography ? user?.q4_geography : null}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            items={[
              { name: "Norway", id: "4" },
              { name: "Sweden", id: "23" },
              { name: "Oslo", id: "34" },
            ].filter(it => !geography.some(({ name }) => name === it.name))}
          />
        </div>
        <h4>Stage</h4>
        <CheckBoxes
          getSelectedBox={setStages}
          data={[
            { id: 1, value: "Pre seed", label: "Pre seed" },
            { id: 2, value: "Seed", label: "Seed" },
            { id: 3, value: "Series A+", label: "Series A+" },
          ].map(it => ({
            ...it,
            checked: stages.some(name => name === it.value),
          }))}
        />

        <div className={styles.button_container_justify}>
          <Button
            size="medium"
            buttonStyle="white"
            hover="white_hover"
            type="button"
            onClick={handleBack}
          >
            back
          </Button>

          <Button
            value="SAVE"
            size="medium"
            hover="primary_hover"
            buttonStyle="green"
            type={!isSubmitting && !skipLast ? "right_arrow" : ""}
          >
            {!isSubmitting ? (
              skipLast ? (
                "SAVE"
              ) : (
                "NEXT"
              )
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
