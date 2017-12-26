import React, {Component} from 'react'
import {number, string} from 'prop-types'

export default class Footer extends Component {
    static propTypes = {
        lefted: number,
        filter: string
    }
    static defaultProps = {
        lefted: 0,
        filter: 'SHOW_ALL'
    }
    state = {
        footerItem: [
            {
                label: 'All',
                value: 'SHOW_ALL'
            }, {
                label: 'Active',
                value: 'SHOW_ACTIVE'
            }, {
                label: 'Completed',
                value: 'SHOW_COMPLETED'
            }
        ]
    }
    filter(data) {
        this.props.filterTodos(data)
    }
    render() {
        return (
            <footer className="footer">
                <span className="todo-count">
                    <strong>
                        {this.props.lefted}
                    </strong>
                    <span></span>
                    <span>
                        items
                    </span>
                    <span>
                        left
                    </span>
                </span>
                <ul className="filters">
                    {this
                        .state
                        .footerItem
                        .map((item, index) => (
                            <li key={index}>
                                <a
                                    href={`#/${item.label}`}
                                    className={item.value === this.props.filter
                                    ? 'selected'
                                    : undefined}
                                    onClick={this
                                    .filter
                                    .bind(this, item.value)}>{item.label}</a>
                            </li>
                        ))}
                </ul>
                <button className="clear-completed" onClick={this.props.clear}>
                    Clear completed
                </button>
            </footer>
        )
    }
}
