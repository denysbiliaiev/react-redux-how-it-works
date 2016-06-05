'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, connect} from 'react-redux';//Provider передает стор в контекст, connect рендерит компонент с указаным стейт и коллбеками
import {createStore, applyMiddleware, combineReducers, compose, bindActionCreators} from 'redux';
import {todos, visibilityFilter} from './reducers';
import {createAction} from 'redux-actions'
import {aa} from 'async-await'
import {coMiddleware} from 'redux-co'
import {promiseMiddleware} from 'redux-promise';

const getVisibleTodos = (todos, filter) => {
    if (filter === 'SHOW_ALL') {
        return todos;
    }

    if (filter === 'SHOW_COMPLETED') {
        return todos.filter(t => t.completed);
    }

    if (filter === 'SHOW_ACTIVE') {
        return todos.filter(t => !t.completed);
    }

    return todos;
}

const Link = ({active, children, onClick}) => {
    if (active) {
        return <span> {children} </span>;
    }

    return (
        <a
            href='#'
            onClick = {(e) => {
                e.preventDefault();
                onClick();
            }}
        >

            {children}
        </a>
    )
}

//connect(возвращает props для Component, возвращает props(callback) для Component)(Component);
const mapStateToLinkProps= (state, props) => {
    return {
        active: props.filter === state.visibilityFilter
    }
}

const mapDispathToLinkProps = (dispatch, props) => {
    return {
        onClick : (filter) => {
            dispatch({
                type: "CHANGE_VISIBILITY_FILTER",
                filter: props.filter
            })
        }

    }
}

//generate container component (wrapper) that render a presentation component
const FilterLink = connect(
    mapStateToLinkProps, //возвращает props для Link
    mapDispathToLinkProps //возвращает props (callback) для Link
)(Link);

const Fotter = ({visibilityFilter, onFilterClick}) => (
    <p>
        Show:
        {' '}
        <FilterLink filter="SHOW_ALL">all</FilterLink>
        {' '}
        <FilterLink filter="SHOW_COMPLETED">completed</FilterLink>
        {' '}
        <FilterLink filter="SHOW_ACTIVE">active</FilterLink>
    </p>
);

const Todo = ({text, completed, onClick}) => (
    <li
        onClick = {onClick}
        style = {{
            textDecoration:
                completed ?
                    'line-through' :
                    'none'
        }}
    >
        {text}
    </li>

);

const TodoList = ({todos, onTodoClick}) => (
        <ul>
            {todos.map(todo =>
                <Todo
                    key={todo.id}
                    {...todo}
                    onClick={() => onTodoClick(todo.id)}
                />
            )}
        </ul>
);

//this props update if stope state changes
const mapStateToTodoListProps = (state) => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
}

const mapDispatchToTodoListProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch({
                type: "TOGGLE_TODO",
                id
            })
        }
    }
}

//передает значения ф-ций в props presentation component(TodoList), возвращает container component.
const VisibleTodoList = connect(mapStateToTodoListProps, mapDispatchToTodoListProps)(TodoList);


let nextTodoId = 0;

let AddTodo = ({ dispatch }) => { // { store } = context
    let input;

    return (
        <div>
            <input ref={(node) => {
                input = node;
            }}>
            </input>
            <button
                onClick={() => {
                    dispatch({
                        type: 'ADD_TODO',
                        id: nextTodoId++,
                        text: input.value
                    })
                    input.value = '';
                }}
            >
                add todo
            </button>
        </div>
    );
}

AddTodo = connect()(AddTodo);
//or
// AddTodo = connect(
//     (state, props) => {//null
//         return {}
//     },
//     (dispatch, props) => {
//         return {dispatch}
//     }
// )(AddTodo);


const TodoApp = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Fotter />
    </div>
)

//combine reducer - каждому редюсеру передается своя ветка из store, result single object
const test = createAction('FETCH_THING', async id => {
    const result = await new Promise.resolve().then(() => 'text');
    return result;
});

const logger = store => next => action => {
    console.group(action.type)

    return next(action);//next(action) обязателен, иначе обработка дальше не пойдет
}

// var createStoreWithMiddlewares = compose(
//     applyMiddleware(myMiddlevare, window.devToolsExtension()),
// )(createStore);

const todoApp = combineReducers({
    todos,
    visibilityFilter
});

var store = createStore(todoApp, {}, compose(applyMiddleware(logger), window.devToolsExtension()));

ReactDOM.render(
    <Provider store={store}>
        <TodoApp />
    </Provider>,
    document.getElementById('root')
);


