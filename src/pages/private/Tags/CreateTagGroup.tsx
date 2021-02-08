import React from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { tagGroupPut, funnelGroupPut } from "Apollo/Mutations";
import { tagGroupGet, funnelGroupGet } from "Apollo/Queries";

import { Card, Button } from "Components/elements";
import { TagType } from "pages/private/Tags/index";

export default function CreateTagGroup({
  index,
  type,
}: {
  index: number;
  type: TagType;
}) {
  const [mutateTags] = useMutation(tagGroupPut, {
    refetchQueries: [{ query: tagGroupGet }],
    awaitRefetchQueries: true,
  });
  const [mutateFunnels] = useMutation(funnelGroupPut, {
    refetchQueries: [{ query: funnelGroupGet }],
    awaitRefetchQueries: true,
  });

  const { register, handleSubmit, formState, reset } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (variables: any) => {
    try {
      if (type === "funnels") {
        await mutateFunnels({
          variables: {
            ...variables,
            index,
          },
        });
      } else {
        await mutateTags({
          variables: {
            ...variables,
            index,
          },
        });
      }

      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <form className="focus_form mb3" onSubmit={handleSubmit(onSubmit)}>
        <textarea
          rows={1}
          className="form_h1"
          placeholder={type === "tags" ? "Tag Group Name" : "Funnel Group Name"}
          name="input.name"
          ref={register}
        />

        <textarea
          rows={1}
          className="form_p1"
          placeholder={
            type === "tags"
              ? "Tag Group Description"
              : "Funnel Group Description"
          }
          name="input.description"
          ref={register}
        />

        <div
          style={{
            position: "relative",
            textAlign: "right",
            marginTop: "10px",
          }}
        >
          <Button type="right_arrow" loading={isSubmitting} size="large">
            {type === "tags"
              ? "Create new tag group"
              : "Create new funnel group"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
