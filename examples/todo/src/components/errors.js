var React  = require('react')

var Errors = React.createClass({
    render: function () {
        if (! this.props._error) return (<span></span>)

        return (
            <div className="modal is-active">
                <div className="modal-background"></div>
                <div className="modal-container">
                    <div className="modal-content">{this.props._error}</div>
                </div>
                <button
                    className="modal-close"
                    onClick={this.handleClose}
                ></button>
            </div>
        )
    }
  , handleClose: function () {
        this.props.context.actError.clear()
    }
})

module.exports = Errors
