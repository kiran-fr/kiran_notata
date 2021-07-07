import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { fakeGet } from "../../Apollo/Queries";

export default function FakePage2({ match }) {
  let { id } = match?.params;

  let [getFake, { data, error, loading }] = useLazyQuery(fakeGet);

  useEffect(() => {
    let variables = { id };
    getFake({ variables });
  }, [id]);

  let fake = data?.fakeGet || {};

  if (loading && !data) {
    return <div>loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  return <pre>{JSON.stringify(fake, null, 2)}</pre>;
}
