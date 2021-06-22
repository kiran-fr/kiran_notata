import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { notificationsGet } from "private/Apollo/Queries";

import {
  notificationsMarkAsSeen,
  notificationsMarkAllAsSeen,
} from "private/Apollo/Mutations";

export default function NotificationsPage() {
  const [markOne, res1] = useMutation(notificationsMarkAsSeen);
  const [markAll, res2] = useMutation(notificationsMarkAllAsSeen);

  const { data } = useQuery(notificationsGet);

  let notifications = data?.notificationsGet || [];

  return (
    <div>
      <h1>Notifications...</h1>
      <pre>{JSON.stringify(notifications, null, 2)}</pre>

      {notifications.map(notification => (
        <div
          key={notification.id}
          onClick={() => {
            if (notification.seen) return;
            let variables = {
              ids: [notification.id],
            };
            markOne({ variables });
          }}
        >
          <div>{notification.seen ? "SEEN" : "NOT SEEN"}</div>
          {notification.content}
          <div>click to mark as seen</div>
          <hr />
        </div>
      ))}

      {res1.data && <pre>{JSON.stringify(res1.data, null, 2)}</pre>}

      <div
        onClick={() => {
          markAll({ variables: undefined });
        }}
      >
        Mark all as seen
      </div>

      {res2.data && <pre>{JSON.stringify(res2.data, null, 2)}</pre>}
    </div>
  );
}
