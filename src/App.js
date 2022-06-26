import './App.css';
import {Container, Row, Col, Table, Form, FormControl, Button, InputGroup} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {v4} from 'uuid';
import TodoList from './components/TodoList';

const endpoint = process.env.REACT_APP_ENDPOINT;

function App() {
  console.log(endpoint)
  return (
    <TodoList endpoint={endpoint}/>
  );
}

export default App;