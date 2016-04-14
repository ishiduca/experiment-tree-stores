module.exports = {
    search: function (_val) {
        var val = (_val || '').trim()
        this._publish({filter: val.toLowerCase()})
    }
}
