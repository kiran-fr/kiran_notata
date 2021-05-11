/* eslint-disable */
import React, { useState } from "react";
import { Button } from "../../../../Components/UI_Kits";
import styles from "./group.module.css";

// API STUFF
import { useMutation, useQuery } from "@apollo/client";
import { userUpdate } from "private/Apollo/Mutations";
import { userGet } from "private/Apollo/Queries";

export default function Group({ group, title, admin }) {
  const [mutate] = useMutation(userUpdate);

  const [updating, setUpdating] = useState(false);
  const userQuery = useQuery(userGet);

  const user = userQuery.data?.userGet || {};

  const updateGroup = async () => {
    setUpdating(true);
    const input = {
      groups: [...user?.groups, group],
    };
    console.log(input);
    try {
      await mutate({ variables: { input } });
      setUpdating(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.group}>
      <div className={styles.group_top}>
        <div className={styles.button_container}>
          <Button
            loading={updating}
            type="plus"
            size="small"
            onClick={updateGroup}
          />
        </div>
        <div className={styles.info_container}>
          <h2>{title}</h2>
          <p>
            Admin: <span>{admin}</span>
          </p>
        </div>
      </div>
      <div className={styles.group_bottom}>
        <p style={{}}>
          Most online platforms are focused on startups, while tools for
          investors are often complicated, expensive and lack sharing
          capabilites. Entering the market as a new investor is difficult
          without open access to a network.
        </p>
      </div>
    </div>
  );
}
