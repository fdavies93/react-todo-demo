import React from 'react';
import {Container, Row, Col, Table, Form, FormControl, Button, InputGroup} from 'react-bootstrap';

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

  export default ListControls;