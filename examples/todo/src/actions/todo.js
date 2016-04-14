var Todo = require('../apis/todo')

module.exports = {
    create: function (_todo) {
        var todo
        try {
            todo = new Todo(_todo)
        } catch (err) {
            return this.error(err)
        }

        this._put(todo)
    }
  , remove: function (_todo) {
        if (! _todo.id) return this.error(new Error('"id" not found'))

        var me = this
        this.opt.storage.del(_todo.id, function (err) {
            if (err) me.error(err)
            else me._getTodos()
        })
    }
  , updateState: function (_todo) {
        var todo
        try {
            todo = _todo.updateState()
        } catch (err) {
            return this.error(err)
        }

        this._put(todo)
    }
  , getTodos: function () {
        this._getTodos()
    }
  , _getTodos: function () {
        var me    = this
        var todos = []
        this.opt.storage.createValueStream()
            .once('error', function (err) {me.error(err)})
            .on('data', function (todo) {
                todos.push(new Todo(todo))
            })
            .once('end', function () {
                me._publish({todos: todos})
            })
    }
  , _put: function (todo) {
        var me = this
        this.opt.storage.put(todo.id, todo, function (err) {
            if (err) me.error(err)
            else me._getTodos()
        })
    }
}
