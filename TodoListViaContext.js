'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers} from './redux';
import {todos, visibilityFilter} from './reducers';

//action creator
let nextTodoId = 0;
const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text
    }
}

//action creator
const toggleTodo = (id) => {
    return {
        type: "TOGGLE_TODO",
        id
    }
}

//action creator
const setVisibilityFilter = (filter) => {
    return {
        type: "CHANGE_VISIBILITY_FILTER",
        filter
    }
}


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

//container component
class FilterLink  extends React.Component {
    componentDidMount() {
        const { store } = this.context;
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const { store } = this.context;
        const state = store.getState();

        return (
            <Link
                active = {props.filter === state.visibilityFilter}
                onClick = { filter => {
                    store.dispatch(setVisibilityFilter(props.filter));
                }}
            >
                {props.children}
            </Link>
        )
    }
}
FilterLink.contextTypes = {//что пропускаем дальше
    store: React.PropTypes.object
}

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

//container component
class VisibleTodoList extends React.Component {
    componentDidMount() {
        const { store } = this.context;
        this.unsubscribe = store.subscribe(() => {//subscribe to the store and rerender where the store state changes
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const { store } = this.context;
        const state = store.getState();

        return(
            <TodoList
                todos = {getVisibleTodos(state.todos, state.visibilityFilter)}
                onTodoClick = {id => {
                    store.dispatch(toggleTodo(id))
                }}
            />
        );
    }
}
VisibleTodoList.contextTypes = {//что пропускаем дальше
    store: React.PropTypes.object
}

const AddTodo = (props, { store }) => { // { store } = context

    let input;

    return (
        <div>
            <input ref={(node) => {
                input = node;
            }}>
            </input>
            <button
                onClick={() => {
                    store.dispatch(addTodo(input.value));
                    input.value = '';
                }}
            >
                add todo
            </button>
        </div>
    );
}
AddTodo.contextTypes = {//что пропускаем дальше
    store: React.PropTypes.object
}

const TodoApp = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Fotter />
    </div>
)

class Provider extends React.Component {
    getChildContext() {
        return {
            store: this.props.store
        }
    }

    render() {
        return this.props.children
    }
}
Provider.childContextTypes = {//что пропускаем дальше
    store: React.PropTypes.object
}

//combine reducer - каждому редюсеру передается своя ветка из store, result single object
const todoApp = combineReducers({
    todos,
    visibilityFilter
});

ReactDOM.render(
    <Provider store = {createStore(todoApp)}>
        <TodoApp />
    </Provider>,
    document.getElementById('root')
);


