import React from 'react';

const TodosViewForm = ({ sortField, setSortField, sortDirection, setSortDirection, queryString, setQueryString }) => {
  return (
    <>
      <div>
        <label htmlFor="search">Search todos:</label>
        <input
          type="text"
          id="search"
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
        />
        <button type="button" onClick={() => setQueryString("")}>
          Clear
        </button>
      </div>

      <div>
        <label htmlFor="sortField">Sort by:</label>
        <select
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="createdTime">Created Time</option>
          <option value="title">Title</option>
        </select>

        <label htmlFor="sortDirection">Direction:</label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </>
  );
};

export default TodosViewForm;
