import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import TodoList from './components/TodoListFn';
import { store } from './store'
import { Provider } from 'react-redux'

const endpoint = process.env.REACT_APP_ENDPOINT;

function App() {
  console.log(endpoint)
  return (
    <Provider store={store}>
      <TodoList endpoint={endpoint}/>
    </Provider>
  );
}

export default App;