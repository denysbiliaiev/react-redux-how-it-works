"use strict"

export const createStore = (reducer, initialState) => {
    let state = initialState || {};
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        //console.log(state);
        state = reducer(state, action);
        console.log(state);
        listeners.forEach( listener => {
            listener();
        });
    };

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            var listeners = listeners.filter(l => l != listener);
        }
    };

    dispatch({});//инициализируем состояние стора, проходит по редюсерам возвращает стейт указаный по умолчанию в аргументе.

    return { getState, dispatch, subscribe };
}

export const combineReducers = (reducers) => {
    return (state, action) => {// будет вызвана в createStore dispatch
        return Object.keys(reducers).reduce((nextState, key) => {
            //проходимся по редьсерам, в nextState[key](ветки стора), данные заменяются результатами из редюсеров
            nextState[key] = reducers[key](state[key], action);

            //console.log(nextState);
            return nextState;//возвращаем новый state стора
        }, {});
    }
};

//reducer composition whith object (combine reducer)- каждому редюсеру передается своя ветка из store, result single object
const testCombineReducer = (state = {}, action) => {
    return {
        todos: todos(state.todos, action),
        visibilityFilter: visibilityFilter(state.visibilityFilter, action)
    }
}




