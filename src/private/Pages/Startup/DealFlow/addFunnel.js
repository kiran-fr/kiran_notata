import React, { useEffect, useState } from "react";
import { Dropdown } from "Components/UI_Kits/Dropdown/index";
import styles from "./modal.module.css";
import { Loader } from "Components/UI_Kits";

// common dynamic funnel img function
import { DynamicIcons } from "../../../Pages/CommonFunctions";

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

  // maintain the funnel group (funnels.length >0)
  useEffect(() => {
    const newArr = funnelGroup.filter(items => items.funnelTags.length > 0);
    setFunnelGroupArray(newArr);
  }, [funnelGroup.length]);

  // clear the value in state if user choose the new funnel group
  useEffect(() => {
    setFunnelName("");
    setFunnelID("");
  }, [selectedGroupId]);

  // maintain funnel id and name. trigge the api
  const handleFunnel = value => {
    setFunnelName(value.name);
    setFunnelID(value.id);
    props.updateFunnelTag(value.id, props.companyId);
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
                    <div>
                      <p>{data.name}</p>
                    </div>
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.group}>
      <div className={styles.groupChild + " " + styles.groupFunnelChild}>
        <div style={{ marginBottom: "30px" }}>
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
