import React from "react";

import TextInput from "./TextInput";
import MultipleTextInput from "./MultipleTextInput";
import SingleChoiceInput from "./SingleChoiceInput";
import MultipleChoiceInput from "./MultipleChoiceInput";
import TrafficLights from "./TrafficLight";

export function GeneralInput(props) {
  switch (props.question.inputType) {
    case "CHECK":
      return <MultipleChoiceInput {...props} />;
    case "RADIO":
      return <SingleChoiceInput {...props} />;
    case "INPUT_TEXT":
      return <TextInput {...props} />;
    case "INPUT_MUTLIPLE_LINES":
      return <MultipleTextInput {...props} />;
    case "TRAFFIC_LIGHTS":
      return <TrafficLights {...props} />;
    default:
      return <MultipleChoiceInput {...props} />;
  }
}
