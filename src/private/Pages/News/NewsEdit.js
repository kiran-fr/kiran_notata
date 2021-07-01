import React, { useEffect, useRef, useState } from "react";
import "./News.scss";
import like from "../../../assets/images/like.png";
import dislike from "../../../assets/images/dislike.png";
import newsImg from "../../../assets/images/news-img.png";
import MultiSelect from "../../../Components/UI_Kits/from_srv/multi-select";
import uploadImage from "../../../assets/images/news-upload.png";
import ButtonWithIcon from "../../../Components/UI_Kits/from_srv/button-with-icon";
import { ICONPOSITION } from "../constants";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import { newsGetOne, userGet } from "../../Apollo/Queries";
import {
  newsCreate,
  newsUpdate,
  newsDelete,
  newsDeleteImage,
} from "../../Apollo/Mutations";

import { news } from "../../../definitions";
import { Storage } from "aws-amplify";
import { omit } from "lodash";
import { GhostLoader } from "../../../Components/elements";
const publicFilePath = `https://s3-eu-west-1.amazonaws.com/notata.userfiles/public/`;

async function removeImagePromise(key, config) {
  return new Promise((resolve, reject) => {
    Storage.remove(key, config).then(resolve).catch(reject);
  });
}

async function uploadImagePromise(filename, file, setProgress) {
  return new Promise((resolve, reject) => {
    Storage.put(filename, file, {
      progressCallback(progress) {
        if (setProgress) {
          setProgress({
            loaded: progress.loaded,
            total: progress.total,
          });
        }
      },
      level: "public",
    })
      .then(resolve)
      .catch(reject);
  });
}

function Preview({ data, user }) {
  return (
    <div>
      <div className="card news-container__card">
        <div className="card-heading news-container__card__heading">
          {data.title}
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
              <img src={like} />
              <img src={dislike} />
            </div>
          </div>
          <div className="news-container__card__footer__news-by">
            <div className="news-container__card__footer__news-by__date">
              {moment().format("ll")}
            </div>
            <div className="news-container__card__footer__news-by__name">
              {user?.given_name} {user?.family_name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsEdit({ history, match }) {
  console.log("NewsEdit");

  let { id } = match?.params;

  // States
  const [data, setData] = useState({});
  const [isUploading, setIsUploading] = useState(undefined);
  const [isDeleting, setIsDeleting] = useState(undefined);

  // Queries
  const userQuery = useQuery(userGet);
  const [getOneNews, getOneNewsRes] = useLazyQuery(newsGetOne);

  // Mutations
  const [createNews, createNewsRes] = useMutation(newsCreate);
  const [updateNews, updateNewsRes] = useMutation(newsUpdate);
  const [deleteNews, deleteNewsRes] = useMutation(newsDelete);
  const [deleteImage] = useMutation(newsDeleteImage);

  // Effects
  useEffect(() => {
    if (id) {
      getOneNews({ variables: { id } });
    }
  }, [id]);

  useEffect(() => {
    if (getOneNewsRes?.data?.newsGetOne) {
      let { id, title, content, image } = getOneNewsRes?.data?.newsGetOne;
      setData({ title, content, image, id });
    }
  }, [getOneNewsRes]);

  // Data maps
  const user = userQuery.data?.userGet || {};
  const folderPath = `news/${new Date().getTime()}/`;
  const formRef = useRef(null);

  async function handleUploadImage(e) {
    if (isUploading) {
      return;
    }

    setIsUploading(true);

    // Get file
    let file = e.target.files[0];

    // Return if no file
    if (!file) {
      return;
    }

    // Get file size
    let filesize = (file.size / 1024 / 1024).toFixed(4); // MB

    // Do not allow pictures larger than one mb
    if (filesize >= 2) {
      return;
    }

    // Get path and file name together
    const filename = `${folderPath}${file.name}`;

    // Save file to s3
    try {
      let result = await uploadImagePromise(filename, file);
      let { key } = result;
      setData({
        ...data,
        image: `${publicFilePath}${key}`,
      });
    } catch (error) {
      setIsUploading(false);
      console.log("error", error);
      return;
    }

    setIsUploading(false);
  }

  async function handleDeleteImage() {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    let parts = data?.image?.split("/");
    let key = `/${parts[parts.length - 2]}/${parts[parts.length - 1]}`;

    try {
      await removeImagePromise(key, { level: "public" });
    } catch (error) {
      console.log("error", error);
    }

    if (id) {
      try {
        let variables = { id };
        let res = await deleteImage({ variables });
        console.log("res", res);
      } catch (error) {
        console.log("error", error);
      }
    }

    setData({
      ...data,
      image: undefined,
    });

    setIsDeleting(false);
    formRef.current.reset();
  }

  async function submitSaveNews() {
    if (!data.title || !data.content) {
      return;
    }
    try {
      let variables = {
        input: { ...omit(data, "id") },
      };
      await createNews({ variables });
    } catch (error) {
      console.log(error);
    }
    history.push(news);
  }

  async function submitUpdateNews() {
    if (!data.title || !data.content) {
      return;
    }
    try {
      let variables = {
        id,
        input: { ...omit(data, "id") },
      };
      await updateNews({ variables });
    } catch (error) {
      console.log(error);
    }
    history.push(news);
  }

  async function submitDeleteNews() {
    if (!id) {
      return;
    }
    try {
      let variables = { id };
      await deleteNews({ variables });
    } catch (error) {
      console.log(error);
    }
    history.push(news);
  }

  if (id && !getOneNewsRes?.data && getOneNewsRes?.loading) {
    return <GhostLoader />;
  }

  return (
    <div className="news-container">
      <div className="news-container__main">
        <div className="news-container__heading">
          {(id && <span>Edit news</span>) || <span>New News</span>}
        </div>

        <div className="news-container__create-container">
          <div className="news-container__create-container__heading">Title</div>
          <input
            className="news-container__create-container__title"
            type="text"
            placeholder="Add news title"
            autoComplete="off"
            value={data.title || ""}
            onChange={e => {
              setData({
                ...data,
                title: e.target.value,
              });
            }}
          />
          <div className="news-container__create-container__heading">
            {/*  Target:*/}
          </div>
          {/*<div className="News-container__create-container__multi-selects">*/}
          {/*  <MultiSelect options={locations} placeholderLabel="Locations" />*/}
          {/*  <MultiSelect options={interests} placeholderLabel="Interests" />*/}
          {/*</div>*/}

          <textarea
            className="news-container__create-container__news-buinder"
            value={data.content || ""}
            onChange={e => {
              setData({
                ...data,
                content: e.target.value,
              });
            }}
          />

          <div className="news-container__create-container__footer">
            <div className="news-container__create-container__footer__news-by">
              <div className="news-container__create-container__footer__date">
                {moment().format("ll")}
              </div>
              <div className="news-container__create-container__footer__name">
                {user?.given_name} {user?.family_name}
              </div>
            </div>

            <div className="news-container__create-container__footer__upload-image">
              {/*<img src={data.image} />*/}
            </div>

            <div className="news-container__create-container__footer__action-btns">
              <div className="hidden-file-input">
                <form ref={formRef}>
                  <label htmlFor="file-upload" className="upload-logo-btn">
                    <input
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      onChange={handleUploadImage}
                    />
                    <ButtonWithIcon
                      className="add-picture-btn"
                      iconName="add"
                      text={isUploading ? "saving..." : "ADD PICTURE"}
                      iconPosition={ICONPOSITION.START}
                    />
                  </label>
                </form>

                {data.image && (
                  <div
                    className="delete-btn"
                    onClick={handleDeleteImage}
                    style={{
                      textAlign: "center",
                      paddingTop: "10px",
                    }}
                  >
                    {(!isDeleting && <span>delete image</span>) || (
                      <span>deleting...</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW */}

        <Preview data={data} user={user} />

        <div className="news-container__bottom-container">
          {(id && (
            <div className="delete-btn" onClick={submitDeleteNews}>
              {deleteNewsRes?.loading ? "...deleting" : "delete"}
            </div>
          )) || <span />}

          <ButtonWithIcon
            className="save-btn"
            iconName="done"
            text={
              id
                ? updateNewsRes?.loading
                  ? "...updating"
                  : "Update"
                : createNewsRes?.loading
                ? "...publishing"
                : "Publish"
            }
            iconPosition={ICONPOSITION.START}
            onClick={() => {
              id ? submitUpdateNews() : submitSaveNews();
            }}
          />
        </div>
      </div>
    </div>
  );
}
