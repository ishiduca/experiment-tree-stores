module.exports = {
    tap: function () {
        var n = parseInt(Math.random() * 10, 10)
        n ? this._publish(n) : this.error(new Error('"zero" is bad'))
    }
}
