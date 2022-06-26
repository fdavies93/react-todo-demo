import { createSlice } from "@reduxjs/toolkit";
import { fetchJson } from "../../utilitiies";

const initialState = {
    todos: []
}

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    add: (state, action) => {
        console.log(action)
        state.todos.push( { text: action.payload.title, done: false, id: action.payload.id } )
        console.log(state.todos)
    },
    remove: (state, action) => {
        state.todos = state.todos.filter( (item) => !action.payload.includes(item.id) )
    },
    rename: (state, action) => {
        state.todos.forEach( (todo) => { if (todo.id == action.payload.id) todo.name = action.payload.name; } )
    },
    toggle: (state, action) => {
        state.todos.forEach( (todo) => { if (todo.id == action.payload.id) todo.done = !todo.done; } )
    }
  }
})

export const {add, remove, rename, toggle } = todoSlice.actions
export default todoSlice.reducer

export const addAsync = (title, endpoint) => (dispatch) => {
    fetchJson(endpoint, {"items": [title]}, "POST").then( (json) => {
        dispatch( add(json) )
    })
}

/* // The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const incrementAsync = (amount) => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
} */