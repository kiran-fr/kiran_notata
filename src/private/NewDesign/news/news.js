import React from "react";
import "./news.scss";
import like from "../../../assets/images/like.png";
import dislike from "../../../assets/images/dislike.png";
import newsImg from "../../../assets/images/news-img.png";
import MultiSelect from "../srv_startup/pages/ui-kits/multi-select";
import uploadImage from "../../../assets/images/news-upload.png";
import ButtonWithIcon from "../srv_startup/pages/ui-kits/button-with-icon";
import { ICONPOSITION } from "../srv_startup/pages/constants";

export default function News1() {
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
  return (
    <div className="news-container">
      <div className="news-container__main">
        <div className="news-container__heading">News</div>
        <div className="news-container__create-container">
          <div className="news-container__create-container__heading">Title</div>
          <input
            className="news-container__create-container__title"
            type="text"
            placeholder="Add news title"
          />
          <div className="news-container__create-container__heading">
            Target:
          </div>
          <div className="news-container__create-container__multi-selects">
            <MultiSelect options={locations} placeholderLabel="Locations" />
            <MultiSelect options={interests} placeholderLabel="Interests" />
          </div>
          <textarea className="news-container__create-container__news-buinder" />
          <div className="news-container__create-container__footer">
            <div className="news-container__create-container__footer__news-by">
              <div className="news-container__create-container__footer__date">
                Jan 25, 2020
              </div>
              <div className="news-container__create-container__footer__name">
                Jørgen Ekvoll
              </div>
            </div>
            <div className="news-container__create-container__footer__upload-image">
              <img src={uploadImage} />
            </div>
            <div className="news-container__create-container__footer__action-btns">
              <ButtonWithIcon
                className="add-picture-btn"
                iconName="add"
                text="ADD PICTURE"
                iconPosition={ICONPOSITION.START}
              ></ButtonWithIcon>
              <ButtonWithIcon
                className="save-btn"
                iconName="done"
                text="Save"
                iconPosition={ICONPOSITION.START}
              ></ButtonWithIcon>
            </div>
          </div>
        </div>
        <div className="card news-container__card">
          <div className="card-heading news-container__card__heading">
            Justworks’ Series B pitch deck may be the most wonderfully simple
            deck I’ve ever seen
          </div>
          <p className="news-container__card__news">
            It may be tough to remember, but there was a time long ago when
            Justworks wasn’t a household name. Though its monthly revenue growth
            charts were up and to the right, it had not even broken the $100,000
            mark. Even then, Bain Capital Venture’s Matt Harris felt confident
            in betting on the startup.
            <br />
            <br />
            Harris says that, with any investment (particularly at the early
            stage of a company), the decision really comes down to the team and
            more importantly, the founder.
            <br />
            <br />
            Two of the main reasons this deck “sings” is the line it draws to
            the Justworks culture and that the deck isn’t “artificially simple.”
            <br />
            <br />
            “Isaac is a long-term mercenary, but short- and medium-term
            missionary,” said Harris. “The word that really comes to mind is
            ‘structured.’ If you ask him to think about something and respond,
            he’ll think about it and come back with an answer that has four
            pillars underneath it. He’ll create a framework that not only
            answers your specific question, but can prove to be a model that
            will answer future questions of the same type. He’s a systems
            thinker.” (If you’d like to see your deck featured on a future
            episode, send it to us using this form.)
          </p>
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
                Jan 25, 2020
              </div>
              <div className="news-container__card__footer__news-by__name">
                Jørgen Ekvoll
              </div>
            </div>
          </div>
        </div>
        <div className="card news-container__card">
          <div className="card-heading news-container__card__heading">
            Lime unveils new ebike as part of $50 million investment to expand
            to more 25 cities
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-4 col-md-4 col-sm-push-8 col-md-push-8">
              <img className="news-container__card__news__img" src={newsImg} />
            </div>
            <div className="col-xs-12 col-sm-8 col-md-8 col-sm-pull-4 col-md-pull-4">
              <p className="news-container__card__news news-container__card__news__partition">
                It may be tough to remember, but there was a time long ago when
                Justworks wasn’t a household name. Though its monthly revenue
                growth charts were up and to the right, it had not even broken
                the $100,000 mark. Even then, Bain Capital Venture’s Matt Harris
                felt confident in betting....
              </p>
            </div>
          </div>
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
                Jan 25, 2020
              </div>
              <div className="news-container__card__footer__news-by__name">
                Jørgen Ekvoll
              </div>
            </div>
          </div>
        </div>
        <div className="card news-container__card">
          <div className="card-heading news-container__card__heading">
            Lime unveils new ebike as part of $50 million investment to expand
            to more 25 cities
          </div>
          <p className="news-container__card__news news-container__card__news__partition">
            It may be tough to remember, but there was a time long ago when
            Justworks wasn’t a household name. Though its monthly revenue growth
            charts were up and to the right, it had not even broken the $100,000
            mark. Even then, Bain Capital Venture’s Matt Harris felt confident
            in betting....
          </p>
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
                Jan 25, 2020
              </div>
              <div className="news-container__card__footer__news-by__name">
                Jørgen Ekvoll
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
