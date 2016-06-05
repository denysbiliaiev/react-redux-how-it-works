"use strict"

const todo = (state, action) => {
    if (action.type == 'ADD_TODO') {
        return  {
            id: action.id,
            text: action.text,
            completed: false
        }
    }

    if (action.type == 'TOGGLE_TODO') {
        //console.log(state);
        if (state.id !== action.id) {
            return state;
        }

        return {
            ...state,
            completed: !state.completed
        };
    }

    return state;
}

export const todos = (state = [], action) => {
    if (action.type == 'ADD_TODO') {
        return [
            ...state,
            todo(undefined, action)
        ];
    }

    if (action.type == 'TOGGLE_TODO') {
        return state.map(t => todo(t, action));//reducer composition with arrays
    }

    return state;
}

export const visibilityFilter = (state = 'SHOW_ALL', action) => {
    if (action.type == 'CHANGE_VISIBILITY_FILTER') {
        return action.filter;
    }

    return state;
}
