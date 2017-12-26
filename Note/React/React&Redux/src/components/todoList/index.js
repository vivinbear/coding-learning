import React, {Component} from 'react'
import {array} from 'prop-types'
import Todo from '../todo'

export default class TodoList extends Component {
    static defaultProps = {
        todoList: []
    }
    static propTypes = {
        todoList: array
    }
    deleteToto(key) {
        this
            .props
            .delete(key)
    }
    toggleTodo(key) {
        this
            .props
            .toggle(key)
    }
    toggleAll(e) {
        this
            .props
            .toggleAll(!e)
    }
    render() {
        let isCheckAll = this.props.todoList.length === this
            .props
            .todoList
            .reduce((sum, item) => {
                if (item.completed) {
                    return++ sum
                }
                return sum
            }, 0)
        return (
            <section className="main">
                <input
                    className="toggle-all"
                    type="checkbox"
                    checked={isCheckAll}
                    onChange={this
                    .toggleAll
                    .bind(this, isCheckAll)}/>
                <ul className="todo-list">
                    {this
                        .props
                        .todoList
                        .map((todo, i) => {
                            return <Todo
                                item={todo}
                                key={i}
                                delete={this
                                .deleteToto
                                .bind(this)}
                                toggle={this
                                .toggleTodo
                                .bind(this)}/>
                        })}
                </ul>
            </section>
        )
    }
}
