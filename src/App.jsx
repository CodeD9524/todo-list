
import React, { useState, useEffect, useCallback } from 'react';
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList';
import TodosViewForm from './features/TodosViewForm';
import styles from "./Apps.module.css";
function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState(""); // New state for queryString with empty string initial value

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
      setIsLoading(true);
  
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
  
        setTodoList(transformedData);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(`Failed to fetch todos: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTodos();
  }, [encodeUrl]);
  

  const addTodo = async (newTodoTitle) => {
    setIsSaving(true);

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
          "Authorization": token,
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

      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      setTodoList((prevTodoList) => [...prevTodoList, savedTodo]);
      setErrorMessage("");

    } catch (error) {
      console.error("Failed to add todo:", error);
      setErrorMessage(`Failed to add todo: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = async (id) => {
    setIsUpdating(true);
    const originalTodo = todoList.find((todo) => todo.id === id);

    setTodoList((prevTodoList) =>
      prevTodoList.map((todo) => (todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo))
    );

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
          "Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };

      const resp = await fetch(baseUrl, options);

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(`Error: ${resp.status} ${errorData.error.message}`);
      }
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to complete/uncomplete todo:", error);
      setErrorMessage(`${error.message}. Reverting completion status...`);
      if (originalTodo) {
        setTodoList((prevTodoList) =>
          prevTodoList.map((todo) => (todo.id === originalTodo.id ? originalTodo : todo))
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const updateTodo = async (editedTodo) => {
    setIsUpdating(true);
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

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
          "Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      };
      setTodoList((prevTodoList) =>
        prevTodoList.map((todo) => (todo.id === editedTodo.id ? editedTodo : todo))
      );

      const resp = await fetch(baseUrl, options);

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(`Error: ${resp.status} ${errorData.error.message}`);
      }
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to update todo:", error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      if (originalTodo) {
        setTodoList((prevTodoList) =>
          prevTodoList.map((todo) => (todo.id === originalTodo.id ? originalTodo : todo))
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.appContainer}>
      <h1>My Todo App</h1>
      {isLoading || isUpdating ? (
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
              <button onClick={() => setErrorMessage('')}>Dismiss</button>
            </div>
          )}
        </>
      )}
    </div>
  );
  
}

export default App;
