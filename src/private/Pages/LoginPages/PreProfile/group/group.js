import React, { useState, useEffect } from "react";
import { Button } from "../../../../../Components/UI_Kits";
import styles from "./group.module.css";
// API STUFF
import { useMutation, useQuery } from "@apollo/client";
import { userUpdate } from "private/Apollo/Mutations";
import { groupsPublicGet, userGet } from "private/Apollo/Queries";
import { groupPublicJoin } from "private/Apollo/Mutations";
import { Loader } from "Components/elements";
export default function Group() {
  const [mutate] = useMutation(userUpdate);
  // Queries
  const publicGroupsQuery = useQuery(groupsPublicGet);
  const userQuery = useQuery(userGet);
  // Mutations
  const [joinPublicGroup, joinPublicGroupRes] = useMutation(groupPublicJoin);
  const [updating, setUpdating] = useState(false);

  // Maps
  let publicGroupsFromServer = publicGroupsQuery?.data?.groupsPublicGet || [];
  const user = userQuery.data?.userGet || {};

  let publicGroups = publicGroupsFromServer;
  let hasAllData = publicGroupsQuery?.data && userQuery?.data;
  let isLoading = publicGroupsQuery?.loading || userQuery?.loading;
  let showLoader = joinPublicGroupRes?.loading || (!hasAllData && isLoading);

  // const updateGroup = async () => {
  //   setUpdating(true);
  //   const input = {
  //     groups: [...user?.groups, group],
  //   };
  //   console.log(input);
  //   try {
  //     await mutate({ variables: { input } });
  //     setUpdating(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className={styles.group}>
      {showLoader && <Loader />}
      {publicGroups.map(group => (
        <div>
          <div className={styles.group_top}>
            <div className={styles.button_container}>
              <Button
                type="plus"
                type1="button"
                size="small"
                disabled={group.iAmMember}
                buttonStyle={group.iAmMember ? "gray" : "primary"}
                onClick={() => {
                  let variables = {
                    id: group.id,
                  };
                  joinPublicGroup({ variables });
                }}
              />
            </div>
            <div className={styles.info_container}>
              <h2>{group.name}</h2>
              <p>
                Admin:{" "}
                <span>
                  {group.createdByUser.given_name}
                  {group.createdByUser.family_name}
                </span>
              </p>
            </div>
          </div>
          <div className={styles.group_bottom}>
            <p style={{}}>{group.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
