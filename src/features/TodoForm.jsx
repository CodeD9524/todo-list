import React, { useState } from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  padding: 1em; 
  display: flex;
  gap: 0.5em; 
  align-items: center;
`;

const StyledInput = styled.input`
  padding: 0.5em;
  margin: 0.5em; 
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledButton = styled.button`
  padding: 0.5em 1em; /* Small amount of padding */
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    font-style: italic; 
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const TodoForm = ({ onAddTodo, isSaving }) => {
  const = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();

    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
  };

  return (
    <StyledForm onSubmit={handleAddTodo}> {}
      <label htmlFor="todoTitle">Todo</label>
      <StyledInput
        type="text"
        id="todoTitle"
        name="title"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        disabled={isSaving} 
      />
      <StyledButton
        type="submit" 
        disabled={workingTodoTitle === '' || isSaving} 
      >
        {isSaving ? "Saving..." : "Add Todo"} {}
      </StyledButton>
    </StyledForm>
  );
};

export default TodoForm;
