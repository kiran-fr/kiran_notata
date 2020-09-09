import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { cloneDeep } from "lodash";
import classnames from "classnames";
import moment from "moment";
import { funnelGroupGet, connectionGet } from "../../../../Apollo/Queries";
import { Button, Tag } from "../../../elements/";

import { funnel_tag, funnel_tag_container } from "./Funnel.module.css";

export function Funnel({ connection, user, match }) {
  const [show, setShow] = useState(false);
  const { data, loading, error } = useQuery(funnelGroupGet);
  const funnelGroups = (data && data.accountGet.funnelGroups) || [];

  return (
    <div>
      <div>
        {funnelGroups.map(funnelGroup => {
          let funnelTags = cloneDeep(funnelGroup.funnelTags);
          funnelTags = funnelTags.sort((a, b) => a.index - b.index);

          return (
            <div key={funnelGroup.id}>
              <div>{funnelGroup.name}</div>
              <div className={funnel_tag_container}>
                {funnelTags.map((funnelTag, i) => (
                  <div
                    key={funnelTag.id}
                    className={funnel_tag}
                    style={{ width: `${100 - i * 10}%` }}
                  >
                    {funnelTag.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
