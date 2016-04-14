module.exports = {
    clear: function () {
        this._publish('')
    }
  , pubError: function (err) {
        this._publish(err)
    }
}
