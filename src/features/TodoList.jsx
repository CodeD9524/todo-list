import React from 'react';
import TodoListItem from './TodoListItem';
import styles from "./TodoList.module.css"; 

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, onRemoveTodo, isLoading }) { 
  return (
    <>
      {isLoading ? (
        <p>Todo list loading...</p>
      ) : (
        todoList.length > 0 ? (
          <ul className={styles.todoList}>
            {todoList.map((todo) => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                onCompleteTodo={onCompleteTodo}
                onUpdateTodo={onUpdateTodo}
                onRemoveTodo={onRemoveTodo} //
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
