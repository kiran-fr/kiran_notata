import React, { useEffect, useState } from "react";
import "./notifications.scss";
import NotificationAlarm from "../../../assets/images/notification-alarm.png";
import eye from "../../../assets/images/eye.png";
import eyeGray from "../../../assets/images/eye-gray.png";
import { settings } from "../../../definitions";

import { useQuery, useMutation } from "@apollo/client";

import { notificationsGet } from "private/Apollo/Queries";

import { notificationsMarkAllAsSeen } from "private/Apollo/Mutations";

function Notification({ content }) {
  return (
    <div className="notifications__notification">
      <img src={NotificationAlarm} alt="Notification Icon" />
      <p className="notifications__notification__text">{content}</p>
    </div>
  );
}

export default function Notifications({ history }) {
  const [isDropDown, setIsDropDown] = useState(false);
  const [markAll, res2] = useMutation(notificationsMarkAllAsSeen);

  const [allNotifications, setAllNotifications] = useState([]);

  const { data } = useQuery(notificationsGet);

  useEffect(() => {
    if (data?.notificationsGet) {
      setAllNotifications(data?.notificationsGet);
      async function markAllAsSeen() {
        await markAll();
      }
      markAllAsSeen();
    }
  }, [data]);

  return (
    <div className="notifications-container">
      <div className="card notifications-container__card">
        <div className="card-heading notifications-container__header">
          <div className="card-heading notifications-container__heading">
            <i
              class="fa fa-chevron-left"
              aria-hidden="true"
              onClick={() => history.push(settings)}
            ></i>
            Notifications
          </div>
          <div className=" notifications-container__show">
            Show
            <i
              className={`fa ${
                isDropDown ? "fa-chevron-up" : "fa-chevron-down"
              }`}
              aria-hidden="true"
              onClick={() => {
                setIsDropDown(!isDropDown);
              }}
            >
              {isDropDown && (
                <div className="notifications-container__show__dropdown">
                  <div className="drop-down-item" onClick={() => {}}>
                    <img src={eye} alt="" />
                    <span className="text">Team</span>
                  </div>
                  <div className="drop-down-item" onClick={() => {}}>
                    <img src={eyeGray} alt="" />
                    <span className="text">Groups</span>
                  </div>
                  <div className="drop-down-item" onClick={() => {}}>
                    <img src={eye} alt="" />
                    <span className="text">Startups</span>
                  </div>
                  <div className="drop-down-item" onClick={() => {}}>
                    <img src={eyeGray} alt="" />
                    <span className="text">Reminders</span>
                  </div>
                  <div className="drop-down-item" onClick={() => {}}>
                    <img src={eye} alt="" />
                    <span className="text">Filter matches</span>
                  </div>
                </div>
              )}
            </i>
          </div>
        </div>

        <div className="notifications">
          {allNotifications.length <= 0 ? (
            <div className="noNotification">No Notification</div>
          ) : (
            allNotifications.map(notif => (
              <Notification
                key={notif.id}
                content={notif.content}
              ></Notification>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
