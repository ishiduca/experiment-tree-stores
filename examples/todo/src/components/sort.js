var React = require('react')

var Button = React.createClass({
    render: function () {
        var cond = this.props.condition
        return (
            <li>
                <a
                    className="button"
                    href="javascript:void(0)"
                    onClick={this.handleClick}
                >
                    {cond[0] + ' ' + (cond[1] > 0 ? 'up' : 'down')}
                </a>
            </li>
        )
    }
  , handleClick: function () {
        this.props.context.actSort.change(this.props.condition)
    }

})

var Sort = React.createClass({
    render: function () {
        var context = this.props.context
        return (
            <div
                className="tabs is-boxed"
            >
                <ul>
                    {this.props.sorts.map(function (s, i) {
                        return (<Button key={i}
                                    condition={s}
                                    context={context}
                                />)
                    })}
                </ul>
            </div>
        )
    }
})

module.exports = Sort
