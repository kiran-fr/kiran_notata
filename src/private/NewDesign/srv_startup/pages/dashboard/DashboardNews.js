import React from "react";
import { useQuery } from "@apollo/client";
import { newsGet } from "../../../../Apollo/Queries";
import moment from "moment";
import { news, news_view_one } from "../../../../../definitions";
import { Loader } from "../../../../../Components/elements";

export default function DashboardNews({ history }) {
  const { data, loading } = useQuery(newsGet);

  return (
    <div className="card dashboard-container__news">
      <div className="dashboard-container__news__card-heading">News</div>

      {!data && loading && <Loader />}

      {data?.newsGet?.slice(0, 3).map(newsItem => (
        <div key={newsItem.id}>
          <div className="dashboard-container__news__date">
            {moment(newsItem.createdAt).format("ll")}
          </div>
          <div className="dashboard-container__news__news">
            <div className="dashboard-container__news__news__heading">
              {newsItem.title}
            </div>
            <div className="dashboard-container__news__news__detail">
              {newsItem.content.substring(0, 100)}...
            </div>
          </div>
          <div className="dashboard-container__news__footer">
            <div className="dashboard-container__news__footer__name">
              {newsItem.createdBy?.given_name} {newsItem.createdBy?.family_name}{" "}
            </div>
            <div
              className="dashboard-container__news__footer__learn-more"
              onClick={() => {
                history.push(`${news_view_one}/${newsItem.id}`);
              }}
            >
              Learn more
            </div>
          </div>
        </div>
      ))}

      <div
        className="dashboard-container__news__more-news"
        onClick={() => {
          history.push(news);
        }}
      >
        More news
      </div>
    </div>
  );
}
