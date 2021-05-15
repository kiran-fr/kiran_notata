import React, { useEffect, useState } from "react";
import { Dropdown } from "Components/UI_Kits/Dropdown/index";
import styles from "./modal.module.css";
// import Funnel from "assets/images/funnel.png";
import Modal from "./modal";

// common dynamic funnel img function
import { DynamicIcons } from "../../../NewDesign/CommonFunctions";

import { useQuery } from "@apollo/client";
import { funnelGroupGet } from "private/Apollo/Queries";

export default function AddFunnel({ close }) {
  const [selectedGroup, setSelectedGroup] = useState();
  const [funnelGroupArray, setFunnelGroupArray] = useState([]);

  // Query: getfunnelGroup
  const { data, called, loading, error, fetchMore } = useQuery(funnelGroupGet);

  const funnelGroup = data ? data.accountGet.funnelGroups : [];

  useEffect(() => {
    setFunnelGroupArray(funnelGroup);
  }, [funnelGroup.length]);

  const FunnelStage = funnelGroupName => {
    let filterData = funnelGroupArray.filter(
      data => data.name === funnelGroupName
    );
    return (
      <ul className={styles.funnelUl}>
        {funnelGroupArray.length ? (
          funnelGroupArray.map(item => (
            <>
              {item.funnelTags.length &&
                item.funnelTags.map((data, index) => (
                  <li key={index}>
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
    <Modal title="Set Funnel Stage" closeModal={close}>
      <div className={styles.group}>
        <div className={styles.groupChild + " " + styles.groupFunnelChild}>
          <div style={{ marginBottom: "30px" }}>
            {selectedGroup ? (
              <h2 className="mb-5">
                {selectedGroup}
                <i
                  style={{ cursor: "pointer" }}
                  className="fas fa-times-circle"
                ></i>{" "}
                <FunnelStage funnelGroupName={selectedGroup} />
              </h2>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className={styles.groupChild}>
          <h2>Add new funnel</h2>
          <div className={styles.groupDropContainer}>
            <Dropdown items={funnelGroupArray} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
