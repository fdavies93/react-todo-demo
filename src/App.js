import './App.css';
import {Container, Row, Col, Table, Form, FormControl, Button, InputGroup} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {v4} from 'uuid';
import {Provider} from 'react-redux'
import { createStore } from 'redux'

const endpoint = process.env.ENDPOINT;

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

class TodoItemModel { // literally identical to the server code
  /**
   * @param {string} id 
   * @param {string} text 
   * @param {boolean} done 
   */
  constructor(id, text, done = false) {
    this.id = id;
    this.text = text;
    this.done = done;
  }
} 

/**
 * 
 * @param {string[]} text
 * @returns {TodoItemModel[]} 
 */
 function makeTodoItems(titles) {
  var items = [];
  titles.forEach( (title) => {
    items.push( new TodoItemModel( v4(), title ) );
  } )
  return items;
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
    //this.items = makeTodoItems(["Go and catch a falling star", "Get with child a mandrake root", "And swear", "Nowhere", "Lives a woman fair and true"]);
    // in reality, pull from backend
  }

  onItemCreate(title) {
    fetchJson(endpoint, {"items": [title]}, "POST").then( (json) => {
      this.setState( {
        items: this.state.items.concat(json)
      } )
    } )
  }

  onItemDelete(id) { // technically, request delete
    fetchJson(endpoint + "/" + id, {}, "DELETE").then( (json) => {
      this.setState( {
        items: this.state.items.filter( (item) => !json.includes(item.id) )
      })
    } )
    
  }
  
  onItemCheck(itemId, newState) {
    return fetchJson(endpoint + "/" + itemId, {"done": newState}, "PATCH");
  }

  onItemChangeTitle(itemId, newTitle) {
    return fetchJson(endpoint + "/" + itemId, {"text": newTitle}, "PATCH");
  }

  componentDidMount() {
    fetchJson(endpoint, {}, "GET").then( (json) => this.setState( { items: json } ) )
  }

  render() {
    const todoItems = this.state.items.map( (item) => <TodoItem onChangeTitle={this.onItemChangeTitle} onCheck={this.onItemCheck} onDelete={this.onItemDelete} key={item.id} id={item.id} title={item.text} done={item.done}/> )
    return <Container> <Row> <Col> <Table hover><tbody> {todoItems} </tbody> </Table> </Col> </Row> <ListControls onCreate={this.onItemCreate} /></Container>;
  }
}

class ListControls extends React.Component {
  constructor (props) {
    super(props)
    this.handleCreate = this.handleCreate.bind(this);
    this.onCreate = this.props.onCreate;
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.state = {
      title: ""
    }
  }

  createTodo() {
    this.onCreate(this.state.title);
    this.setState({title: ""});
  }

  handleKeyPress(event) {
    if(event.key === "Enter") {
      this.createTodo();
    }
  }

  handleCreate(event) {
    this.createTodo();
  }

  handleChange(event) {
    this.setState({title: event.target.value})
  }

  render() {
    return <Row><Col><InputGroup> <FormControl value={this.state.title} onChange={this.handleChange} onKeyPress={this.handleKeyPress}
    placeholder="New Todo"
  />
  <Button onClick={this.handleCreate} variant="secondary" id="button-addon2">
    Create Todo
  </Button> </InputGroup></Col></Row> 
  }
}

class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.id;
    this.deleteMe = props.onDelete;
    this.onCheck = props.onCheck;
    this.onChangeTitle = props.onChangeTitle;
    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleTitleKeyPress = this.handleTitleKeyPress.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.state = { title: props.title, done: props.done, editing: false };
  }

  handleClick(event) {
    this.onCheck(this.id, !this.state.done).then( (newState) => {
      this.setState({ done: newState.done })
    } )
  }

  handleDelete(event) {
    event.stopPropagation(); // stops the todo item from checking / unchecking
    this.deleteMe(this.id);
  }

  handleEdit(event) {
    event.stopPropagation(); // stops the todo item from checking / unchecking
    this.setState({ editing: true });
  }

  handleTitleKeyPress(event) {
    if (event.key == "Enter") {
      this.onChangeTitle(this.id, event.target.value).then( (newState) => {
        this.setState( { title: newState.text, editing: false } );
      } );
    }
  }

  handleTitleChange(event) {
    this.setState( {title: event.target.value});
  }

  handleInputClick(event) {
    event.stopPropagation();
  }
  
  render() {
    var titleContent;

    if (this.state.editing) titleContent = <Form.Control autoFocus type="text" value={this.state.title} onChange={this.handleTitleChange} onKeyPress={this.handleTitleKeyPress} onClick={this.handleInputClick}></Form.Control>
    else if (this.state.done) titleContent = <p><s>{this.state.title}</s></p>
    else titleContent = <p>{this.state.title}</p>

    return <tr className>
      <td className='col-1' onClick={this.handleClick}><Form.Check checked={this.state.done} onChange={this.handleClick} type="checkbox"/></td>
      <td className='col-9' onClick={this.handleClick} >{titleContent}</td>
      <td align="right" className='col-2' onClick={this.handleClick}><Button className='button-scale' onClick={this.handleEdit} variant="success">Edit</Button> <Button className='button-scale' onClick={this.handleDelete} variant="danger">Delete</Button></td>
    </tr>
  }
}

function App() {
  return (
    <Provider store={store}>
    <TodoList />
    </Provider>
  );
}

export default App;