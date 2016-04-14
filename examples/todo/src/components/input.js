var React = require('react')

var Input = React.createClass({
    render: function () {
        var todo = this.props.todo || {}

        return (
            <form
                className="control is-horizontal"
                action="javascript:void(0)"
                onSubmit={this.handleSubmit}
            >
                <input
                    className="input"
                    type="text"
                    placeholder="what needs to be done?"
                    required="required"
                    autofocus
                    value={todo.text || ''}
                    onChange={this.handleChange}
                    ref='todo_text'
                />
                <button
                    className="button"
                    type="submit"
                >
                    subscribe
                </button>
                    <i className="fa fa-penciel fa-small"></i>
                <button
                    className="button"
                    type="reset"
                    onClick={this.handleResetClick}
                >
                    reset
                </button>
            </form>
        )
    }
  , componentDidMount: function () {
        this.refs.todo_text.focus()
    }
  , handleSubmit: function (ev) {
        ev.preventDefault()
        this.props.context.actTodo.create(this.props.todo)
        this.props.context.actInputTodo.clearText()
        this.refs.todo_text.focus()
    }
  , handleChange: function (ev) {
        this.props.context.actInputTodo.updateText(ev.target.value)
    }
  , handleResetClick: function () {
        this.props.context.actInputTodo.clearText()
   }
})

module.exports = Input
