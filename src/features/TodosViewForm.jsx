import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
const StyledDiv = styled.div`
  display: flex;
  gap: 0.5em;
  align-items: center;
  margin-bottom: 1em; 
  padding: 0.5em;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const StyledSearchInput = styled.input`
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledClearButton = styled.button`
  padding: 0.5em 1em;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const StyledSortSelect = styled.select`
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledDirectionSelect = styled.select`
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
function TodosViewForm({
    sortDirection,
    setSortDirection,
    sortField,
    setSortField,
    queryString,
    setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);
    useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);
   

  return (
    <>
      <StyledDiv> {}
        <label htmlFor="search">Search todos:</label>
        <StyledSearchInput 
          type="text"
          id="search"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <StyledClearButton type="button" onClick={() => setLocalQueryString("")}> {}
          Clear
        </StyledClearButton>
      </StyledDiv>

      <StyledDiv> {}
        <label htmlFor="sortField">Sort by:</label>
        <StyledSortSelect
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="createdTime">Created Time</option>
          <option value="title">Title</option>
        </StyledSortSelect>

        <label htmlFor="sortDirection">Direction:</label>
        <StyledDirectionSelect 
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </StyledDirectionSelect>
      </StyledDiv>
    </>
  );
};


export default TodosViewForm;
