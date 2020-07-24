import React from "react";
import { Query, Mutation } from "@apollo/client/react/components";
import classnames from "classnames";
import { adopt } from "react-adopt";
import { GhostLoader } from "../../elements/GhostLoader";
import { connectionGet } from "../../../Apollo/Queries";

import LogBox from "./LogBox";
import SubjectivityBox from "./SubjectivityBox";

const EvaluationsBox = ({ evaluations }) => {
  return evaluations.map((evaluation, i) => (
    <div key={`evaluation-${evaluation.id}`}>
      <div>{evaluation.name}</div>
      <div>{evaluation.createdByUser.email}</div>
    </div>
  ));
};

// const ConnectionComponent = ({connection, error, loading, user}) => {

//   // console.log('connection', connection)

//   // let log = connection ? connection.log : []
//   // let connectionId = connection ? connection.id : null;

//   return (
//     <div>

//       {
//         // <EvaluationsBox
//         //   evaluations={connection.evaluations}
//         // />
//       }

//       <SubjectivityBox
//         connection={connection}
//         user={user}
//       />

//     </div>
//   )
// }

const GeneralConnection = props => {
  let { id, user } = props;

  const Composed = adopt({
    connectionQuery: ({ render }) => (
      <Query query={connectionGet} variables={{ id }}>
        {render}
      </Query>
    )
  });

  return (
    <Composed>
      {({ connectionQuery }) => {
        const loading = connectionQuery.loading;
        const error = connectionQuery.error;
        const connection =
          connectionQuery.data && connectionQuery.data.connectionGet;

        return (
          <div>
            {
              // <EvaluationsBox
              //   evaluations={connection.evaluations}
              // />
            }

            <SubjectivityBox connection={connection} user={user} />
          </div>
        );
      }}
    </Composed>
  );
};

// export default ComposedComponent;

const CombinedComponent = props => {
  return (
    <div>
      <GeneralConnection {...props} />
      <LogBox connectionId={props.id} user={props.user} />
    </div>
  );
};

export default CombinedComponent;
