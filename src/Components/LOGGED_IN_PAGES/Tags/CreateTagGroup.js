import React from "react";
import classnames from "classnames";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import {
  Card,
  Button,
  Table,
  Content,
  Modal,
  BreadCrumbs,
  GhostLoader,
} from "../../elements";

import {
  evaluationQuestionPut,
  evaluationTemplateSectionPut,
  tagGroupPut,
} from "../../../Apollo/Mutations";
import { tagGroupGet } from "../../../Apollo/Queries";

export default function CreateTagGroup({ index }) {
  const [mutate] = useMutation(tagGroupPut, {
    refetchQueries: [{ query: tagGroupGet }],
    awaitRefetchQueries: true,
  });
  const { register, handleSubmit, formState, reset } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async variables => {
    try {
      await mutate({
        variables: {
          ...variables,
          index,
        },
      });

      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <form
        className="focus_form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ marginBottom: "20px" }}
      >
        <textarea
          rows={1}
          className="form_h1"
          placeholder="Tag Group Name"
          name="input.name"
          ref={register}
        />

        <textarea
          rows={1}
          className="form_p1"
          placeholder="Tag Group Description"
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
            Create new tag group
          </Button>
        </div>
      </form>
    </Card>
  );
}
