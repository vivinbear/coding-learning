import React, {Component} from 'react'
import Header from './header'
import Footer from './footer'
import TodoList from './todoList'
import {connect} from 'react-redux'
import {
    addTodo,
    FILTER_TYPE,
    setVisibilityFilter,
    toogleTodo,
    deleteTodo,
    clearCompleted,
    completeAllTodo
} from '../actions'

import './index.css'

class AppIndex extends Component {
    deleteTodo(key) {
        this.setState((prve) => ({
            todolist: {
                todos: prve
                    .todolist
                    .todos
                    .filter((item, index) => {
                        return index !== key
                    })
            }
        }))
    }
    toggle() {}
    render() {
        const {dispatch, filter} = this.props
        let {todoList} = this.props
        let lefted = todoList.reduce((acc, todo) => {
            return todo.completed
                ? acc
                : acc + 1
        }, 0)
        return (
            <div>
                <Header
                    name='todos'
                    change={text => {
                    dispatch(addTodo(text))
                }}/>
                <TodoList
                    todoList={todoList}
                    delete={key => {
                    dispatch(deleteTodo(key))
                }}
                    toggle={key => {
                    dispatch(toogleTodo(key))
                }}
                    toggleAll={type => {
                    dispatch(completeAllTodo(type))
                }}/>
                <Footer
                    lefted={lefted}
                    filter={filter}
                    filterTodos={filter => {
                    dispatch(setVisibilityFilter(filter))
                }}
                    clear={() => {
                    dispatch(clearCompleted())
                }}/>
            </div>
        )
    }
}

let filterTodo = (todos, filter) => {
    switch (filter) {
        case FILTER_TYPE.SHOW_ALL:
            return todos;
        case FILTER_TYPE.SHOW_ACTIVE:
            return todos.filter(t => !t.completed)
        case
            FILTER_TYPE.SHOW_COMPLETED:
            return todos.filter(t => t.completed)
        default:
            return todos
    }
}

let select = (state) => {
    return {
        filter: state.visibilityFilter,
        todoList: filterTodo(state.todos, state.visibilityFilter)
    }
}

export default connect(select)(AppIndex)