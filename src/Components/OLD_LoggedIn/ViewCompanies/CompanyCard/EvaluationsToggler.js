import React from "react";
import classnames from "classnames";
import { Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";
import { getEvaluations } from "../../../../Apollo/Queries";
import { putEvaluation_new } from "../../../../Apollo/Mutations";
import { overviewBoth } from "../../../../routes";
import { color1_bg, color2_bg } from "../../../elements/Colors.module.css";
import {
  section,
  section_title,
  tag_container,
  tag,
  inactive_view
} from "./index.module.css";

class EvaluationsToggeler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      has_duplicated: false
    };
  }

  render() {
    let {
      it,
      item,
      viewingIndex,
      setViewingIndex,
      hasEvaluated,
      history,
      openInModal
    } = this.props;

    return (
      <div className={section}>
        <div className={section_title}>Viewing evaluation by:</div>

        <div className={tag_container}>
          {it.map((ii, ix) => (
            <div
              key={`${it.id}-${ix}`}
              className={classnames(
                tag,
                viewingIndex === ix ? color1_bg : inactive_view
              )}
              style={{ cursor: "pointer" }}
              onClick={() => setViewingIndex(ix)}
            >
              {ii.sharedByEmail ? ii.sharedByEmail : "You"}
            </div>
          ))}

          {/* MAKE EVALUATION */}
          {!hasEvaluated && (
            <Mutation mutation={putEvaluation_new}>
              {(mutate, { data, loading, error }) => {
                console.log("{ data, loading, error }", {
                  data,
                  loading,
                  error
                });

                if (
                  !error &&
                  !loading &&
                  data &&
                  data.putEvaluation_new &&
                  !this.state.has_duplicated
                ) {
                  this.setState({ has_duplicated: true }, () => {
                    openInModal(data.putEvaluation_new);
                  });
                }
                return (
                  <div
                    className={classnames(tag, color2_bg)}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      let variables = {
                        orgId: item.organization.id
                      };

                      mutate({
                        variables,
                        refetchQueries: [{ query: getEvaluations }]
                      });
                    }}
                  >
                    evaluate
                    <span>&nbsp;</span>
                    {(loading && <i className="fa fa-spinner fa-spin" />) || (
                      <i className="fas fa-copy" />
                    )}
                  </div>
                );
              }}
            </Mutation>
          )}
        </div>
      </div>
    );
  }
}

export default EvaluationsToggeler;
