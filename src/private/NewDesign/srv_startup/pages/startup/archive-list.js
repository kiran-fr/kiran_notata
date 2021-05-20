import React from "react";
import "./archive-list.scss";
import { OVERVIEWPAGESTATE } from "../constants";
import { useQuery } from "@apollo/client";
import { connectionsGet } from "private/Apollo/Queries";

export default function ArchiveList({ setPageState, archiveConnection }) {
  const { data: connectionsGetData, loading, error } = useQuery(
    connectionsGet,
    {
      variables: {
        filters: {
          archived: true,
        },
      },
    }
  );
  let archivedConnections = connectionsGetData?.connectionsGet;
  return (
    <div className="row tab-panel-container archive-list-container">
      <div className="col-sm-12">
        <div className="card">
          <div className="heading">Archive</div>
          <div className="startups">Startups</div>
          {loading ? (
            <div className="archive-list-data">Loading...</div>
          ) : (
            <div className="archive-list-data">
              {archivedConnections?.length === 0 ? (
                <div>
                  <div className="row">
                    <div className="col-sm-4 col-xs-12 startup-name">
                      Archive list is empty!!!
                    </div>
                    <div
                      className="col-sm-4 col-xs-12 delete-permanently"
                      onClick={() => setPageState(OVERVIEWPAGESTATE.OVERVIEW)}
                    >
                      Go back
                    </div>
                  </div>
                </div>
              ) : (
                archivedConnections?.map((connection, index) => (
                  <div className="row" key={`row-id-${index}`}>
                    <div className="col-sm-4 col-xs-12 startup-name">
                      {connection?.creative?.name}
                    </div>
                    <div
                      className="col-sm-4 col-xs-12 unarchive"
                      onClick={() => {
                        archiveConnection(connection?.id, false);
                        setPageState(OVERVIEWPAGESTATE.OVERVIEW);
                      }}
                    >
                      UNARHIVE
                    </div>
                    <div
                      className="col-sm-4 col-xs-12 delete-permanently"
                      onClick={() => setPageState(OVERVIEWPAGESTATE.OVERVIEW)}
                    >
                      DELETE PERMANENTLY
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
