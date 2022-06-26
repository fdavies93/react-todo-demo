import React, { useState } from 'react';
import {Container, Row, Col, Table, Form, FormControl, Button, InputGroup} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { add, remove } from '../features/todo/todoSlice'


export const ListControls = (props) => {
  const [state, setState] = useState({title: ""})
  
  const onCreate = props.onCreate

  const createTodo = (title) => {
    const dispatch = useDispatch
    dispatch( add( {title: title} ) )
    onCreate(state.title)
  }

  const handleCreate = (event) => {
    createTodo()
  }

  const handleKeyPress = (event) => {
    if(event.key === "Enter") {
      createTodo()
    }
  }

  const handleChange = (event) => {
    setState({title: event.target.value})
  }

  return <Row><Col><InputGroup> <FormControl value={state.title} onChange={handleChange} onKeyPress={handleKeyPress}
      placeholder="New Todo"
    />
    <Button onClick={handleCreate} variant="secondary" id="button-addon2">
      Create Todo
    </Button> </InputGroup></Col></Row> 

}

export default ListControls;