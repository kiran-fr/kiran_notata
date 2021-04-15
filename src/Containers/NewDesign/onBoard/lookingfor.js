import React, { useState } from "react";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import { CheckBoxes, Button, Tags } from "Components/UI_Kits";

export function LookingFor() {
  return (
    <>
      <h1>What are you looking for?</h1>
      <h4>Investment opportunities</h4>
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
          items={[]}
        />
      </div>
      <h4>Main geography</h4>
      <div>
        <Tags
          optionalTxt="write or choose up to 3 tags"
          title="xxx"
          suggested={true}
          heading={false}
          title="domain"
          items={[]}
        />
      </div>
      <h4>Statge</h4>
      <CheckBoxes
        data={[
          { id: 1, value: "Pre seed", label: "Pre seed" },
          { id: 2, value: "Seed", label: "Seed" },
          { id: 3, value: "Series A+", label: "Series A+" },
        ]}
      />
    </>
  );
}
