import React, { useEffect, useRef } from "react";


export const FunnelPopup = ({ 
  tags,
  id,
  index,
  setShowFunnel,
  setFunnel,
  updateFunnelTag,
  sortArr,
  DynamicIcons,
  styles
}) => {

    const updateFunnelTagForConnection = funnelTagId => {
      updateFunnelTag(funnelTagId, id);
      setFunnel(false);
      setShowFunnel(false);
    };

    const popup = useRef();

    useEffect(() => {
      const handleGlobalEvent = e =>
        !e.path.includes(popup.current) ? setShowFunnel(false) : null;

      window.addEventListener("click", handleGlobalEvent);

      return () => {
        window.removeEventListener("click", handleGlobalEvent);
      };
    });

    const tagSort = sortArr(tags);

    return (
      <div
        ref={popup}
        className={styles.funnelPopup}
        style={{ top: index > 20 ? "-400%" : `50px` }}
      >
        <ul>
          {tagSort?.map((tag, index) => (
            <li
              key={tag.id}
              onClick={() => updateFunnelTagForConnection(tag.id)}
            >
              <img src={DynamicIcons(index)} alt="" /> {tag.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };

export const StartupPreview = ({ no, companyName, oneLiner, problem, styles }) => (
  <div className={styles.startupPreview} style={{ top: `${no + 56}px` }}>
    <h1>{companyName}</h1>
    {oneLiner && (
      <>
        <h3>{oneLiner.questionName}</h3>
        <p>{oneLiner.val}</p>
      </>
    )}
    {problem && (
      <>
        <h3>{problem.questionName}</h3>
        <p>{problem.val}</p>
      </>
    )}
  </div>
);