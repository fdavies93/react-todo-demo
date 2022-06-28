import React, { useEffect, useState } from 'react';
import {Container, Row, Col, Table, Form, FormControl, Button, InputGroup} from 'react-bootstrap';
import TodoItem from './TodoItem';
import ListControls from './ListControlsFn';
import { useSelector, useDispatch } from 'react-redux';
import { add, remove, set } from '../features/todo/todoSlice'
import { fetchJson } from '../utilitiies'

function TodoList (props) {
    const [loaded, setLoaded] = useState(false);
    const endpoint = props.endpoint;
    const items = useSelector( (state) => state.todos )
    const dispatch = useDispatch()
    console.log(items)

    useEffect( (state) => {

      if (!loaded) {
        fetchJson(endpoint, {}, "GET").then( (json) => {
          setLoaded(true)
          dispatch(set(json))
        } )
    }
    } )

    const onItemDelete = (id) => {
        fetchJson(endpoint + "/" + id, {}, "DELETE").then( (json) => {
            // setState( {
            //   items: state.items.filter( (item) => !json.includes(item.id) )
            // })
          } )
    }

    const onItemCreate = (title) => {
      fetchJson(endpoint, {"items": [title]}, "POST").then( (json) => {
        // setState( {
        //   items: state.items.concat(json)
        // } )
      } )
    }

    const onItemCheck = (itemId, newState) => {
        return fetchJson(endpoint + "/" + itemId, {"done": newState}, "PATCH");
    }

    const onItemChangeTitle = (itemId, newTitle) => {
        return fetchJson(endpoint + "/" + itemId, {"text": newTitle}, "PATCH");
    }

    const todoItems = items.map( (item) => <TodoItem onChangeTitle={onItemChangeTitle} onCheck={onItemCheck} onDelete={onItemDelete} key={item.id} id={item.id} title={item.text} done={item.done}/> )
    return <Container> <Row> <Col> <Table hover><tbody> {todoItems} </tbody> </Table> </Col> </Row> <ListControls onCreate={onItemCreate} /></Container>;
}

  export default TodoList;