import React, { useState, useEffect } from 'react';

const TodosViewForm = ({ sortField, setSortField, sortDirection, setSortDirection, queryString, setQueryString }) => {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);

  return (
    <>
      <div>
        <label htmlFor="search">Search todos:</label>
        <input
          type="text"
          id="search"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <button type="button" onClick={() => setLocalQueryString("")}>
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
