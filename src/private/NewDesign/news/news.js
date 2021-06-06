import React from "react";
import "./news.scss";
import like from "../../../assets/images/like.png";
import dislike from "../../../assets/images/dislike.png";
import newsImg from "../../../assets/images/news-img.png";
import MultiSelect from "../srv_startup/pages/ui-kits/multi-select";
import uploadImage from "../../../assets/images/news-upload.png";
import ButtonWithIcon from "../srv_startup/pages/ui-kits/button-with-icon";
import { ICONPOSITION } from "../srv_startup/pages/constants";
import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { newsGet } from "../../Apollo/Queries";
import {
  newsSet,
  newsCreate,
  newsUpdate,
  newsDelete,
} from "../../Apollo/Mutations";
import { GhostLoader } from "../../../Components/elements";
import { new_news, edit_news } from "../../../definitions";

const locations = [
  { label: "USA", value: 1 },
  { label: "Europe", value: 2 },
  { label: "Norway", value: 3 },
];
const interests = [
  { label: "medecine", value: 1 },
  { label: "farmacy", value: 2 },
  { label: "finance", value: 3 },
];

function EachNews({ data, history }) {
  const [setUseful] = useMutation(newsSet);

  return (
    <div className="card news-container__card">
      <div className="card-heading news-container__card__heading">
        {data.title}{" "}
        <span onClick={() => history.push(`${edit_news}/${data.id}`)}>
          edit
        </span>
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

export default function News1({ history }) {
  const { data, loading } = useQuery(newsGet);
  let news = data?.newsGet || [];

  if (!data && loading) {
    return <GhostLoader />;
  }

  return (
    <div className="news-container">
      <div className="news-container__main">
        <div className="news-container__heading">
          <span>News</span>
          <span
            onClick={() => {
              history.push(new_news);
            }}
          >
            {" "}
            +
          </span>
        </div>

        {news.map(data => (
          <EachNews id={data.id} data={data} history={history} />
        ))}
      </div>
    </div>
  );
}
