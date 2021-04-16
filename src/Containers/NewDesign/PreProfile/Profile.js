import React, { useState, useEffect } from "react";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
// import Page4 from "./Page4";
import { Content } from "Components/elements/";
import { Tabsection } from "Components/UI_Kits";

export default function PreProfile({ history }) {
  const [page, setPage] = useState(1);
  const [extraInputs, setExtraInputs] = useState({ interests: [], skills: [] });
  const [render, setRender] = useState(false);

  const handleTab = value => {
    setPage(value);
  };

  useEffect(() => {
    setRender(!render);
  }, [page]);

  return (
    <Content
      maxWidth={600}
      style={{
        padding: "20px",
        marginTop: "-20px",
      }}
    >
      <Tabsection
        tabValue={page}
        tabFuc={data => handleTab(data)}
        tabArr={[
          {
            value: 1,
            text: "p",
          },
          {
            value: 2,
            text: "w",
          },
          {
            value: 3,
            text: "g",
          },
        ]}
      />
      {page === 1 && <Page1 history={history} setPage={setPage} />}

      {page === 2 && (
        <Page2
          extraInputs={extraInputs}
          setExtraInputs={setExtraInputs}
          setPage={setPage}
        />
      )}

      {page === 3 && (
        <Page3
          extraInputs={extraInputs}
          setExtraInputs={setExtraInputs}
          setPage={setPage}
        />
      )}

      {/* {page === 4 && (
        <Page4 extraInputs={extraInputs} history={history} setPage={setPage} />
      )} */}
    </Content>
  );
}
