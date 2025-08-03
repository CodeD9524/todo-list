// App.js
import React, { useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

function App() {
  const [todoList, setTodoList] = useState([]);

  const addTodo = (newTodoTitle) => {
    setTodoList((prevTodoList) => [
      ...prevTodoList,
      { id: Date.now(), title: newTodoTitle }
    ]);
  };

  return (
    <div>
      <h1>My Todo App</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} /> 
    </div>
  );
}

export default App;
