import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@apollo/client";

import { groupsGet, userGet } from "../../../Apollo/Queries";
import { groupPut } from "../../../Apollo/Mutations";

import { group } from "../../../routes";

import {
  Content,
  Card,
  Table,
  Button,
  Modal,
  BreadCrumbs,
} from "../../elements/";

const CreateNewGroup = ({ setDone, mutate }) => {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    let { variables } = data;
    try {
      let res = await mutate({ variables });
      let item = res.data.groupPut;
      setDone(item.id);
      event.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder={`I.e. "Business Angels London"`}
          autoComplete="off"
          ref={register({ required: true })}
          name="variables.input.name"
        />

        <div
          style={{
            marginTop: "5px",
            textAlign: "right",
          }}
        >
          <Button type="input" value="OK" loading={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

export default function Groups({ history }) {
  const [showModal, setShowModal] = useState();

  const [mutate] = useMutation(groupPut);
  const { data, loading, error } = useQuery(groupsGet);

  const userQuery = useQuery(userGet);
  let user = (userQuery.data || {}).userGet || {};

  if (error) return <div>We are updating </div>;

  let groups = (data || {}).groupsGet || [];

  const columns = [
    {
      title: "",
      key: "delete",
      width: 20,
      className: "delete_bucket",
      render: group => {
        let isOwner = group.createdBy === user.cognitoIdentityId;
        if (!isOwner) return <span />;
        return (
          <i
            className="fal fa-trash-alt"
            onClick={() => {
              let variables = {
                id: group.id,
                input: { deleteGroup: true },
              };
              mutate({
                variables,
                update: (proxy, { data: { groupPut } }) => {
                  const data = proxy.readQuery({
                    query: groupsGet,
                  });
                  proxy.writeQuery({
                    query: groupsGet,
                    data: {
                      groupsGet: data.groupsGet.filter(g => g.id !== group.id),
                    },
                  });
                },
              });
            }}
          />
        );
      },
    },
    {
      title: "Group name",
      dataIndex: "id",
      key: "name",
      render: id => {
        let gr = groups.find(g => g.id === id) || {};
        let { name, members, startups } = gr;
        return (
          <span>
            <div>{name}</div>
            <div style={{ opacity: 0.5, fontSize: "12px" }}>
              {(members || []).length} members - {(startups || []).length}{" "}
              startups
            </div>
          </span>
        );
      },
    },

    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: 30,
      render: id => (
        <Button
          type="tiny_right"
          onClick={() => {
            let path = `${group}/${id}`;
            history.push(path);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "all groups",
            link: group,
          },
        ]}
      />
      <Content maxWidth={600}>
        <h1>Groups</h1>
        <Card style={{ paddingTop: "5px" }}>
          <Table
            dataSource={groups}
            columns={columns}
            loading={loading.toString()}
            diableHead={true}
          />
        </Card>

        <div style={{ marginTop: "20px" }}>
          <Button
            onClick={() => setShowModal(true)}
            type="right_arrow"
            size="large"
          >
            Create New Group
          </Button>
        </div>

        {showModal && (
          <Modal
            title="New Evaluation Template"
            close={() => setShowModal(false)}
            disableFoot={true}
          >
            <CreateNewGroup
              mutate={mutate}
              setDone={id => {
                let path = `${group}/${id}`;
                history.push(path);
              }}
            />
          </Modal>
        )}

        <pre>{JSON.stringify(groups, null, 2)}</pre>
      </Content>
    </>
  );
}
