import { Table, Modal } from "Components/UI_Kits";
import tableColumns from "./TableColumns";
import SelectTagsForStartup from "./SelectTagsForStartup";
// API
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { connectionsGet } from "private/Apollo/Queries";
import { connectionSetStar } from "private/Apollo/Mutations";
// FUNCTIONS
import applyFilters from "./applyFilters";
import { Table, Modal } from "Components/UI_Kits";
import tableColumns from "./TableColumns";
import { Card } from "Components/elements";
import { tableScroll } from "./Connections.module.css";

function ListOfStartups({ filters, currentPage, history }) {
  // States (for modal)
  const [showTagGroupForId, setShowTagGroupForId] = useState();
  const [showSubjectiveScoreForId, setShowSubjectiveScoreForId] = useState();
  const [showFunnelScoreForId, setShowFunnelScoreForId] = useState();

  // Queries
  const { data, called, loading, error, fetchMore } = useQuery(connectionsGet, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    variables: {
      LastEvaluatedId: undefined,
    },
  });

  // Fetch more
  useEffect(() => {
    let LastEvaluatedId = currentPage && currentPage.LastEvaluatedId;
    let variables = { LastEvaluatedId };
    fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
    });
  }, [currentPage]);

  // Define data
  const connections = data?.connectionsGet || [];

  // Filter data
  const filteredConnections = applyFilters({ connections, filters });

  // Mutations
  const [setStarMutation] = useMutation(connectionSetStar);

  const columns = tableColumns({
    history,
    setStarMutation,
    setShowTagGroupForId,
    setShowSubjectiveScoreForId,
    setShowFunnelScoreForId,
  });

  return (
    <Card maxWidth={1000} className={tableScroll} noMargin={true}>
      <Table
        dataSource={filteredConnections}
        columns={columns}
        disableHead={false}
        pagination={false}
        allowSorting={true}
        loading={loading}
        emptyLabel={"No results."}
      />
      {showTagGroupForId && (
        <SelectTagsForStartup
          connection={connections.find(({ id }) => id === showTagGroupForId)}
          close={() => setShowTagGroupForId(undefined)}
        />
      )}
    </Card>
  );
}
