// TodoList.js
import React from 'react';
import TodoListItem from './TodoListItem';

function TodoList({ todoList, onCompleteTodo }) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  return (
    <ul>
      {filteredTodoList.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} />
      ))}
    </ul>
  );
}

export default TodoList;
