var React  = require('react')
var Input  = require('./input')
var Sort   = require('./sort')
var Todos  = require('./todos')
var Filter = require('./filter')
var Errors = require('./errors')

var App = React.createClass({
    render: function () {
        return (
            <article>
                <Input
                    context={this.props.context}
                    todo={this.state.todo}
                />
                <Sort
                    context={this.props.context}
                    sorts={this.props.sorts}
                />
                <Filter
                    context={this.props.context}
                />
                <Todos
                    context={this.props.context}
                    todos={this.state.todos}
                />
                <Errors
                    context={this.props.context}
                    _error={this.state._error}
                />
            </article>
        )
    }
  , getInitialState: function () {
        return {}
    }
  , componentDidMount: function () {
        var me   = this
        var root = this.props.context.root
        root.subscribe(function () {
            me.setState(root.getState())
        })
        root.addHandleError(function (err) {
            var error = Error.prototype.toString.apply(err)
            me.props.context.actError.pubError(error)
        })
        this.props.context.actTodo.getTodos()
    }
  , componentWillUnMount: function () {
        var root = this.props.context.root
        root.unsubscribe()
        root.addHandleError(null)
    }
})

module.exports = App
