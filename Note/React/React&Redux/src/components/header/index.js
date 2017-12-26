import React, {Component} from 'react'
import {string} from 'prop-types'

export default class Header extends Component {

    static defaultProps = {
        name: '默认props'
    }
    static propTypes = {
        name: string
    }
    state = {
        inputValue: ''
    }
    change(e) {
        this.setState({inputValue: e.target.value})
    }
    enter(e) {
        if (e.keyCode === 13) {
            this
                .props
                .change(this.state.inputValue)
            this.setState({inputValue: ''})
        }
    }
    render() {
        return (
            <header className="header">
                <h1>{this.props.name}</h1>
                <input
                    className="new-todo"
                    placeholder="What needs to be done?"
                    value={this.state.inputValue}
                    onChange={this
                    .change
                    .bind(this)}
                    onKeyUp={this
                    .enter
                    .bind(this)}/>
            </header>
        )
    }
}
