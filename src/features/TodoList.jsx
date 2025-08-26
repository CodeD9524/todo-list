
import React from 'react';
import TodoListItem from './TodoListItem';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  return (
    <>
      {isLoading ? (
        <p>Todo list loading...</p>
      ) : (
        todoList.length > 0 ? (
          <ul>
            {todoList.map((todo) => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                onCompleteTodo={onCompleteTodo}
                onUpdateTodo={onUpdateTodo}
              />
            ))}
          </ul>
        ) : (
          <p>No todos found. Add a new todo!</p>
        )
      )}
    </>
  );
}

export default TodoList;
