'use strict'
var ReactDOM  = require('react-dom')
var React     = require('react')
var action    = require('experiment-tree-stores/action')
var store     = require('experiment-tree-stores/store')
var composite = require('experiment-tree-stores/store-composite')
var rt        = require('experiment-tree-stores')
var levelup   = require('levelup')
// vars
var INPUT  = 'Input'
var TODO   = 'Todo'
var ERROR  = 'Error'
var DBNAME = 'fo.todo'
var SORTS  = [
    ['created', +1]
  , ['created', -1]
  , ['state',   +1]
  , ['state',   -1]
]
// apis
var storage = levelup(DBNAME, {
    db: require('localstorage-down')
  , valueEncoding: 'json'
})
// actions
var actInputTodo = action(INPUT, null, require('./actions/input'))
var actTodo      = action(TODO, {storage: storage}, require('./actions/todo'))
var actFilter    = action(TODO, null, require('./actions/filter'))
var actSort      = action(TODO, null, require('./actions/sort'))
var actError     = action(ERROR, null, require('./actions/error'))
// stores (leaves)
var storeInputTodo = store({text: ''}, null, null, require('./stores/input'))
var storeTodo      = store({todos: []}, null, null, require('./stores/todo'))
var storeFilter    = store({filter: ''}, null, null, require('./stores/filter'))
var storeSort      = store({sort: SORTS[0]}, null, null, require('./stores/sort'))
// composites
var compInputTodo = composite(INPUT, null, [storeInputTodo], null, require('./stores/input-composite'))
var compTodo      = composite(TODO, null, [storeTodo, storeFilter, storeSort], null, require('./stores/todo-composite'))
var compError     = composite('Error', {_error: null}, null, null, require('./stores/error-composite'))
// connect
var root = rt(
    actInputTodo
  , actTodo
  , actFilter
  , actSort
  , actError
)(
    compInputTodo
  , compTodo
  , compError
)

var App = require('./components/app')
// mount
ReactDOM.render(<App
    context={{
        root: root
      , actInputTodo: actInputTodo
      , actTodo:      actTodo
      , actFilter:    actFilter
      , actSort:      actSort
      , actError:     actError
    }}
    sorts={SORTS}
/>, document.querySelector('#react-app'))
