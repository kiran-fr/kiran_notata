import React from "react";
import StartupCard from "./StartupCard";

export default function StartupList({ group, history }) {
  return (
    <>
      {group.startups?.map((startup, i) => (
        <StartupCard
          key={`startup-${i}`}
          group={group}
          startup={startup}
          history={history}
        />
      ))}
    </>
  );
}
