const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {id: action.id, text: action.text, completed: false}
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state
            }
            return Object.assign({}, state, {
                completed: !state.completed
            })
        default:
            return state
    }
}

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ]
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action))
        case 'DELETE_TODO':
            return state.filter(item => item.id !== action.id)
        case 'CLEAR_COMPLETED':
            return state.filter(item => !item.completed)
        case 'COMPLETE_ALL':
            return state.map(t => Object.assign({}, t, {completed: action.status}))
        default:
            return state
    }
}

export default todos