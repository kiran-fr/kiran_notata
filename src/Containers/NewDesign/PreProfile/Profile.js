/* eslint-disable */
import React, { useState, useEffect } from "react";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
// import Page4 from "./Page4";
import { Content } from "Components/elements/";
import { Tabsection, Button } from "Components/UI_Kits";
import styles from "./Profile.module.css";
import { useTransition, animated } from "react-spring";

export function ProfileContent({ history, skipLast }) {
  const [page, setPage] = useState(1);
  const [extraInputs, setExtraInputs] = useState({ interests: [], skills: [] });
  const [render, setRender] = useState(false);

  const transition = useTransition(page, {
    from: { x: -110, y: 0, opacity: 0, height: "auto" },
    enter: { x: 0, y: 0, opacity: 1 },
  });

  useEffect(() => {
    setRender(!render);
  }, [page]);

  return (
    <>
      <div className={styles.tabs_section}>
        {!skipLast && (
          <div
            className={
              page === 1
                ? styles.tabs_section_child_active
                : styles.tabs_section_child
            }
            onClick={() => setPage(1)}
          />
        )}
        {!skipLast && (
          <div
            className={
              page === 2
                ? styles.tabs_section_child_active
                : styles.tabs_section_child
            }
            onClick={() => setPage(2)}
          />
        )}

        {!skipLast && (
          <div
            className={
              page === 3
                ? styles.tabs_section_child_active
                : styles.tabs_section_child
            }
            onClick={() => setPage(3)}
          />
        )}
      </div>
      <div>
        {transition((style, item) =>
          item === 1 ? (
            <animated.div style={style} className="item">
              <Page1 history={history} setPage={setPage} skipLast />
            </animated.div>
          ) : item === 2 ? (
            <animated.div style={style} className="item">
              <Page2
                extraInputs={extraInputs}
                setExtraInputs={setExtraInputs}
                skipLast={skipLast}
                setPage={setPage}
              />
            </animated.div>
          ) : (
            item === 3 && (
              <animated.div style={style} className="item">
                <Page3
                  extraInputs={extraInputs}
                  setExtraInputs={setExtraInputs}
                  setPage={setPage}
                  history={history}
                />
              </animated.div>
            )
          )
        )}
      </div>
    </>
  );
}

export function PreProfile({ history }) {
  return (
    <div className={styles.profile_onboard}>
      <div className={styles.strip}>Great! You are in.</div>
      <Content
        maxWidth={600}
        style={{
          padding: "20px",
          marginTop: "-20px",
        }}
      >
        <ProfileContent history={history} />
      </Content>
    </div>
  );
}
