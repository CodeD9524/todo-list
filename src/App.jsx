import React, { useState, useEffect } from 'react';
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList'

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false); 
  const [isUpdating, setIsUpdating] = useState(false); 

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: "GET",
        headers: {
          "Authorization": token,
        },
      };

      try {
        const resp = await fetch(url, options);

        if (!resp.ok) {
          const errorData = await resp.json();
          throw new Error(`Error: ${resp.status} ${errorData.error.message}`);
        }

        const data = await resp.json();
        console.log("data ===> ", data);

        const transformedData = data.records.map((record) => {
          const todo = {};
          todo.id = record.id;
          todo.title = record.fields.title || '';
          todo.isCompleted = record.fields.isCompleted ? record.fields.isCompleted : false;
          return todo;
        });
        console.log("transformedData ===> ", transformedData);

        setTodoList(transformedData);
      } catch (error) {
        setErrorMessage(`Failed to fetch todos: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

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

      const resp = await fetch(url, options); 

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

      const resp = await fetch(url, options);

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

      const resp = await fetch(url, options);

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
    <div>
     <h1>My Todo App</h1>
     {isLoading || isUpdating ? ( 
       <p>Loading...</p>
     ) : errorMessage ? (
       <p style={{ color: 'red' }}>{errorMessage}</p>
     ) : (
       <>
         <TodoForm onAddTodo={addTodo} isSaving={isSaving} /> 
         <TodoList
           todoList={todoList}
           onCompleteTodo={completeTodo}
           onUpdateTodo={updateTodo}
           isLoading={isLoading || isUpdating} 
         />
         {errorMessage && (
           <div>
             <hr />
             <p style={{ color: 'red' }}>{errorMessage}</p>
             <button onClick={() => setErrorMessage("")}>Dismiss</button>
           </div>
         )}
       </>
     )}
    </div>
  );
}

export default App;
