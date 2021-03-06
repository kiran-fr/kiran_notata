import React from "react";

export const Loader = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "rgba(255,255,255,0.5)",
        zIndex: 99999,
        left: 0,
        top: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
        color: "var(--ui-color-primary-green-dark2)",
      }}
    >
      <i className="fa fa-spinner fa-spin" />
    </div>
  );
};
