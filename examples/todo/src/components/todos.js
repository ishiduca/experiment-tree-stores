var React = require('react')

var Todo = React.createClass({
    render: function () {
        var todo      = this.props.todo
        var isDone    = todo.stateStr === 'done'
        var isWorking = todo.stateStr === 'working'
        var Style  = {
            textDecoration: isDone ? 'line-through' : isWorking ? 'blink' : 'none'
          , fontWeight:     isWorking ? 'bold' : 'normal'
        }
        var stateColor = isDone ? 'is-success' : isWorking ? 'is-warning' : ''
        var icon = isDone ? 'fa-check' : isWorking ? 'fa-spinner fa-spin' : 'fa-stop-circle'
        return (
            <div className="columns">
                <div className="column is-1">
                    <a
                        className={'button ' + stateColor}
                        href="javascript:void(0)"
                        onClick={this.handleUpdateClick}
                    >
                        <span className="icon is-small">
                            <i className={'fa is-small ' + icon}></i>
                        </span>
                    </a>
                </div>
                <div className="column">
                    <p style={Style}>
                        {todo.text}
                        <span> ({todo.time})</span>
                    </p>
                </div>
                <div className="column is-1 has-icon">
                    <a
                        className="button"
                        href="javascript:void(0)"
                        onClick={this.handleRemoveClick}
                    >
                        <i className="fa fa-close fa-small"></i>
                    </a>
                    <a
                        className="button"
                        href="javascript:void(0)"
                        onClick={this.handlePrepareClick}
                    >
                        <i className="fa fa-pencil fa-small"></i>
                    </a>
                </div>
            </div>
        )
    }
  , handleRemoveClick: function () {
        if (window.confirm('本当に消していいんですか?'))
            this.props.context.actTodo.remove(this.props.todo)
    }
  , handlePrepareClick: function () {
        this.props.context.actInputTodo.prepare(this.props.todo)
    }
  , handleUpdateClick: function () {
        this.props.context.actTodo.updateState(this.props.todo)
    }
})

var Todos = React.createClass({
    render: function () {
        var context = this.props.context
        var todos   = this.props.todos || []
        return (
            <article>
                {
                    todos.map(function (todo) {
                        return (
                            <Todo
                                key={todo.id}
                                todo={todo}
                                context={context}
                            />
                        )
                    })
                }
            </article>
        )
    }
})

module.exports = Todos
