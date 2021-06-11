import React from "react";
import { Dropdown } from "Components/UI_Kits/Dropdown/index";
import styles from "./modal.module.css";
import { useQuery } from "@apollo/client";
import { Loader } from "Components/elements";
import { groupsGetV2 } from "../../../Apollo/Queries";

export default function AddGroup({ connection, select }) {
  // Queries
  const groupsQuery = useQuery(groupsGetV2);
  let groups = groupsQuery?.data?.groupsGetV2;

  if (!groups) {
    return <Loader />;
  }

  // Get only groups where I am admin
  groups = groups.filter(({ iAmAdmin }) => iAmAdmin);

  // Remove groups we are already part of
  groups = groups.filter(
    ({ id }) => !connection.groupSharingInfo.some(info => info.group.id === id)
  );

  return (
    <div className={styles.group}>
      <div className={styles.groupChild}>
        {!groups.length && <div>You are in no groups</div>}

        {!!groups.length && (
          <>
            <h2>Select group from list below</h2>
            <div className={styles.groupDropContainer}>
              <Dropdown items={groups} setSelectedItem={select} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
