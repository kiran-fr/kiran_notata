import React, { useState } from "react";
import styles from "./table.css";
import Red from "../../../../../../assets/images/red.png";
import Green from "../../../../../../assets/images/green.png";
import Imag from "../../../../../../assets/images/struplog.png";
// import Arrow from "../../../../../assets/images/arrow.png";
// import AddTag from "private/NewDesign/Main/Connections/DealFlow/addTag";
// import AddGroup from "private/NewDesign/Main/Connections/DealFlow/addGroup";
// import AddFunnel from "private/NewDesign/Main/Connections/DealFlow/addFunnel";
// import AddScore from "private/NewDesign/Main/Connections/DealFlow/addScore";
// import AddStartup from "private/NewDesign/Main/Connections/DealFlow/addStartup";

export default function Table() {
  const [preview, setPreview] = useState();
  const [funnel, setFunnel] = useState();
  const [checkPopup, setCheckPopup] = useState();
  const [modal, setModal] = useState();

  const StartupPreview = ({ no }) => (
    <div className={styles.startupPreview} style={{ top: `${95 + 56 * no}px` }}>
      <h1>Great Startup Inc</h1>
      <h3>Company One-liner</h3>
      <p>
        Great Startup is a simple tool for investors to evaluate startups and
        engage their network
      </p>
      <h3>Problem</h3>
      <p>
        It's hard to avoid unconscious bias when investing in early stage
        startups. A systematic approach to evaluate companies has proven to
        increase the return of investment. Most online platforms are focused on
        startups, while tools for investors are often complicated, expensive and
        lack sharing capabilites. Entering the market as a new investor is
        difficult without open access to a network. Notata is the only tool
        which offers deal flow management, collaboration and sharing between
        investors.
      </p>
    </div>
  );
  const FunnelPopup = ({ no }) => (
    <div className={styles.funnelPopup}>
      <div className={styles.floatingArrow}>
        <i className="fas fa-chevron-down"></i>
      </div>
      <ul onClick={() => setFunnel(false)}>
        <li>
          {" "}
          <img src={Red} /> Reviewed
        </li>
        <li>
          {" "}
          <img src={Red} /> Analyzed
        </li>
        <li>
          {" "}
          <img src={Green} /> Met
        </li>
      </ul>
    </div>
  );

  const CheckboxPopup = ({ no }) => (
    <div className={styles.checkboxPopup} style={{ top: `${24 + 56 * no}px` }}>
      <ul onClick={() => setCheckPopup(null)}>
        <li>Delete from Dealflow</li>
        <li onClick={() => setModal("group")}>Add to group</li>
        <li onClick={() => setModal("tags")}>Add tags</li>
      </ul>
    </div>
  );

  const showPreview = no => {
    console.log(no);
    setPreview(no);
  };
  const hidePreview = ({ no }) => {
    setPreview(null);
  };
  const handleCheckChange = no => {
    if (checkPopup === no) return setCheckPopup(null);
    setCheckPopup(no);
  };
  const ButtonGreen = ({ type }) => (
    <button className={styles.buttongreen} onClick={() => setModal(type)}>
      <i className="fas fa-plus-circle"></i>
    </button>
  );

  const heading = [
    "COMPANY NAME",
    "GROUPS",
    "FUNNEL STAGE",
    "TAGS",
    "SUBJECTIVE SCORE",
    "UPDATED",
    "LAST EVALUATION",
    "AFTER PITCHING",
  ];
  return (
    <div className={styles.tableOuterWrapper}>
      <div className={styles.tableWrapper}>
        <table className={styles.startupTable}>
          <thead>
            <tr>
              <td>
                <label className={styles.customCheck} style={{ top: "-8px" }}>
                  <input type="checkbox" />
                  <span class={styles.checkmark}></span>
                </label>
              </td>
              <td className={styles.tdCompany}>
                <p>COMPANY NAME</p>
              </td>
              <td className={styles.tdGroup}>
                <p>GROUPS</p>
              </td>
              <td className={styles.tdFunnel}>
                <p>FUNNEL STAGE</p>
              </td>
              <td className={styles.tdTags}>
                <p>TAGS</p>
              </td>
              <td className={styles.tdSubjective}>
                <p>
                  SUBJECTIVE <br /> SCORE
                </p>
              </td>
              <td className={styles.tdUpdate}>
                <p>UPDATED</p>
              </td>
              <td className={styles.tdEvaluation}>
                <p>
                  LAST <br /> EVALUATION
                </p>
              </td>
              <td className={styles.tdPitching}>
                <p>
                  AFTER <br /> PITCHING
                </p>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <label className={styles.customCheck}>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckChange(0)}
                  />
                  <span class={styles.checkmark}></span>
                </label>
                <div className={styles.favStartup}>
                  {" "}
                  <i class="fas fa-star"></i>
                </div>
                {checkPopup === 0 && <CheckboxPopup no={0} />}
              </td>
              <td
                className={styles.tdCompany}
                onMouseOver={() => showPreview(0)}
                onMouseLeave={hidePreview}
              >
                <img src={Imag} /> Great Startup Inc
                {preview === 0 && <StartupPreview no={0} />}
              </td>
              <td className={styles.tdGroup}>
                Group1, Big Group 2 <ButtonGreen type="group" />{" "}
              </td>
              <td className={styles.tdFunnel}>
                <div className={styles.startupStatus}>
                  <img src={Red} /> Reviewed{" "}
                  <span onClick={() => setFunnel(0)}>
                    <i class="fas fa-chevron-down"></i>
                  </span>
                  {funnel === 0 && <FunnelPopup />}
                </div>
              </td>
              <td className={styles.tdTags}>
                <ul>
                  <li>
                    <span>MedTech</span>
                  </li>
                  <li>
                    <span>OceanTech</span> ...
                  </li>
                  <li>
                    <ButtonGreen type="tags" />
                  </li>
                </ul>
              </td>
              <td className={styles.tdSubjective}>
                <ButtonGreen type="score" />
              </td>
              <td className={styles.tdUpdate}>
                <span className={styles.olderThan}>Older than 2 month</span>
              </td>
              <td className={styles.tdEvaluation}>
                65%{" "}
                <span>
                  {" "}
                  <i className="fas fa-pen"></i>
                </span>
              </td>
              <td className={styles.tdPitching}>
                65%{" "}
                <span>
                  {" "}
                  <i className="fas fa-pen"></i>
                </span>
              </td>
            </tr>

            {/* BELOW CODE FOR TESTING PREVIEW PURPOSE */}
            <tr>
              <td>
                <label className={styles.customCheck}>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckChange(1)}
                  />
                  <span class={styles.checkmark}></span>
                </label>
                <div className={styles.favStartup}>
                  {" "}
                  <i class="fas fa-star"></i>
                </div>
                {checkPopup === 1 && <CheckboxPopup no={1} />}
              </td>
              <td
                className={styles.tdCompany}
                onMouseOver={() => showPreview(1)}
                onMouseLeave={hidePreview}
              >
                {" "}
                <img src={Imag} /> Great Startup Inc
                {preview === 1 && <StartupPreview no={1} />}
              </td>
              <td className={styles.tdGroup}>
                Group1, Big Group 2 <ButtonGreen />{" "}
              </td>
              <td className={styles.tdFunnel}>
                <div className={styles.startupStatus}>
                  <ButtonGreen type="funnel" />
                </div>
              </td>
              <td className={styles.tdTags}>
                <ul>
                  <li>
                    <span>MedTech</span> <span>MedTech</span> ...
                  </li>
                  <li>
                    <ButtonGreen />
                  </li>
                </ul>
              </td>
              <td className={styles.tdSubjective}>
                8,5{" "}
                <span>
                  {" "}
                  <i className="fas fa-pen"></i>
                </span>
              </td>
              <td className={styles.tdUpdated}>Jan 25, 2020</td>
              <td className={styles.tdEvaluation}>
                <ButtonGreen type="score" />
              </td>
              <td className={styles.tdPitching}>
                65%{" "}
                <span>
                  {" "}
                  <i className="fas fa-pen"></i>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {
        // modal === "tags" ? <AddTag closeModal={setModal} /> :
        // modal === "group" ? <AddGroup closeModal={setModal} /> :
        // modal === "funnel" ? <AddFunnel closeModal={setModal} /> :
        // modal === "score" ? <AddScore closeModal={setModal} /> : null
      }
    </div>
  );
}
