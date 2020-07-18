import React from "react";
import moment from "moment";
import NewTagsFilter from "./NewTagsFilter";

const FilterSection = ({ tags, filters, setFilters, isOpen }) => (
  <div>
    <NewTagsFilter
      isOpen={isOpen}
      n_tags={filters.n_tags || []}
      n_funnel={filters.n_funnel || []}
      tags={tags || []}
      setTags={n_tags => {
        let _filters = { ...filters, n_tags };
        setFilters(_filters);
      }}
      setFunnel={n_funnel => {
        let _filters = { ...filters, n_funnel: n_funnel.map(f => f.id) };
        setFilters(_filters);
      }}
    />
  </div>
);

export default FilterSection;
