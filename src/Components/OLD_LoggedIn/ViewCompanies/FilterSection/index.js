import React from "react";
import { Mutation } from "react-apollo";
import Filters from "./Filters";
import NewTagsFilter from "./NewTagsFilter";
// import Sort from "./Sort";
import Search from "./Search";
import { putFilters } from "../../../../Apollo/Mutations";
// import { count_line } from "../ViewCompanies.module.css";

const FilterSection = ({
  evaluations,
  evaluationsSharedWithMe,
  tags,
  filters,
  search,
  setSearch,
  tagSearch,
  setTagSearch,
  startDate,
  resultCount
}) => {
  return (
    <Mutation mutation={putFilters}>
      {(mutate, mRes) => (
        <div>
          <div style={{ marginTop: "25px", marginBottom: "15px" }}>
            <Filters
              evaluations={evaluations}
              evaluationsSharedWithMe={evaluationsSharedWithMe}
              filters={filters.filters}
              startDate={startDate}
              updateFilters={_filters => {
                let variables = {
                  input: { filters: JSON.stringify(_filters) }
                };
                mutate({
                  variables,
                  optimisticResponse: {
                    __typename: "Mutation",
                    putFilters: {
                      ...filters,
                      filters: JSON.stringify(_filters)
                    }
                  }
                });
              }}
            />

            {
              <NewTagsFilter
                n_tags={filters.filters.n_tags || []}
                n_funnel={filters.filters.n_funnel || []}
                tags={tags}
                tagSearch={tagSearch}
                setTags={n_tags => {
                  let _filters = { ...filters.filters, n_tags };
                  let variables = {
                    input: { filters: JSON.stringify(_filters) }
                  };
                  mutate({
                    variables,
                    optimisticResponse: {
                      __typename: "Mutation",
                      putFilters: {
                        ...filters,
                        filters: JSON.stringify(_filters)
                      }
                    }
                  });
                }}
                setFunnel={n_funnel => {
                  let _filters = {
                    ...filters.filters,
                    n_funnel: n_funnel.map(f => f.id)
                  };
                  let variables = {
                    input: { filters: JSON.stringify(_filters) }
                  };
                  mutate({
                    variables,
                    optimisticResponse: {
                      __typename: "Mutation",
                      putFilters: {
                        ...filters,
                        filters: JSON.stringify(_filters)
                      }
                    }
                  });
                }}
              />
            }

            {
              <Search
                n_tags={filters.filters.n_tags || []}
                n_funnel={filters.filters.n_funnel || []}
                tags={tags}
                search={search}
                setSearch={_search => {
                  localStorage.setItem("search", _search);
                  setSearch(_search);
                }}
                tagSearch={tagSearch}
                setTagSearch={_tagSearch => {
                  setTagSearch(_tagSearch);
                }}
                setTags={n_tags => {
                  let _filters = { ...filters.filters, n_tags };
                  let variables = {
                    input: { filters: JSON.stringify(_filters) }
                  };
                  mutate({
                    variables,
                    optimisticResponse: {
                      __typename: "Mutation",
                      putFilters: {
                        ...filters,
                        filters: JSON.stringify(_filters)
                      }
                    }
                  });
                }}
                setFunnel={n_funnel => {
                  let _filters = {
                    ...filters.filters,
                    n_funnel: n_funnel.map(f => f.id)
                  };
                  let variables = {
                    input: { filters: JSON.stringify(_filters) }
                  };
                  mutate({
                    variables,
                    optimisticResponse: {
                      __typename: "Mutation",
                      putFilters: {
                        ...filters,
                        filters: JSON.stringify(_filters)
                      }
                    }
                  });
                }}
              />
            }
          </div>
        </div>
      )}
    </Mutation>
  );
};

export default FilterSection;
