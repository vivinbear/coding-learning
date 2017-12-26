import React, {Component} from 'react'
import {object, number} from 'prop-types'

export default class Todo extends Component {
    static propTypes = {
        item: object,
        index: number
    }
    static defaultProps = {
        item: {},
        index: 0
    }
    deleteTodoItem(index) {
        this
            .props
            .delete(index)
    }
    toggle(index) {
        this
            .props
            .toggle(index)
    }
    render() {
        let className = this.props.item.completed
            ? 'completed'
            : ''
        return (
            <li className={className}>
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={this.props.item.completed}
                        onChange={this
                        .toggle
                        .bind(this, this.props.item.id)}/>
                    <label>
                        {this.props.item.text}
                    </label>
                    <button
                        className="destroy"
                        onClick={this
                        .deleteTodoItem
                        .bind(this, this.props.item.id)}></button>
                </div>
                <input type="text" className="edit" value={this.props.item.title}/>
            </li>
        )
    }
}
