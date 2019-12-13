import { createStore, combineReducers } from 'redux';

// action types
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';

// action creators
export const addTodo = payload => ({ type: ADD_TODO, payload });
export const removeTodo = payload => ({ type: REMOVE_TODO, payload });

// selectors
export const getTodos = state => state.todos;

// reducer
function todosReducer(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.payload];
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
}

// store
export const store = createStore(
  combineReducers({
    todos: todosReducer
  })
);
