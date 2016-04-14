var React = require('react')
var Display = require('./display')
var Control = require('./control')

var App = React.createClass({
    render: function () {
        return (
            <article>
                <Display
                    tap={this.state}
                />
                <Control
                    context={this.props.context}
                />
            </article>
        )
    }
  , getInitialState: function () {
        return {}
    }
  , componentDidMount: function () {
        var me = this
        var root = this.props.context.root
        root.subscribe(function () {
            me.setState(root.getState())
        })
        root.addHandleError(function (err) {
            alert(Error.prototype.toString.apply(err))
        })
    }
  , componentWillUnMount: function () {
        this.props.context.root.unsubscribe()
        this.props.context.root.handleError = null
    }
})

module.exports = App
