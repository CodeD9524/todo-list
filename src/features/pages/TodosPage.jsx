import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TodoForm from '../TodoForm.jsx';
import TodoList from '../TodoList.jsx';
import TodosViewForm from '../TodosViewForm.jsx';
import styles from "../../Apps.module.css";
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from '../reducers/todo.reducer.jsx';

function TodosPage() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    todoList,
    isLoading,
    isSaving,
    isUpdating,
    errorMessage
  } = todoState;

  const initialSortField = searchParams.get('sortField') || "createdTime";
  const initialSortDirection = searchParams.get('sortDirection') || "desc";
  const initialQueryString = searchParams.get('query') || "";

  const [sortField, setSortField] = useState(initialSortField);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);
  const [queryString, setQueryString] = useState(initialQueryString);

  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const totalPages = Math.ceil(todoList.length / itemsPerPage);

  const baseUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;
  const handlePreviousPage = () => {
    const newPage = Math.max(1, currentPage - 1);
    const currentParams = Object.fromEntries([...searchParams]);
    setSearchParams({ ...currentParams, page: newPage.toString() });
  };
  const handleNextPage = () => {
    const newPage = Math.min(totalPages, currentPage + 1);
    const currentParams = Object.fromEntries([...searchParams]);
    setSearchParams({ ...currentParams, page: newPage.toString() });
  };
  useEffect(() => {
    if (todoList.length === 0 && !isLoading) {
    
      if (currentPage !== 1) {
        navigate("/");
      }
      return;
    }

    if (totalPages > 0) {
      const isPageValid = !isNaN(currentPage) && currentPage >= 1 && currentPage <= totalPages;

      if (!isPageValid) {
        navigate("/");
      }
    }
  }, [currentPage, totalPages, navigate, todoList.length, isLoading]); 

  useEffect(() => {
    const newSearchParams = {};
    if (sortField !== "createdTime") {
      newSearchParams.sortField = sortField;
    }
    if (sortDirection !== "desc") {
      newSearchParams.sortDirection = sortDirection;
    }
    if (queryString) {
      newSearchParams.query = queryString;
    }
    if (currentPage > 1) {
      newSearchParams.page = currentPage.toString();
    } else {
      delete newSearchParams.page;
    }
    setSearchParams(newSearchParams);
  }, [sortField, sortDirection, queryString, currentPage, setSearchParams]);

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";

    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${encodeURIComponent(queryString)}",+title)`;
    }

    return `${sortQuery}${searchQuery}`;
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

      const fetchUrl = `${baseUrl}?${encodeUrl()}`;
      const options = {
        method: "GET",
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(fetchUrl, options);

        if (!resp.ok) {
          const errorData = await resp.json();
          throw new Error(`Error: ${resp.status} ${errorData.error.message}`);
        }

        const data = await resp.json();

        const transformedData = data.records.map((record) => ({
          id: record.id,
          title: record.fields.title || '',
          isCompleted: record.fields.isCompleted || false,
        }));

        dispatch({ type: todoActions.loadTodos, records: transformedData });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
      } finally {
        dispatch({ type: todoActions.endRequest });
      }
    };

    fetchTodos();
  }, [encodeUrl, baseUrl, token]);

  const addTodo = async (newTodoTitle) => {
    dispatch({ type: todoActions.startRequest });

    try {
      const payload = {
        records: [
          {
            fields: {
              title: newTodoTitle,
              isCompleted: false,
            },
          },
        ],
      };

      const options = {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };

      const resp = await fetch(baseUrl, options);

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(`Error: ${resp.status} ${errorData.error.message}`);
      }

      const { records } = await resp.json();

      dispatch({ type: todoActions.addTodo, record: records[0] });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    dispatch({ type: todoActions.completeTodo, id });

    const updatedTodo = { ...originalTodo, isCompleted: !originalTodo.isCompleted };

    try {
      const payload = {
        records: [
          {
            id: updatedTodo.id,
            fields: {
              title: updatedTodo.title,
              isCompleted: updatedTodo.isCompleted,
            },
          },
        ],
      };

      const options = {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };

      const resp = await fetch(`${baseUrl}/${updatedTodo.id}`, options);

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(`Error: ${resp.status} ${errorData.error.message}`);
      }

      dispatch({ type: todoActions.clearError });
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, editedTodo: originalTodo, error });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    if (!originalTodo) return;

    dispatch({ type: todoActions.updateTodo, editedTodo });

    try {
      const payload = {
        records: [
          {
            id: editedTodo.id,
            fields: {
              title: editedTodo.title,
              isCompleted: editedTodo.isCompleted,
            },
          },
        ],
      };

      const options = {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };

      const resp = await fetch(`${baseUrl}/${editedTodo.id}`, options);

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(`Error: ${resp.status} ${errorData.error.message}`);
      }

      dispatch({ type: todoActions.clearError });
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, editedTodo: originalTodo, error });
    }
  };

  return (
    <div className={styles.appContainer}>
      <h1>My Todo App</h1>
      {(isLoading || isUpdating) ? (
        <p>Loading...</p>
      ) : errorMessage ? (
        <p className={styles.errorMessage}>{errorMessage}</p>
      ) : (
        <>
          <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
          <TodoList
            todoList={todoList}
            onCompleteTodo={completeTodo}
            onUpdateTodo={updateTodo}
            isLoading={isLoading || isUpdating}
          />
          <div className="paginationControls">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage >= totalPages}>Next</button>
          </div>
          <hr />
          <TodosViewForm
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            queryString={queryString}
            setQueryString={setQueryString}
          />
          {errorMessage && (
            <div>
              <hr />
              <p className={styles.errorMessage}>{errorMessage}</p>
              <button onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TodosPage;
