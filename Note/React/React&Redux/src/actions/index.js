export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const SET_VITIBILITY_FILTER = 'SET_VITIBILITY_FILTER'
export const DELETE_TODO = 'DELETE_TODO'
export const CLEAR_COMPLETED = 'CLEAR_COMPLETED'
export const COMPLETE_ALL = 'COMPLETE_ALL'
export const FILTER_TYPE = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
}

let nextTodoID = 0
export const addTodo = text => ({
    type: ADD_TODO,
    id: nextTodoID++,
    text
})

export const setVisibilityFilter = filter => ({type: SET_VITIBILITY_FILTER, filter})

export const toogleTodo = id => ({type: TOGGLE_TODO, id})

export const deleteTodo = id => ({type: DELETE_TODO, id})

export const clearCompleted = () => ({type: CLEAR_COMPLETED})

export const completeAllTodo = status => ({type: COMPLETE_ALL, status})
