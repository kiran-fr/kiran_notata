import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  title,
  icons,
  info_container,
  info,
  expand_class,
  progress_bar_wrapper
} from "./TopSection.module.css";

import EvaluationProgressBar from "../../../elements/EvaluationProgressBar";

const TopSection = ({ item, it, expand, expanded, scores, unseen }) => {
  let url;
  if (item.organization.info_website && item.organization.info_website[0].url) {
    url = item.organization.info_website[0].url;
  }

  let progress, total, potential;
  if (scores && scores.length) {
    progress = Math.round(
      scores.reduce((total, s) => {
        let tot = parseInt(total) || total.progress || 0;
        return tot + parseInt(s.progress);
      }) / scores.length
    );

    total = scores.reduce((total, s) => {
      let tot = parseInt(total) || total.score || 0;
      return tot + s.score;
    });

    potential = scores.reduce((total, s) => {
      let tot = parseInt(total) || total.potential || 0;
      return tot + s.potential;
    });
  }

  return (
    <div style={{ cursor: "pointer" }} onClick={expand}>
      <div className={title} style={{ fontWeight: unseen ? 600 : 300 }}>
        {item.sharedByEmail && (
          <i
            className="fas fa-share-alt"
            style={{
              fontSize: "18px",
              // color: '#0088ff',
              color: "rgb(134, 179, 218)",
              marginLeft: "-10px",
              position: "relative"
            }}
          />
        )}
        <span> {item.organization.name}</span>
        <div className={icons}>
          {url && (
            <a href={url} target="_blank">
              <i className="fal fa-external-link-square" />
            </a>
          )}
        </div>
      </div>

      {progress !== undefined && (
        <div className={progress_bar_wrapper}>
          <EvaluationProgressBar
            percent={progress}
            total={total}
            potential={potential}
          />
        </div>
      )}

      <div className={info_container}>
        <div>
          <span>{moment(item.updatedAt || item.createdAt).format("ll")}</span>

          {item.userInfo && (
            <span>
              {(!item.userInfo.given_name && !item.userInfo.family_name && (
                <span> - {item.userInfo.email}</span>
              )) || (
                <span>
                  <span> -</span>
                  {item.userInfo.given_name && (
                    <span> {item.userInfo.given_name}</span>
                  )}
                  {item.userInfo.family_name && (
                    <span> {item.userInfo.family_name}</span>
                  )}
                </span>
              )}
            </span>
          )}

          {item.sharedByEmail && (
            <span>
              <span> - {item.sharedByEmail}</span>
            </span>
          )}
        </div>

        <div className={info}>
          {(item.comments_puma && item.comments_puma !== 0 && (
            <div>Subjective score: {item.comments_puma}</div>
          )) || <span />}
        </div>
      </div>
    </div>
  );
};

export default TopSection;
