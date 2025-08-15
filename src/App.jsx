// App.js
import React, { useState } from 'react';
import TodoForm from './features/TodoForm';
import TodoList from '../features/TodoList'

function App() {
  const [todoList, setTodoList] = useState([]);

  const addTodo = (newTodoTitle) => {
    setTodoList((prevTodoList) => [
      ...prevTodoList,
      { id: Date.now(), title: newTodoTitle, isCompleted: false }
    ]);
  };

  const completeTodo = (id) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  };

  return (
    <div>
      <h1>My Todo App</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;