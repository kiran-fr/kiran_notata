import React from "react";

// CUSTOM COMPONENTS
import OverviewCard from "./components/OverviewCard";
import MainInputCard from "./components/MainInputCard";
import SimilarStartupsCard from "./components/SimilarStartupsCard";
import ArchiveAndDeleteSection from "./components/ArchiveAndDeleteSection";
import ChatCard from "./components/ChatCard";

// STYLES
import "./Overview.scss";

export default function Overview({
  connection,
  user,
  account,
  history,
  refetch,
}) {
  return (
    <>
      <div className="row tab-panel-container overview-container">
        <div className="col-sm-8">
          <OverviewCard connection={connection} history={history} />

          <MainInputCard
            connection={connection}
            user={user}
            account={account}
            history={history}
            refetch={refetch}
          />

          <SimilarStartupsCard connection={connection} history={history} />

          <ArchiveAndDeleteSection connection={connection} history={history} />
        </div>

        <div className="col-sm-4 col-xs-12 col-md-4 ">
          <ChatCard connection={connection} history={history} />
        </div>
      </div>
    </>
  );
}
