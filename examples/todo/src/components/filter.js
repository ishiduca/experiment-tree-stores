var React = require('react')

var Filter = React.createClass({
    render: function () {
        return (
            <div className="control has-icon">
                <input
                    className="input"
                    type="search"
                    placeholder="grep"
                    onChange={this.handleChange}
                 />
                 <i className="fa fa-search-minus is-small"></i>
             </div>
        )
    }
  , handleChange: function (ev) {
        this.props.context.actFilter.search(ev.target.value)
    }
})

module.exports = Filter
