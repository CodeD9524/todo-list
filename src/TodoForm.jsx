import React from 'react';

const TodoForm = ({ onAddTodo }) => {
  const handleAddTodo = (event) => {
    event.preventDefault();

    const todoTitle = event.target.title.value;
    console.dir(event.target.title);
    onAddTodo(todoTitle);
    event.target.reset(); 
  };



  return (
    <form onSubmit={handleAddTodo}> {}
      <label htmlFor="todoTitle">Todo</label>
      <input type="text" id="todoTitle" name="title" />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default TodoForm;
