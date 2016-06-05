'use strict'

import ReactDOM from 'react-dom';
import React from 'react';

import createStore from './redux';

function counterReducer(state = 0, action) {
    switch (action.type) {
        case "INCREMENT" :
            return state + 1;
        case "DECREMENT" :
            return state - 1;
        default:
            return state;
    }
}

var store = createStore(counterReducer);

const Counter = ({value, onIncrement, onDecrement}) => (
    <div>
        <span> {value} </span>
        <button onClick={onIncrement}>+</button>
        <button onClick={onDecrement}>-</button>
    </div>
)

var render = () => {
    ReactDOM.render(
        <Counter
            value = {store.getState()}
            onIncrement = {() => {
                store.dispatch({type: 'INCREMENT'});
            }}
            onDecrement = {() => {
                store.dispatch({type: 'DECREMENT'});
            }}
        />,
        document.getElementById('react-container')
    );
}

store.subscribe(() => {//при изменении state store, рендерим с новым state стора
    render();
});
render();









