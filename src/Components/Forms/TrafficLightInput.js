import React from "react";
import styled from "styled-components";

import { InputTrafficLight } from "../elements";

const TrafficLightsWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export default function TrafficLightInput({ value, handleOnClick }) {
  return (
    <form className="notata_form">
      <TrafficLightsWrapper>
        {["red", "yellow", "green"].map(color => (
          <InputTrafficLight
            key={color}
            color={color}
            active={value === color}
            onClick={() => handleOnClick(color)}
          />
        ))}
      </TrafficLightsWrapper>
    </form>
  );
}
