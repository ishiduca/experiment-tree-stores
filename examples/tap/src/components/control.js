var React = require('react')

var Control = React.createClass({
    render: function () {
        return (
            <section
                className="section"
            >
                <div
                    className="container"
                    style={{textAlign: "center"}}
                >
                    <button
                        className="button is-large"
                        type="button"
                        onClick={this.handleClick}
                    >
                        Tap !
                    </button>
                </div>
            </section>
        )
    }
  , handleClick: function () {
        this.props.context.actTap.tap()
    }
})

module.exports = Control
