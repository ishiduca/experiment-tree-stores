module.exports = {
    change: function (key_direction) {
        this._publish({sort: key_direction})
    }
}
