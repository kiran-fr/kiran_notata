// Changed By : Siva
// Date : 2/04/2021

import React, { useEffect, useState } from "react";
import qp from "utils/queryParams";

export const LinkBridge = props => {
  const [link, setLink] = useState(null);

  useEffect(() => {
    if (props.location.search) {
      let { link } = qp(props.location.search);
      setLink(link[0]);
      window.location.href = link[0] ? link[0] : link;
    } else {
      window.location.href = link;
    }
  }, []);

  return !link ? <div>nothing to do, duh...</div> : "";
};
