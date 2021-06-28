import React, { useEffect } from "react";
import "./News.scss";
import like from "../../../assets/images/like.png";
import dislike from "../../../assets/images/dislike.png";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { newsGet, newsGetOne } from "../../Apollo/Queries";
import { newsSet } from "../../Apollo/Mutations";
import { GhostLoader } from "../../../Components/elements";
import { edit_news } from "../../../definitions";

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
              history.push(`${edit_news}/${data.id}`);
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

export default function NewsViewOne({ history, match }) {
  const [getOneNews, { data, loading }] = useLazyQuery(newsGetOne);
  let news = data?.newsGetOne;

  useEffect(() => {
    if (match?.params?.id) {
      getOneNews({ variables: { id: match.params.id } });
    }
  }, [match]);

  if (!news) {
    return <GhostLoader />;
  }

  return (
    <div className="news-container">
      <div className="news-container__main">
        <EachNews id={news?.id} data={news} history={history} />
      </div>
    </div>
  );
}
