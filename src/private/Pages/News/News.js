import React from "react";
import "./News.scss";
import like from "../../../assets/images/like.png";
import dislike from "../../../assets/images/dislike.png";
import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { newsGet, userGet } from "../../Apollo/Queries";
import { newsSet } from "../../Apollo/Mutations";
import { GhostLoader } from "../../../Components/elements";
import { new_news, edit_news } from "../../../definitions";

function EachNews({ data, history }) {
  const [setUseful] = useMutation(newsSet);

  return (
    <div className="card news-container__card">
      <div className="card-heading news-container__card__heading">
        {data.title}

        {data.canEdit && (
          <i
            className="fas fa-pen edit-icon"
            onClick={() => {
              history.push(`${edit_news}/${data?.id}`);
            }}
          />
        )}
      </div>

      {data.image && (
        <div className="row">
          <div className="col-xs-12 col-sm-4 col-md-4 col-sm-push-8 col-md-push-8">
            <div className="news-container__card__news__img">
              <img src={data.image} />
            </div>
          </div>
          <div className="col-xs-12 col-sm-8 col-md-8 col-sm-pull-4 col-md-pull-4">
            <p className="news-container__card__news news-container__card__news__partition">
              {data.content}
            </p>
          </div>
        </div>
      )}

      {!data.image && (
        <p className="news-container__card__news news-container__card__news__partition">
          {data.content}
        </p>
      )}

      <div className="news-container__card__footer">
        <div className="news-container__card__footer__like-dislike">
          <div className="news-container__card__footer__like-dislike__text">
            Did you find this article useful?
          </div>
          <div className="news-container__card__footer__like-dislike__icons">
            <img
              className={data.isItUseful === false ? "disabled" : "enabled"}
              src={like}
              onClick={() => {
                let variables = {
                  id: data.id,
                  useful: true,
                };
                let optimisticResponse = {
                  newsSet: {
                    ...data,
                    isItUseful: true,
                  },
                };
                setUseful({
                  variables,
                  optimisticResponse,
                });
              }}
            />
            <img
              className={data.isItUseful === true ? "disabled" : "enabled"}
              src={dislike}
              onClick={() => {
                let variables = {
                  id: data.id,
                  useful: false,
                };
                let optimisticResponse = {
                  newsSet: {
                    ...data,
                    isItUseful: false,
                  },
                };
                setUseful({
                  variables,
                  optimisticResponse,
                });
              }}
            />
          </div>
        </div>
        <div className="news-container__card__footer__news-by">
          <div className="news-container__card__footer__news-by__date">
            {moment(data.createdAt).format("ll")}
          </div>
          <div className="news-container__card__footer__news-by__name">
            {data.createdByUser?.given_name} {data.createdByUser?.family_name}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function News({ history }) {
  const userQuery = useQuery(userGet);

  const { data, loading } = useQuery(newsGet);
  let news = data?.newsGet || [];

  if (!data && loading) {
    return <GhostLoader />;
  }

  let canEditNews = userQuery?.data?.userGet?.canEditNews;

  return (
    <>
      <div className="header-routing">
        <span className="header-routing__highlight">News</span>
      </div>
      <div className="news-container">
        <div className="news-container__main">
          <div className="news-container__heading">
            <span>News</span>
            {canEditNews && (
              <i
                className="fas fa-plus-circle new-icon"
                onClick={() => {
                  history.push(new_news);
                }}
              />
            )}
          </div>

          {news.map(data => (
            <EachNews id={data.id} data={data} history={history} />
          ))}
        </div>
      </div>
    </>
  );
}
