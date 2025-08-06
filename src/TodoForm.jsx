import React, { useState } from 'react';

const TodoForm = ({ onAddTodo }) => {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();

    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        type="text"
        id="todoTitle"
        name="title"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
      />
      <button type="submit" disabled={workingTodoTitle === ''}>Add Todo</button>
    </form>
  );
};

export default TodoForm;
