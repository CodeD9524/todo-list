// TodoListItem.js
import React from 'react';

function TodoListItem({ todo, onCompleteTodo }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => onCompleteTodo(todo.id)}
      />
      <form>
        {todo.title}
      </form>
    </li>
  );
}

export default TodoListItem;
