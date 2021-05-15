import React, { useEffect, useState } from "react";
import { Dropdown } from "Components/UI_Kits/Dropdown/index";
import styles from "./modal.module.css";
// import Funnel from "assets/images/funnel.png";

// common dynamic funnel img function
import { DynamicIcons } from "../../../NewDesign/CommonFunctions";

import { useQuery } from "@apollo/client";
import { funnelGroupGet } from "private/Apollo/Queries";

export default function AddFunnel(props) {
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [funnelGroupArray, setFunnelGroupArray] = useState([]);
  const [funnelName, setFunnelName] = useState("");
  const [funnelID, setFunnelID] = useState("");

  // Query: getfunnelGroup
  const { data, called, loading, error, fetchMore } = useQuery(funnelGroupGet);

  const funnelGroup = data ? data.accountGet.funnelGroups : [];

  useEffect(() => {
    setFunnelGroupArray(funnelGroup);
  }, [funnelGroup.length]);

  const handleFunnel = value => {
    setFunnelName(value.name);
    setFunnelID(value.id);
    if (props.setFunnelId) {
      props.setFunnelId(value.id);
    }
  };

  const FunnelStage = () => {
    let filterData = funnelGroupArray.filter(
      data => data.id === selectedGroupId
    );

    return (
      <ul className={styles.funnelUl}>
        {filterData.length ? (
          filterData.map(item => (
            <>
              {item.funnelTags.length &&
                item.funnelTags.map((data, index) => (
                  <li key={index} onClick={() => handleFunnel(data)}>
                    <div className={styles.image}>
                      <img src={DynamicIcons(index, "filter")} alt="" />
                    </div>
                  </li>
                ))}
            </>
          ))
        ) : loading ? (
          <i className={"fa fa-spinner fa-spin"} />
        ) : (
          ""
        )}
      </ul>
    );
  };

  return (
    <div className={styles.group}>
      <div className={styles.groupChild + " " + styles.groupFunnelChild}>
        <div style={{ marginBottom: "30px" }}>
          <h2 className="mb-5">
            {funnelName ? (
              <>
                {funnelName}
                <i
                  onClick={() => setFunnelName("")}
                  style={{ cursor: "pointer" }}
                  className="fas fa-times-circle"
                ></i>
              </>
            ) : (
              ""
            )}
            {selectedGroupId ? <FunnelStage /> : ""}
          </h2>
        </div>
      </div>
      <div className={styles.groupChild}>
        <h2>Add new funnel</h2>
        <div className={styles.groupDropContainer}>
          <Dropdown items={funnelGroupArray} setSelected={setSelectedGroupId} />
        </div>
      </div>
    </div>
  );
}
