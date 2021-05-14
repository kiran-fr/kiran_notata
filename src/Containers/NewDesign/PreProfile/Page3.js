/* Date : 10/04/2020 */
/* Created By : siva */

import React from "react";

// REACT STUFF
import { useForm } from "react-hook-form";

import { startup_page } from "definitions.js";

import styles from "./Profile.module.css";
import Group from "./group/group";
import { Button } from "Components/UI_Kits";

export default function Page3({ setPage, extraInputs, history }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    event.preventDefault();

    history.push(startup_page);
  };

  const data = [
    {
      title: "business angels 1",
      admin: "Stephanie Wykoff",
      group: {
        id: "123",
        name: "Group Name",
        groupDescription: "Group description",
        createdByUser: {
          family_name: "Tushar",
          given_name: "Kumar",
          email: "jorgen@notata.io",
        },
        members: [],
      },
    },
    {
      title: "business angels 2",
      admin: "Stephanie Wykoff",
      group: {
        groupId: "23234234",
        groupName: "Group Name",
        groupDescription: "Group description",
        createdByUser: {
          family_name: "Ankit",
          given_name: "Kumar",
          email: "jorgen@notata.io",
        },
      },
    },
    {
      title: "business angels 3",
      admin: "Stephanie Wykoff",
      group: {
        groupId: "12312141",
        groupName: "Group Name",
        groupDescription: "Group description",
        createdByUser: {
          family_name: "Saurav",
          given_name: "Anand",
          email: "jorgen@notata.io",
        },
      },
    },
  ];

  return (
    <form
      className="notata_form"
      onSubmit={handleSubmit(onSubmit)}
      style={{ marginBottom: "20px" }}
    >
      <div className={styles.profile3}>
        <h1
          style={{
            marginBottom: "50px",
          }}
        >
          Do you want to be a part of these groups?
        </h1>

        {data.map((item, i) => (
          <Group
            key={i}
            group={item.group}
            id={item.id}
            title={item.title}
            admin={item.admin}
          />
        ))}
        <div className={styles.button_container_justify}>
          <Button
            size="medium"
            buttonStyle="white"
            type="left_arrow"
            onClick={() => setPage(2)}
          >
            Back
          </Button>

          <Button
            size="medium"
            buttonStyle="green"
            type="right_arrow"
            loading={isSubmitting}
          >
            NEXT
          </Button>
        </div>
      </div>
    </form>
  );
}
