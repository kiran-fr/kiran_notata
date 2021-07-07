import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { fakesGet } from "../../Apollo/Queries";
import { fakeCreate, fakeDelete, fakeUpdate } from "../../Apollo/Mutations";
import { useHistory } from "react-router-dom";
import { fake_page } from "../../../definitions";

function NewFake() {
  let [title, setTitle] = useState("");
  let [mutate, { data, error, loading }] = useMutation(fakeCreate);

  async function save() {
    if (loading) return;

    let variables = {
      input: { title },
    };

    await mutate({
      variables,
      update: (proxy, { data }) => {
        const queryData = proxy.readQuery({
          query: fakesGet,
        });

        let newQueryData = {
          fakesGet: [...queryData.fakesGet, data?.fakeCreate],
        };
        proxy.writeQuery({
          query: fakesGet,
          data: newQueryData,
        });
      },
    });

    setTitle("");
  }

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <button onClick={save}>{loading ? "loading" : "save"}</button>
    </div>
  );
}

function FakeItem({ item }) {
  const history = useHistory();

  const [title, setTitle] = useState(item.title);
  const [updateMutation, updRes] = useMutation(fakeUpdate);
  const [deleteMutation, delRes] = useMutation(fakeDelete);

  async function deleteFn() {
    if (delRes.loading) return;
    let variables = {
      id: item.id,
    };

    deleteMutation({
      variables,

      optimisticResponse: {
        __typename: "Mutation",
        fakeDelete: {
          message: "OK",
          __typename: "MessageResponse",
        },
      },

      update: (proxy, { data: { fakeDeleteData } }) => {
        const data = proxy.readQuery({
          query: fakesGet,
        });
        let newData = {
          fakesGet: [...data?.fakesGet?.filter(({ id }) => id !== item.id)],
        };
        proxy.writeQuery({
          query: fakesGet,
          data: newData,
        });
      },
    });
  }

  function saveFn() {
    if (updRes.loading) return;
    let variables = {
      id: item.id,
      input: {
        title: title,
      },
    };
    updateMutation({ variables });
  }

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <button onClick={saveFn}>{updRes.loading ? "loading" : "save"}</button>

      <button onClick={deleteFn}>
        {delRes.loading ? "loading" : "delete"}
      </button>

      <button onClick={() => history.push(`${fake_page}/${item.id}`)}>
        view
      </button>
    </div>
  );
}

export default function FakePage() {
  const { data, loading, error } = useQuery(fakesGet);

  const fakes = data?.fakesGet || [];

  if (loading && !data) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  return (
    <div>
      <NewFake />

      {fakes.map(fakeItem => (
        <FakeItem key={fakeItem.id} item={fakeItem} />
      ))}
    </div>
  );
}
