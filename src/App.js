import React, { useState } from 'react';
import _ from 'lodash';

import { addTodo, removeTodo } from './store';
import { connect } from './meact-redux';

const AppComponent = ({ todos, addTodo, removeTodo }) => {
  const [text, setText] = useState('');

  const handleAddClick = todo => {
    addTodo(todo);
  };

  const handleDeleteClick = todo => {
    removeTodo(todo.id);
  };

  const handleChange = event => {
    setText(event && event.target && event.target.value);
  };

  return (
    <div className="App">
      {todos &&
        todos.map(todo => (
          <div key={todo.id}>
            <h4>{todo.text}</h4>
            <button onClick={() => handleDeleteClick(todo)}>Delete</button>
          </div>
        ))}

      <div>
        <input type="text" onChange={handleChange} />
        <button onClick={() => handleAddClick({ id: _.uniqueId(), text })}>
          Add
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  todos: state.todos
});

const dispatchProps = {
  addTodo,
  removeTodo
};

export const App = connect(mapStateToProps, dispatchProps)(AppComponent);
