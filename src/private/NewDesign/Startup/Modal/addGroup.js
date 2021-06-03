import React from "react";
import { Dropdown } from "Components/UI_Kits/Dropdown/index";
import styles from "./modal.module.css";
import { useMutation } from "@apollo/client";
import { Loader } from "Components/elements";
import { groupStartupAdd } from "../../../Apollo/Mutations";

export default function AddGroup({ groups, connection }) {
  // Mutations
  const [addStartup, addStartupRes] = useMutation(groupStartupAdd);

  if (!groups) {
    return <Loader />;
  }

  return (
    <div className={styles.group}>
      {addStartupRes.loading && <Loader />}

      <div className={styles.groupChild}>
        <h2>Startup is in these groups:</h2>
        <ul>
          {connection?.groupSharingInfo?.map(({ group }) => (
            <li key={group.id}>{group.name}</li>
          ))}
        </ul>
      </div>
      <div className={styles.groupChild}>
        <h2>Add startup to:</h2>
        <div className={styles.groupDropContainer}>
          <Dropdown
            items={groups}
            setSelectedItem={async group => {
              if (addStartupRes.loading) {
                return;
              }

              let variables = {
                groupId: group.id,
                creativeId: connection.creative.id,
              };

              try {
                await addStartup({ variables });
              } catch (error) {
                console.log("error", error);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
