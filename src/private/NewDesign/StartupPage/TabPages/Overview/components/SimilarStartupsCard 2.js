import React, { useEffect } from "react";
import More from "assets/images/more.svg";
import moment from "moment";
import { useLazyQuery } from "@apollo/client";
import { connectionsGet } from "private/Apollo/Queries";
import { startup_page } from "../../../../../../definitions";

const getTotalScore = arr => {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr?.reduce((acc, obj) => {
      return acc + (obj.score || 0);
    }, 0);
  }
  return 0;
};

const getCompAvg = subjectiveScores => {
  if (subjectiveScores) {
    return (
      getTotalScore(subjectiveScores) / subjectiveScores.length || 0
    ).toFixed(1);
  }
  return 0;
};

export default function SimilarStartupsCard({ connection, history }) {
  const [getSimilarConnections, { data, error, loading }] = useLazyQuery(
    connectionsGet
  );

  useEffect(() => {
    if (!connection) {
      return;
    }

    let variables = {
      filters: {
        similarTo: connection.id,
      },
    };

    getSimilarConnections({ variables });
  }, [connection]);

  let similarConnections = data?.connectionsGet;

  return (
    <div className="card similar-startup-card">
      <div className="row similar-startups-contianer">
        <div className="similar-startups-contianer__heading">
          Similar Startups
        </div>
        <div className="col-sm-12 similar-startups-contianer__table-container">
          <table>
            <thead>
              <tr className="grid-header">
                <th>COMPANY NAME</th>
                <th>TAGS</th>
                <th>SUBJECTIVE SCORE</th>
                <th>UPDATED</th>
              </tr>
            </thead>
            <tbody>
              {similarConnections?.map(company => (
                <tr
                  className="connection-link"
                  onClick={() => {
                    let path = `${startup_page}/company/${company.id}`;
                    history.push(path);
                  }}
                >
                  <td className="company-name">
                    <span className="icon">
                      {company?.creative?.name?.substr(0, 1)?.toUpperCase()}
                    </span>
                    <span className="name">{company?.creative?.name}</span>
                  </td>
                  <td>
                    <div className="tag-placeholder">
                      {company?.tags?.slice(0, 2).map(tag => (
                        <span className="tag">{tag.name}</span>
                      ))}
                      {company?.tags?.length > 2 ? (
                        <img src={More} alt="" />
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <div
                      className="subjective-score"
                      style={{
                        filter:
                          getCompAvg(company.subjectiveScores) === "0.0"
                            ? "grayscale(0%)"
                            : "",
                      }}
                    >
                      {getCompAvg(company.subjectiveScores)}
                    </div>
                  </td>

                  <td>
                    <span className="updated-date">
                      {moment(company.updatedAt).format("ll")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
