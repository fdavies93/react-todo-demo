import React from 'react';
import {Container, Row, Col, Table, Form, FormControl, Button, InputGroup} from 'react-bootstrap';

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
      this.setState( {title: event.target.value} );
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

  export default TodoItem