import React, { useState, useEffect, useCallback, useReducer } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodosViewForm from './TodosViewForm';
import styles from "../Apps.module.css";
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todo.reducer';

function TodosPage() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const {
    todoList,
    isLoading,
    isSaving,
    isUpdating,
    errorMessage
  } = todoState;

  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("");

  const baseUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";

    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
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
