import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@apollo/client";

import {
  groupsGet,
  userGet,
  groupGetListOfStartups,
} from "../../../Apollo/Queries";
import { groupPut } from "../../../Apollo/Mutations";

import { group } from "../../definitions";

import {
  Content,
  Card,
  Table,
  Button,
  Modal,
  BreadCrumbs,
  GhostLoader,
} from "../../../Components/elements";

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

const ListAll = ({ user }) => {
  const { data, loading, error } = useQuery(groupGetListOfStartups);
  if (loading || error) return <span />;

  let startups = data.groupGetListOfStartups;
  startups = startups.filter(({ sharedBy }) => sharedBy !== user.email);

  const columns = [
    {
      title: "Name",
      key: "name",
      render: item => {
        return (
          <span>
            <div>{item.connection.creative.name}</div>
            <div style={{ opacity: 0.5, fontSize: "12px" }}>
              {<>{item.sharedBy} - </>}
              {item.groupName}
            </div>
          </span>
        );
      },
    },
  ];
  return (
    <Table
      dataSource={startups}
      columns={columns}
      // loading={loading.toString()}
      diableHead={true}
    />
  );
};

export default function Groups({ history }) {
  const [showModal, setShowModal] = useState();

  const [mutate, { loading: groupPutLoading }] = useMutation(groupPut);
  const { data, loading, error } = useQuery(groupsGet);

  const userQuery = useQuery(userGet);
  let user = (userQuery.data || {}).userGet || {};

  if (error) {
    console.log("error", error);
    return <div>We are updating </div>;
  }

  if (!data && loading) return <GhostLoader />;

  let groups = data.groupsGet || [];

  const columns = [
    {
      title: "",
      key: "delete",
      width: 20,
      className: "delete_bucket",
      render: group => {
        let isAdmin = group.members.some(
          ({ email, role }) => email === user.email && role === "admin"
        );

        if (!isAdmin) return <span />;

        if (groupPutLoading) {
          return <i className="fa fa-spinner fa-spin" />;
        }

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

        let isAdmin = gr.members.some(
          ({ email, role }) => email === user.email && role === "admin"
        );

        let settings = gr.settings || {};
        let startupLength = [
          ...new Set(startups.map(({ creativeId }) => creativeId)),
        ].length;
        let member = members.find(({ email }) => email === user.email);
        let { latestActivity } = member || {};

        return (
          <span>
            {(!latestActivity && (
              <div style={{ fontWeight: "var(--font-weight-bold)" }}>
                {name}
              </div>
            )) || <div>{name}</div>}

            <div style={{ opacity: 0.5, fontSize: "12px" }}>
              {(isAdmin || settings.showUsers) && (
                <>{(members || []).length} members - </>
              )}
              {startupLength} startups
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
          // type="tiny_right"
          type="right_arrow"
          size="small"
          onClick={() => {
            let path = `${group}/${id}`;
            history.push(path);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "All Groups",
            link: group,
          },
        ]}
      />
      <Content maxWidth={600}>
        {/*
            <h1>Inbox</h1>
            <Card style={{paddingTop: "5px"}}>
              <ListAll
                user={user}
              />
            </Card>
          */}

        <h1>Groups</h1>
        {!!groups.length && (
          <Card style={{ paddingTop: "5px" }}>
            <Table
              dataSource={groups}
              columns={columns}
              loading={loading.toString()}
              diableHead={true}
            />
          </Card>
        )}

        {!groups.length && (
          <Card style={{ paddingBottom: "20px" }}>
            <div style={{ fontSize: "18px" }}>
              You don't have any groups yet
            </div>
            <div
              style={{
                padding: "20px 0px",
                color: "var(--color-gray-medium)",
              }}
            >
              This is your sharing space. When other ivestors share startups
              with you they will appear here. You can also create a group to
              share your startups with other investors in your network. You will
              be able to choose what data you want to share.
            </div>
          </Card>
        )}

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
            title="New Group"
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
      </Content>
    </>
  );
}
