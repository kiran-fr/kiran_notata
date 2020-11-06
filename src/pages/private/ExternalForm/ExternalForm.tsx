import React, { useState } from "react";
import { Card } from "Components/elements/NotataComponents/Card";
import { SuccessBox } from "Components/elements/NotataComponents/SuccessBox";
import { useQuery } from "@apollo/client";
import accountGet from "Apollo/Queries/accountGet";
import { GhostLoader } from "Components/elements/NotataComponents/GhostLoader";
import { Content } from "Components/elements/NotataComponents/Content";

import styles from "pages/private/StartupPage/Facts/Facts.module.css";


export default function ExternalForm() {
  const [copySuccess, setCopySuccess] = useState(false);

  const accountQuery = useQuery(accountGet);

  let account = accountQuery.data?.accountGet || {};

  const loading: boolean = accountQuery.loading;

  if (loading && !accountQuery.data) return <GhostLoader/>;

  const iFrameUrl: string = `${window.location.protocol}//${window.location.host}/public/${account.id}/form.html`;
  const iFrameContent = `<iframe src="${iFrameUrl}" 
    style="position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border: none;"></iframe>`;

  function copyToClipboard() {
    navigator.clipboard.writeText(iFrameContent);
    setCopySuccess(true);
  }

  return (
    <Content maxWidth={600}>
      <Card style={{ paddingBottom: "20px" }}>
        <div className={styles.share_title}>External Web Form</div>

        <div className={styles.share_text}>
          This external form can be posted on the company's website, please copy
          and paste the code below. Information about new submitted startups
          will be displayed in your inbox.
        </div>


        <div
          style={{
            marginBottom: '20px'
          }}
          >

          <div>Link</div>



          <SuccessBox
            style={{
              padding: "5px",
              fontSize: "12px",
              color: "var(--color-secondary)",
            }}
            className=""
            key=""
            title=""
          >
          <a
            href={iFrameUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{fontSize: "12px"}}
            >
            {iFrameUrl}
          </a>
          </SuccessBox>          

        </div>


        <div
          style={{
            marginBottom: '20px'
          }}        
          >

          <div>Embed</div>

          <SuccessBox
            style={{
              padding: "5px",
              fontSize: "12px",
              color: "var(--color-secondary)",
            }}
            className=""
            key=""
            title=""
          >
            {iFrameContent}
          </SuccessBox>

          <div
            style={{textAlign: "right"}}
            className={styles.copy_link}
            onClick={copyToClipboard}
            >
            {copySuccess ? "code copied to clipboard" : "copy code"}
          </div>

        </div>

      </Card>
    </Content>
  );
}



