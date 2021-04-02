// Changed By : Siva
// Date : 2/04/2021

import React, { useEffect, useState } from "react";
import qp from "utils/queryParams";

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = { link: null };
  }

  componentDidMount() {
    let { link } = qp(this.props.location.search);
    this.setState({ link: link[0] });
  }

  render() {
    if (!this.state.link) return <div>nothing to do, duh...</div>;
    window.location.href = this.state.link;
  }
}

// export  const LinkBridge = (props) => {

//   const [link, setLink] = useState(null);

//   useEffect(() => {
//     if(props.location.search) {
//       let { link } = qp(props.location.search);
//       setLink(link[0])
//       window.location.href = link[0] ? link[0] : link;
//     } else {
//       window.location.href =  link;
//     }
//   }, []);

//     return (
//       !link
//       ?
//         <div>nothing to do, duh...</div>
//       :
//         ""
//     );

// }
