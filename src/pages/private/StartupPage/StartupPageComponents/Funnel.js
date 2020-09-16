import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { cloneDeep } from "lodash";
import classnames from "classnames";

import { funnelGroupGet, connectionGet } from "../../../../Apollo/Queries";

import { connectionFunnelTagAdd } from "../../../../Apollo/Mutations";

import { Card } from "../../../../Components/elements";

import {
  funnel_tag,
  funnel_tag_active,
  funnel_tag_container,
} from "./Funnel.module.css";

export function Funnel({ connection, user, match }) {
  const {
    data,
    // loading,
    // error
  } = useQuery(funnelGroupGet);

  const funnelGroups = (data && data.accountGet.funnelGroups) || [];
  const [mutate] = useMutation(connectionFunnelTagAdd);

  function addFunnelTag(funnelTag) {
    let funnelGroup = funnelGroups.find(
      ({ id }) => id === funnelTag.funnelGroupId
    );
    let allFunnelTags = cloneDeep(funnelGroup.funnelTags);
    // let selectedTag = allFunnelTags.find(({ id }) => id === funnelTag.id);

    let tags = [];
    // Remove tag if it's the first one and user clicks on it again
    if (
      connection.funnelTags.length === 1 &&
      connection.funnelTags[0].id === funnelTag.id
    ) {
      tags = [];
      // If not... add tags
    } else {
      tags = allFunnelTags.filter(
        ({ index }) => (index || 0) <= funnelTag.index
      );
    }

    console.log("==============");
    console.log("allFunnelTags", allFunnelTags);
    console.log("tags", tags);

    mutate({
      variables: {
        connectionId: connection.id,
        funnelTagId: funnelTag.id,
      },

      optimisticResponse: {
        __typename: "Mutation",
        connectionFunnelTagAdd: {
          ...connection,
          funnelTags: tags,
        },
      },

      update: (proxy, { data: { connectionFunnelTagAdd } }) => {
        const data = proxy.readQuery({
          query: connectionGet,
          variables: { id: connection.id },
        });

        proxy.writeQuery({
          query: connectionGet,
          variables: { id: connection.id },
          data: {
            connectionGet: {
              ...data.connectionGet,
              funnelTags: [...connectionFunnelTagAdd.funnelTags],
            },
          },
        });
      },
    });
  }

  return (
    <>
      {funnelGroups.map(funnelGroup => {
        let funnelTags = cloneDeep(funnelGroup.funnelTags);
        funnelTags = funnelTags.sort((a, b) => a.index - b.index);
        return (
          <Card
            label={`FUNNEL – ${funnelGroup.name.toUpperCase()}`}
            style={{ paddingBottom: "20px" }}
            key={funnelGroup.id}
          >
            <div>
              <div className={funnel_tag_container}>
                {funnelTags.map((funnelTag, i) => (
                  <div
                    key={funnelTag.id}
                    className={classnames(
                      funnel_tag,
                      connection.funnelTags.some(
                        ({ id }) => id === funnelTag.id
                      ) && funnel_tag_active
                    )}
                    style={{ width: `${100 - i * 10}%` }}
                    onClick={() => addFunnelTag(funnelTag)}
                  >
                    {funnelTag.name}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
    </>
  );
}
