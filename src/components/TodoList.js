import React from 'react';
import {Container, Row, Col, Table, Form, FormControl, Button, InputGroup} from 'react-bootstrap';
import TodoItem from './TodoItem';
import ListControls from './ListControls';

function fetchJson(url, data, method) {
    var data_obj = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    if (method !== "GET") {
        data_obj.method = method
        data_obj.body = JSON.stringify(data)
    }
    return fetch(url, data_obj).then( res => {
      //console.log(res);
      return res.json();
    } )
  }

class TodoList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        items: []
      }
      this.onItemDelete = this.onItemDelete.bind(this);
      this.onItemCreate = this.onItemCreate.bind(this);
      this.onItemCheck = this.onItemCheck.bind(this);
      this.onItemChangeTitle = this.onItemChangeTitle.bind(this);
      this.endpoint = props.endpoint;
      //this.items = makeTodoItems(["Go and catch a falling star", "Get with child a mandrake root", "And swear", "Nowhere", "Lives a woman fair and true"]);
      // in reality, pull from backend
    }
  
    onItemCreate(title) {
        console.log(this.endpoint)
      fetchJson(this.endpoint, {"items": [title]}, "POST").then( (json) => {
        this.setState( {
          items: this.state.items.concat(json)
        } )
      } )
    }
  
    onItemDelete(id) { // technically, request delete
      fetchJson(this.endpoint + "/" + id, {}, "DELETE").then( (json) => {
        this.setState( {
          items: this.state.items.filter( (item) => !json.includes(item.id) )
        })
      } )
      
    }
    
    onItemCheck(itemId, newState) {
      return fetchJson(this.endpoint + "/" + itemId, {"done": newState}, "PATCH");
    }
  
    onItemChangeTitle(itemId, newTitle) {
      return fetchJson(this.endpoint + "/" + itemId, {"text": newTitle}, "PATCH");
    }
  
    componentDidMount() {
      fetchJson(this.endpoint, {}, "GET").then( (json) => this.setState( { items: json } ) )
    }
  
    render() {
      const todoItems = this.state.items.map( (item) => <TodoItem onChangeTitle={this.onItemChangeTitle} onCheck={this.onItemCheck} onDelete={this.onItemDelete} key={item.id} id={item.id} title={item.text} done={item.done}/> )
      return <Container> <Row> <Col> <Table hover><tbody> {todoItems} </tbody> </Table> </Col> </Row> <ListControls onCreate={this.onItemCreate} /></Container>;
    }
  }

  export default TodoList;