import React, {useState} from "react";
import "./ArchivePage.scss";
import { useMutation, useQuery } from "@apollo/client";
import { connectionsGet } from "private/Apollo/Queries";
import { connectionPut } from "../../Apollo/Mutations";
import { GhostLoader } from "../../../Components/elements";

export default function ArchivePage({ history }) {
  const { data, loading, error } = useQuery(connectionsGet, {
    variables: { filters: { archived: true } },
  });

  const [archiveConnection, archiveConnectionRes] = useMutation(connectionPut);
  const [deleteConnection, deleteConnectionRes] = useMutation(connectionPut);
  const [archiveId, setArchiveId] = useState("");


  let archivedConnections = data?.connectionsGet || [];

  if (loading) {
    return <GhostLoader />;
  }

  return (
    <div className="row tab-panel-container archive-list-container">
      <div className="col-sm-12">
        <div className="card">
          <div className="heading">
            <i
              onClick={() => history.goBack()}
              class="fa fa-chevron-left"
              aria-hidden="true"
            />
            Archive
          </div>

          <div className="startups">Startups</div>
          <div className="archive-list-data">
            {!archivedConnections?.length && (
              <div>
                <div className="row">
                  <div className="col-sm-4 col-xs-12 startup-name">
                    Archive list is empty!!!
                  </div>
                  <div
                    className="col-sm-4 col-xs-12 delete-permanently"
                    onClick={() => history.goBack()}
                  >
                    Go back
                  </div>
                </div>
              </div>
            )}

            {!!archivedConnections?.length &&
              archivedConnections?.map((connection, index) => (
                <div className="row" key={`row-id-${index}`}>
                  <div className="col-sm-4 col-xs-12 startup-name">
                    {connection?.creative?.name}
                  </div>
                  <div
                    className="col-sm-4 col-xs-12 unarchive"
                    onClick={async () => {
                      if (archiveConnectionRes.loading) {
                        return;
                      }
                      setArchiveId(connection.id)

                      try {
                        let variables = {
                          id: connection.id,
                          input: {
                            archived: false,
                          },
                        };
                        await archiveConnection({ variables });
                      } catch (error) {
                        return console.log(error);
                      }
                    }}
                  >
                    {archiveConnectionRes.loading && archiveId === connection.id ? "...loading" : "UNARHIVE"}
                  </div>
                  <div
                    className="col-sm-4 col-xs-12 delete-permanently"
                    onClick={async () => {
                      if (deleteConnectionRes.loading) {
                        return;
                      }
                      setArchiveId(connection.id)
                      try {
                        let variables = {
                          id: connection.id,
                        };
                        await deleteConnection({ variables });
                      } catch (error) {
                        return console.log(error);
                      }
                    }}
                  >
                    {deleteConnectionRes.loading
                      ? "...deleting"
                      : "DELETE PERMANENTLY"}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
