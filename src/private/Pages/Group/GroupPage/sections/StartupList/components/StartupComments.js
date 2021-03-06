import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  groupLogCreate,
  groupLogMarkConversationAsSeen,
} from "../../../../../../Apollo/Mutations";
import { useForm } from "react-hook-form";
import { groupGetV2 } from "../../../../../../Apollo/Queries";
import moment from "moment";

function CommentSection({ startup, group }) {
  const [addComment, { loading }] = useMutation(groupLogCreate);

  const { register, handleSubmit, setValue } = useForm();

  // Submit comment function
  async function submit({ text }) {
    // If loading or text is empty, return
    if (!text.length || loading) {
      return;
    }

    // Mutation variables
    let variables = {
      groupId: group.id,
      creativeId: startup.creative.id,
      input: {
        logType: "COMMENT",
        dataPairs: [
          {
            key: "text",
            val: text,
          },
        ],
      },
    };

    // Update group object in Apollo cache
    function update(proxy, { data: { groupLogCreate } }) {
      // Get old group data
      const data = proxy.readQuery({
        query: groupGetV2,
        variables: { id: group.id },
      });

      // Predict new group data
      const newData = {
        groupGetV2: {
          ...data?.groupGetV2,
          startups: data?.groupGetV2.startups.map(startup => ({
            ...startup,
            log: [...startup.log, groupLogCreate],
          })),
        },
      };

      // Update cache
      proxy.writeQuery({
        query: groupGetV2,
        variables: { id: group.id },
        data: newData,
      });
    }

    // Clear input field
    setValue("text", "");

    // Mutate, and update cache
    addComment({
      variables,
      update,
    });
  }

  return (
    <div className="commentBox">
      <div className="comments">
        {startup.log?.map(logItem => {
          return (
            <div className="comment">
              <div className="commentHead">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0)">
                    <path
                      d="M21.9208 17.2663L20.6431 13.5476C21.259 12.2885 21.5845 10.8883 21.5866 9.47935C21.5904 7.02957 20.6426 4.71325 18.9178 2.95711C17.1926 1.20063 14.8936 0.211878 12.4444 0.173077C9.90475 0.132944 7.51757 1.09897 5.7229 2.89361C3.99237 4.62409 3.03253 6.90543 3.00215 9.34331C1.29655 10.6275 0.28983 12.6296 0.293139 14.7681C0.294729 15.7689 0.519971 16.7636 0.946781 17.6632L0.0666502 20.2245C-0.0846431 20.6648 0.0258727 21.1429 0.3551 21.4721C0.586788 21.7038 0.892253 21.8272 1.2064 21.8272C1.33857 21.8272 1.47229 21.8054 1.6027 21.7605L4.16403 20.8804C5.06358 21.3072 6.05835 21.5325 7.0591 21.534C7.06271 21.534 7.06614 21.534 7.06975 21.534C9.24011 21.534 11.2575 20.5013 12.537 18.7539C13.8685 18.7188 15.1858 18.3965 16.3768 17.8139L20.0955 19.0917C20.2504 19.1449 20.4093 19.1709 20.5664 19.1709C20.9397 19.1709 21.3027 19.0243 21.5781 18.7488C21.9693 18.3576 22.1006 17.7895 21.9208 17.2663ZM7.06967 20.2245C7.06687 20.2245 7.06391 20.2245 7.06112 20.2245C6.17536 20.2232 5.29574 20.0048 4.51753 19.5931C4.35752 19.5085 4.16966 19.4938 3.99856 19.5526L1.37217 20.4551L2.27465 17.8288C2.33343 17.6576 2.31882 17.4698 2.23417 17.3098C1.82244 16.5315 1.60407 15.652 1.6027 14.7662C1.60051 13.3413 2.15476 11.9909 3.12401 10.9797C3.44061 12.9096 4.36044 14.6881 5.78623 16.0886C7.2015 17.4786 8.98049 18.3637 10.9 18.6531C9.88645 19.6521 8.52021 20.2245 7.06967 20.2245ZM20.652 17.8229C20.6148 17.8601 20.5706 17.8703 20.5209 17.8532L16.54 16.4852C16.4708 16.4614 16.3989 16.4497 16.3272 16.4497C16.2216 16.4497 16.1163 16.4752 16.021 16.5257C14.8844 17.127 13.5999 17.4459 12.3065 17.4479C12.3022 17.4479 12.2984 17.4479 12.2941 17.4479C7.96015 17.4479 4.38029 13.9273 4.31163 9.59434C4.27704 7.41217 5.10711 5.36131 6.64887 3.81954C8.19064 2.27778 10.2418 1.44801 12.4237 1.48238C16.7608 1.55117 20.2838 5.13765 20.2771 9.47729C20.2751 10.7707 19.9562 12.0552 19.355 13.1918C19.2703 13.3517 19.2557 13.5396 19.3145 13.7108L20.6824 17.6917C20.6995 17.7416 20.6892 17.7857 20.652 17.8229Z"
                      fill="var(--ui-color-primary-green-dark2)"
                    />
                    <path
                      d="M16.1945 5.99609H8.39304C8.03141 5.99609 7.73828 6.28927 7.73828 6.65085C7.73828 7.01248 8.03146 7.30561 8.39304 7.30561H16.1945C16.5561 7.30561 16.8492 7.01244 16.8492 6.65085C16.8492 6.28927 16.5561 5.99609 16.1945 5.99609Z"
                      fill="var(--ui-color-primary-green-dark2)"
                    />
                    <path
                      d="M16.1945 8.6875H8.39304C8.03141 8.6875 7.73828 8.98068 7.73828 9.34226C7.73828 9.70384 8.03146 9.99702 8.39304 9.99702H16.1945C16.5561 9.99702 16.8492 9.70384 16.8492 9.34226C16.8492 8.98068 16.5561 8.6875 16.1945 8.6875Z"
                      fill="var(--ui-color-primary-green-dark2)"
                    />
                    <path
                      d="M13.1915 11.3789H8.39304C8.03141 11.3789 7.73828 11.6721 7.73828 12.0337C7.73828 12.3953 8.03146 12.6884 8.39304 12.6884H13.1915C13.5531 12.6884 13.8462 12.3952 13.8462 12.0337C13.8462 11.6721 13.5531 11.3789 13.1915 11.3789Z"
                      fill="var(--ui-color-primary-green-dark2)"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="22" height="22" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <div className="commentUserName">
                  {logItem.createdByUser?.given_name}{" "}
                  {logItem.createdByUser?.family_name}
                </div>
              </div>

              <div>
                <div className="commentText">{logItem.dataPairs?.[0]?.val}</div>
              </div>

              <div className="commentTime">
                {moment(logItem.createdAt).format("lll")}{" "}
                {logItem.createdAt !== logItem.updatedAt && (
                  <span>(edited)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <div className="commentInput">
          <input ref={register} name="text" type="text" autoComplete="off" />
          {!loading && (
            <button type="submit" aria-hidden="true" value="">
              <i className="fa fa-paper-plane" />
            </button>
          )}
          {loading && <i className="fal fa-spinner fa-spin" />}
        </div>
      </form>
    </div>
  );
}

export default function StartupComments({ startup, group }) {
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [markConversationAsSeen] = useMutation(groupLogMarkConversationAsSeen);
  let unreadComments = startup?.log?.filter(({ seen }) => !seen);
  if (!group?.settings?.chat) {
    return <span />;
  }

  return (
    <div className="group-startup-card__comment-section">
      <div
        className="row"
        onClick={() => {
          if (!showCommentSection) {
            let variables = {
              groupId: group.id,
              creativeId: startup.creative.id,
            };
            markConversationAsSeen({ variables });
          }
          setShowCommentSection(!showCommentSection);
        }}
      >
        <div className="col-sm-12">
          <i
            className={`group-startup-card__comment-section__icon fa ${
              showCommentSection ? "fa-chevron-down" : "fa-chevron-right"
            }`}
            aria-hidden="true"
          />
          <div className="group-startup-card__comment-section__heading">
            <span>{unreadComments?.length || 0} unread comments</span>
          </div>
        </div>
      </div>

      {showCommentSection && <CommentSection startup={startup} group={group} />}
    </div>
  );
}
