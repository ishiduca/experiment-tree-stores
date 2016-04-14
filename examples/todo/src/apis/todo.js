var xtend   = require('xtend')
var SHA256  = require('crypto-js/sha256')
var timeago = require('twitter-timeago')

module.exports = Todo

Todo.states       = [0, 1, 2]
Todo.stateStrings = ('pending working done').split(' ')

function Todo (_todo) {
    var todo = xtend(_todo)
    var text = (todo.text || '').trim()

    if (!text) throw new Error('"todo.text" not found')

    this.text     = text
    this.id       = todo.id || this.generateID()
    this.created  = todo.created || Date.now()
    this.state    = todo.state || 0
    this.stateStr = Todo.stateStrings[this.state]
}

Todo.prototype.copy = function () {
    return new Todo(this)
}

Todo.prototype.generateID = function () {
    return SHA256(this.text).toString()
}

Todo.prototype.updateState = function () {
    var todo = new Todo(this)
    todo.state    = (todo.state + 1) % Todo.states.length
    todo.stateStr = Todo.stateStrings[todo.state]
    return todo
}

Todo.prototype.match = function (filter) {
    if (! filter) return true
    return this.text.indexOf(filter) !== -1
}

Todo.prototype.addTimeAgo = function () {
    var todo = new Todo(this)
    todo.time = timeago(new Date(todo.created))
    return todo
}
