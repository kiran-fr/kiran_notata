// Created By : Siva
// Date : 6/04/2021

import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CardHeader from "@material-ui/core/CardHeader";
import "./style.css";

export function Blocks({
  tabValue,
  handleTabChange,
  primaryTxt,
  secondaryTxt,
  text1,
  text2,
  text3,
  text4,
  image1,
  image2,
  image3,
  image4,
  img1Alt,
  img2Alt,
  img3Alt,
  img4Alt,
}) {
  return (
    <Card className="width">
      <CardHeader
        title={
          <Tabs
            value={tabValue}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleTabChange}
            aria-label="disabled tabs example"
          >
            <Tab value={1} label={primaryTxt} />
            <Tab value={2} label={secondaryTxt} />
          </Tabs>
        }
      />
      <CardContent>
        <div className="cardContent">
          <img
            src={tabValue === 1 ? image3 : image1}
            alt={tabValue === 1 ? img3Alt : img1Alt}
            width="40"
            height="40"
          ></img>
          <div>{tabValue === 1 ? text1 : text3}</div>
        </div>
        <hr className="underline" />
        <div className="cardContent">
          <img
            src={tabValue === 1 ? image2 : image4}
            alt={tabValue === 1 ? img2Alt : img4Alt}
            width="40"
            height="40"
          ></img>
          <div>{tabValue === 1 ? text2 : text4}</div>
        </div>
      </CardContent>
    </Card>
  );
}
