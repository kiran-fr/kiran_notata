import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

const TextArea = styled.textarea`
  height: ${({ scrollHeight }) =>
    scrollHeight ? `${scrollHeight}px` : "auto"};
  overflow-y: hidden;
`;

export default function AutoHeightTextArea(props) {
  const [scrollHeight, setScrollHeight] = useState(0);
  const textareaRef = useRef();

  useEffect(() => {
    if (textareaRef) {
      setScrollHeight(textareaRef.current.scrollHeight);
    }
  }, [textareaRef]);

  return (
    <TextArea
      {...props}
      ref={textareaRef}
      scrollHeight={scrollHeight}
      onInput={() => {
        setScrollHeight(textareaRef.current.scrollHeight);
      }}
    />
  );
}
