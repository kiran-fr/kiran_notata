import React from "react";

import {
  comments_label,
  comments_list,
  comment_item,
} from "./CommentSection.module.css";

import { Button } from "Components/elements/";

export function CommentSection({ section, question }) {
  return (
    <div className="comment_form" style={{ textAlign: "right" }}>
      <div>
        <Button
          size="small"
          buttonStyle="secondary"
          style={{ color: "var(--color-gray-medium)" }}
        >
          Add coment
        </Button>
      </div>
    </div>
  );
}
