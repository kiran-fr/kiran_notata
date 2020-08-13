import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import classnames from "classnames";
import moment from "moment";

import { tagGroupGet, connectionGet } from "../../../../Apollo/Queries";
import {
  connectionTagAdd,
  connectionTagRemove,
} from "../../../../Apollo/Mutations";
import { Button, Tag } from "../../../elements/";
import { startup_page } from "../../../../routes";

export function Facts({ connection, user, match, history }) {
  return (
    <div>
      <div>
        <div style={{ fontSize: "18px" }}>Facts</div>
        <div style={{ padding: "20px 0px", color: "var(--color-gray-medium)" }}>
          You can add tags to make it easier to filter through your startups.
          Tags are also used to see the bigger picture in reports. We recommend
          that you spend some time getting your tags right, as it will make it
          easier for you to navigate in your data.
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <Button
          type="just_text"
          onClick={() => {
            const path = `${startup_page}/${match.params.id}/creative/${connection.creative.id}`;
            history.push(path);
          }}
        >
          Go to facts
        </Button>
      </div>
    </div>
  );
}
