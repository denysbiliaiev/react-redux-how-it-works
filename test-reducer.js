'use strict'

import expect from 'expect';
import deepfreeze from 'deep-freeze';
import { todos, todo }from 'reducers';

const testAddTodo = () => {
    const stateBefore = [];

    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'learn redux'
    }

    const stateAfter = [{
        id: 0,
        text: 'learn redux',
        completed: false
    }]

    deepfreeze(stateBefore);
    deepfreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
}

const testToggleTodo = () => {
    const stateBefore = [{
        id: 0,
        text: 'learn redux',
        completed: false
    }];

    const action = {
        type: 'TOGGLE_TODO',
        id: 0,
    }

    const stateAfter = [{
        id: 0,
        text: 'learn redux',
        completed: true
    }]

    deepfreeze(stateBefore);
    deepfreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
}

testAddTodo();
testToggleTodo();

console.log('all tests passed');