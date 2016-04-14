var React = require('react')

var Display = React.createClass({
    render: function () {
        var tap = this.props.tap
        return (
            <section
                className="hero"
            >
                <div
                    className="hero-content"
                >
                    <div
                        className="container"
                    >
                        <h1 className="title">Sum: {tap.sum || '0'}</h1>
                        <h2 className="subtitle">count: {tap.count || '0'}</h2>
                        <h2 className="subtitle">average: {tap.average || '0'}</h2>
                    </div>
                </div>
            </section>
        )
    }
})

module.exports = Display
