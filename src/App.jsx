import React from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

function App() {
  const todos = [
    {id: 1, title: "review resources"},
    {id: 2, title: "take notes"},
    {id: 3, title: "code out app"},
]

  return (
<div>
      <h1>My Todo's</h1>
      <TodoForm />
      <TodoList todos={todos} / >
      <ul>
            {todos.map(todo => <li key={todo.id}>{todo.title}</li>)}

        </ul>
            </div>
            
  )
}

export default App