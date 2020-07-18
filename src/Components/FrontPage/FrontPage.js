import React, { useRef, Component } from "react";

import { container, subline, login_class } from "./FrontPage.module.css";
import {
  color1_bg,
  color2_bg,
  color3_bg,
  color4_bg,
  color5_bg,
  color6_bg,
  color7_bg,
  color8_bg,
  color9_bg
} from "../elements/Colors.module.css";
import classnames from "classnames";
import { login } from "../../routes";
import { Link } from "react-router-dom";

const c = [
  "#2f6e7b",
  "#c76553",
  "#b9425f",
  "#52a99e",
  "#b95055",
  "#da752a",
  "#3b8276",
  "#363b54",
  "#7c8c2a"
];

const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop)   


export const FrontPage = () => {

  const myRef = useRef(null)

  let color__1 = c[3];
  let color__2 = c[0];

  return (
    <div>
      <div
        className={classnames(container)}
        style={{
          background: `linear-gradient(${color__1}, ${color__2})`
        }}
        >

        <div
          onClick={() => scrollToRef(myRef)}
          style={{
            position: 'absolute',
            cursor: 'pointer',
            color: 'white',
            top: '14px',
            left: '18px'


          }}
          >
          about
        </div>

        <div style={{ position: "relative", top: "-50px" }}>
          <h1>notata</h1>
          <div className={subline}>for investors and startups</div>
        </div>
   

        <Link className={login_class} to={login}>
          <i className="fal fa-fingerprint" />
        </Link>

      </div>


      <div
        style={{
          background: color__2,
          borderTop: "1px dashed rgba(255,255,255,0.2)",
          textAlign: "center",
          padding: "25px",
          paddingTop: "100px",
          paddingBottom: "100px",
          color: "white"
        }}
        ref={myRef}        
        >


        <div
          
          style={{
            maxWidth: "680px",
            margin: "auto",
            textAlign: "left"          
          }}
          >

          <h1 style={{color: "white"}}>About</h1>

          <p style={{color: "white", fontSize: "18px"}}>
            Notata is a software where investors can evaluate startups and share deals.
          </p>

          <p style={{color: "white", fontSize: "18px"}}>
            The software was developed for a small Norwegian family office that struggled to find the right tools to help them evaluate startups in a structured way. As an early stage investor it was also important to be able to share good deals with other investors in the network.
          </p>            

          <p style={{color: "white", fontSize: "18px"}}>
            {
              // Notata is a platform that makes it dead easy to evaluate startup and share deals with your network. 
            }
            Our system is designed to be the first part of your funnel, and will smothly integrate with your favorite softwares, making it dead easy to share information betweem systems.
          </p>

          <p style={{color: "white", fontSize: "18px"}}>
            We aim to be a networking platform for investors, where people can safely share sensitive information with people in their network.
          </p>

          <p style={{color: "white", fontSize: "18px"}}>
            If you are interested please drop us a line so that we can show you a demo.
          </p>

          <p style={{color: "white", fontSize: "18px"}}>
            Ane Nordahl Carlsen, CEO<br/>
            ane@ataton.no
          </p>            

        </div>

      </div>

    </div>
  );
}



